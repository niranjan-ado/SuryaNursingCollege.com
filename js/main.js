/* main.js — entry point, loaded as an ES module (deferred by default).
   Site-wide behaviour is imported up front. Page-specific features are
   imported only on pages that need them, so the syllabus tabs code never
   downloads on the contact page, and so on. No bundler involved: this is
   the browser's own module loader. */
import { initHeader } from './modules/header.js';
import { initNav } from './modules/nav.js';
import { initTheme } from './modules/theme.js';
import { initInquiry } from './modules/inquiry.js';

initHeader();
initNav();
initTheme();
initInquiry();

const lazy = [
  ['[data-tabs]', './modules/tabs.js'],
  ['[data-gallery]', './modules/lightbox.js'],
  ['[data-hero-video]', './modules/hero-video.js'],
];
for (const [selector, path] of lazy) {
  if (document.querySelector(selector)) {
    import(path).then((mod) => mod.init()).catch((err) => console.error(`Could not load ${path}`, err));
  }
}

const year = document.querySelector('[data-year]');
if (year) year.textContent = String(new Date().getFullYear());
