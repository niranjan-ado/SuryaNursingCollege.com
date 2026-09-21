/* boot.js — runs before first paint (loaded without defer, and tiny).
   1. Marks that JavaScript is available (CSS uses .no-js for fallbacks).
   2. Applies the saved day/night choice so the page never flashes the wrong theme.
   If nothing is saved, CSS follows the device setting on its own. */
(function () {
  var root = document.documentElement;
  root.classList.remove('no-js');
  try {
    var saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
  } catch (e) { /* storage blocked: fall back to the device setting */ }
})();
