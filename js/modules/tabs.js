/* Accessible tabs for the syllabus pages (WAI-ARIA tabs pattern).
   The HTML works without this file: every panel is visible, one after
   another, each with its own heading. This script turns them into tabs,
   supports arrow keys / Home / End, and keeps the URL hash in sync so a
   link like /anm-syllabus#clinical opens the right tab. */
export function init() {
  for (const root of document.querySelectorAll('[data-tabs]')) enhance(root);
}

function enhance(root) {
  const list = root.querySelector('[role="tablist"]');
  const tabs = [...root.querySelectorAll('[role="tab"]')];
  const panels = tabs.map((tab) => document.getElementById(tab.getAttribute('aria-controls')));
  if (!list || !tabs.length) return;

  list.hidden = false;
  root.classList.add('is-enhanced');

  const select = (index, { focus = false, updateHash = true } = {}) => {
    tabs.forEach((tab, i) => {
      const on = i === index;
      tab.setAttribute('aria-selected', String(on));
      tab.tabIndex = on ? 0 : -1;
      panels[i].hidden = !on;
    });
    if (focus) tabs[index].focus();
    if (updateHash) history.replaceState(null, '', `#${panels[index].id}`);
  };

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(i));
    tab.addEventListener('keydown', (event) => {
      const last = tabs.length - 1;
      const moves = { ArrowRight: i === last ? 0 : i + 1, ArrowLeft: i === 0 ? last : i - 1, Home: 0, End: last };
      if (event.key in moves) {
        event.preventDefault();
        select(moves[event.key], { focus: true });
      }
    });
  });

  const fromHash = () => {
    const i = panels.findIndex((p) => `#${p.id}` === location.hash);
    select(i >= 0 ? i : 0, { updateHash: false });
  };
  fromHash();
  window.addEventListener('hashchange', fromHash);
}
