/**
 * Build-time GitHub API client used by the card components.
 *
 * Everything here runs during `astro build` / `astro dev` only — nothing is shipped to the browser.
 * Set GITHUB_TOKEN to raise the rate limit (60 → 5000 req/h). Private repositories are always
 * refused so a personal token can never leak private data into the public site.
 */
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export interface Repo {
  fullName: string;
  url: string;
  description: string | null;
  ownerAvatar: string;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  license: string | null;
  archived: boolean;
}

export interface Label {
  name: string;
  color: string;
}

export interface Issue {
  repo: string;
  number: number;
  url: string;
  title: string;
  state: 'open' | 'completed' | 'not_planned';
  author: string;
  authorAvatar: string;
  labels: Label[];
  comments: number;
  createdAt: string;
  closedAt: string | null;
}

export interface Pull {
  repo: string;
  number: number;
  url: string;
  title: string;
  state: 'open' | 'draft' | 'merged' | 'closed';
  author: string;
  authorAvatar: string;
  labels: Label[];
  additions: number;
  deletions: number;
  changedFiles: number;
  createdAt: string;
  mergedAt: string | null;
}

const API = 'https://api.github.com';
const CACHE_DIR = join(process.cwd(), 'node_modules', '.cache', 'github-cards');
const CACHE_TTL_MS = 60 * 60 * 1000;
const REPO_RE = /^[\w.-]+\/[\w.-]+$/;

// Dedupes concurrent requests for the same resource within one build.
const inflight = new Map<string, Promise<unknown>>();

class GitHubError extends Error {}

async function readCache(key: string): Promise<unknown | undefined> {
  try {
    const raw = JSON.parse(await readFile(join(CACHE_DIR, key), 'utf8'));
    if (Date.now() - raw.fetchedAt < CACHE_TTL_MS) return raw.data;
  } catch {
    // cache miss
  }
  return undefined;
}

async function writeCache(key: string, data: unknown): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(join(CACHE_DIR, key), JSON.stringify({ fetchedAt: Date.now(), data }));
}

async function api<T>(path: string): Promise<T> {
  const key = path.replace(/[^\w.-]/g, '_') + '.json';
  if (!inflight.has(key)) {
    inflight.set(
      key,
      (async () => {
        const cached = await readCache(key);
        if (cached !== undefined) return cached;

        const headers: Record<string, string> = {
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2022-11-28',
        };
        const token = process.env.GITHUB_TOKEN;
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API}${path}`, { headers });
        if (!res.ok) throw new GitHubError(`GET ${path} → ${res.status} ${res.statusText}`);
        const data = await res.json();
        await writeCache(key, data);
        return data;
      })(),
    );
  }
  return inflight.get(key) as Promise<T>;
}

function assertRepo(repo: string): void {
  if (!REPO_RE.test(repo)) throw new GitHubError(`invalid repository "${repo}", expected "owner/name"`);
}

async function assertPublic(repo: string): Promise<void> {
  const data = await api<{ private: boolean }>(`/repos/${repo}`);
  if (data.private) throw new GitHubError(`${repo} is private, refusing to render it`);
}

const toLabels = (labels: Array<{ name: string; color: string }>): Label[] =>
  labels.map(({ name, color }) => ({ name, color }));

export async function getRepo(repo: string): Promise<Repo> {
  assertRepo(repo);
  await assertPublic(repo);
  const r = await api<any>(`/repos/${repo}`);
  return {
    fullName: r.full_name,
    url: r.html_url,
    description: r.description,
    ownerAvatar: r.owner.avatar_url,
    language: r.language,
    stars: r.stargazers_count,
    forks: r.forks_count,
    topics: r.topics ?? [],
    license: r.license?.spdx_id && r.license.spdx_id !== 'NOASSERTION' ? r.license.spdx_id : null,
    archived: r.archived,
  };
}

export async function getIssue(repo: string, number: number): Promise<Issue> {
  assertRepo(repo);
  await assertPublic(repo);
  const i = await api<any>(`/repos/${repo}/issues/${number}`);
  if (i.pull_request) throw new GitHubError(`${repo}#${number} is a pull request, use <GitHubPR>`);
  return {
    repo,
    number,
    url: i.html_url,
    title: i.title,
    state: i.state === 'open' ? 'open' : i.state_reason === 'not_planned' ? 'not_planned' : 'completed',
    author: i.user.login,
    authorAvatar: i.user.avatar_url,
    labels: toLabels(i.labels),
    comments: i.comments,
    createdAt: i.created_at,
    closedAt: i.closed_at,
  };
}

export async function getPull(repo: string, number: number): Promise<Pull> {
  assertRepo(repo);
  await assertPublic(repo);
  const p = await api<any>(`/repos/${repo}/pulls/${number}`);
  return {
    repo,
    number,
    url: p.html_url,
    title: p.title,
    state: p.merged_at ? 'merged' : p.state === 'closed' ? 'closed' : p.draft ? 'draft' : 'open',
    author: p.user.login,
    authorAvatar: p.user.avatar_url,
    labels: toLabels(p.labels),
    additions: p.additions,
    deletions: p.deletions,
    changedFiles: p.changed_files,
    createdAt: p.created_at,
    mergedAt: p.merged_at,
  };
}

/**
 * Runs a fetcher and turns any failure into a build warning + `null`, so a GitHub outage,
 * rate limit or typo never breaks the build — the component renders a fallback link instead.
 */
export async function safe<T>(fetcher: () => Promise<T>, label: string): Promise<T | null> {
  try {
    return await fetcher();
  } catch (err) {
    console.warn(`[github-cards] ${label}: ${(err as Error).message}`);
    return null;
  }
}

export type ParsedUrl =
  | { kind: 'repo'; repo: string }
  | { kind: 'issue'; repo: string; number: number }
  | { kind: 'pull'; repo: string; number: number };

export function parseGitHubUrl(url: string): ParsedUrl | null {
  const m = /^https:\/\/github\.com\/([\w.-]+\/[\w.-]+?)(?:\.git)?(?:\/(issues|pull)\/(\d+))?\/?$/.exec(url);
  if (!m) return null;
  const [, repo, type, num] = m;
  if (!type) return { kind: 'repo', repo };
  return { kind: type === 'pull' ? 'pull' : 'issue', repo, number: Number(num) };
}

export const compactNumber = (n: number): string =>
  new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n);

export const formatDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
