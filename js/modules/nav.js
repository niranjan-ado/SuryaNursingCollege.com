/* Primary navigation.
   - Each top-level item is a real link; submenus open from a separate
     button (the "disclosure navigation" pattern), so a tap on "Courses"
     goes to the courses page and the chevron opens the list.
   - On small screens the whole menu becomes a panel. While it is open the
     rest of the page is made inert, so keyboard focus stays inside it. */
const DESKTOP = window.matchMedia('(min-width: 64rem)');

export function initNav() {
  const nav = document.getElementById('primary-nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav) return;

  const root = document.documentElement;

  // The header is identical on every page (easy to update by hand), so the
  // current page is marked here rather than in each page's HTML.
  const here = location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
  for (const link of nav.querySelectorAll('a[href]')) {
    const url = new URL(link.href, location.href);
    const path = url.pathname.replace(/\/$/, '') || '/';
    if (url.hash || path !== here) continue;
    link.setAttribute('aria-current', 'page');
    link.closest('.submenu')?.closest('.nav-item')?.classList.add('is-current');
  }

  const outside = () => document.querySelectorAll('main, .site-footer, .action-bar');
  const submenuButtons = [...nav.querySelectorAll('.submenu-toggle')];

  // ----- submenus -----
  const closeSubmenus = (except) => {
    for (const btn of submenuButtons) {
      if (btn === except) continue;
      btn.setAttribute('aria-expanded', 'false');
      btn.closest('.nav-item').classList.remove('is-open');
    }
  };

  for (const btn of submenuButtons) {
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      closeSubmenus(btn);
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('.nav-item').classList.toggle('is-open', open);
    });
  }

  // ----- mobile panel -----
  const setPanel = (open, { restoreFocus = true } = {}) => {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    root.classList.toggle('nav-open', open);
    for (const el of outside()) el.inert = open;
    if (open) {
      // preventScroll: without it the browser scrolls the page behind the drawer
      nav.querySelector('a, button')?.focus({ preventScroll: true });
    } else {
      closeSubmenus();
      if (restoreFocus) toggle.focus({ preventScroll: true });
    }
  };

  toggle?.addEventListener('click', () => setPanel(toggle.getAttribute('aria-expanded') !== 'true'));

  // Leaving the mobile layout with the panel open should not strand the page as inert.
  DESKTOP.addEventListener('change', () => {
    if (root.classList.contains('nav-open')) setPanel(false, { restoreFocus: false });
    closeSubmenus();
  });

  // Escape closes the innermost open thing and returns focus to its button.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    const openBtn = submenuButtons.find((b) => b.getAttribute('aria-expanded') === 'true');
    if (openBtn) {
      closeSubmenus();
      openBtn.focus({ preventScroll: true });
    } else if (root.classList.contains('nav-open')) {
      setPanel(false);
    }
  });

  // Clicking anywhere else closes desktop submenus. On mobile, a tap on the
  // dimmed backdrop (a pseudo-element of the header, so the event target is the
  // header itself) closes the drawer.
  const header = document.querySelector('.site-header');
  document.addEventListener('click', (event) => {
    if (root.classList.contains('nav-open') && event.target === header) {
      setPanel(false);
      return;
    }
    if (!nav.contains(event.target)) closeSubmenus();
  });

  // Following an in-page link from the mobile menu should close the panel.
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a') && root.classList.contains('nav-open')) setPanel(false, { restoreFocus: false });
  });
}
