<script lang="ts">
  // Rendered with client:only — the initial theme is set by the inline script in Base.astro
  // before first paint, this island only flips and persists it.
  let theme = $state(document.documentElement.dataset.theme ?? 'light');

  function toggle() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
  }
</script>

<button onclick={toggle} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
  {theme === 'dark' ? '☀' : '☾'}
</button>

<style>
  button {
    width: 2rem;
    height: 2rem;
    border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
    border-radius: 4px;
    background: transparent;
    color: inherit;
    font-size: 0.95rem;
    cursor: pointer;
  }
  button:hover {
    border-color: var(--accent);
    color: var(--accent);
  }
</style>
