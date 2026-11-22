// Subset of GitHub linguist colors (https://github.com/github-linguist/linguist).
export const languageColors: Record<string, string> = {
  TypeScript: '#3178c6',
  JavaScript: '#f1e05a',
  Svelte: '#ff3e00',
  Vue: '#41b883',
  Astro: '#ff5a03',
  HTML: '#e34c26',
  CSS: '#663399',
  Go: '#00add8',
  Rust: '#dea584',
  Python: '#3572a5',
  Java: '#b07219',
  Kotlin: '#a97bff',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  Shell: '#89e051',
  Dockerfile: '#384d54',
  Nix: '#7e7eff',
  Lua: '#000080',
  Ruby: '#701516',
  PHP: '#4f5d95',
  Swift: '#f05138',
  Zig: '#ec915c',
};

export const languageColor = (language: string): string => languageColors[language] ?? '#8b949e';
