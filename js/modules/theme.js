/* Day / night toggle. The choice is only saved when someone clicks, so
   visitors who never touch it keep following their phone's setting. */
export function initTheme() {
  const button = document.querySelector('.theme-toggle');
  if (!button) return;
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');

  const current = () => root.getAttribute('data-theme') || (system.matches ? 'dark' : 'light');

  const sync = () => {
    const theme = current();
    button.setAttribute('aria-label', theme === 'dark' ? 'Switch to day mode' : 'Switch to night mode');
    button.setAttribute('aria-pressed', String(theme === 'dark'));
    const colour = getComputedStyle(document.body).backgroundColor;
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) meta.content = colour;
  };

  // Without a saved choice, reflect the device theme so the icon is right.
  if (!root.hasAttribute('data-theme')) root.setAttribute('data-theme', current());

  button.addEventListener('click', () => {
    const next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch { /* private mode */ }
    sync();
  });

  system.addEventListener('change', () => {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch { /* ignore */ }
    if (!saved) root.setAttribute('data-theme', system.matches ? 'dark' : 'light');
    sync();
  });

  sync();
}
