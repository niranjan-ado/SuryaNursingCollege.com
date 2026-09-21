/* analytics.js — Google Tag Manager loader.
   Kept in its own file (not an inline snippet) so the Content Security Policy
   can forbid inline scripts. Container ID is unchanged from the old site. */
(function (w, d, id) {
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
  var s = d.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtm.js?id=' + id;
  d.head.appendChild(s);
})(window, document, 'GTM-N8F7DD47');
