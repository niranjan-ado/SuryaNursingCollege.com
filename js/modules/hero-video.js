/* Home page hero film.
   The poster photo is always there first (it is the largest paint, so the
   page is fast). The looping drone clip is only added when it is cheap and
   welcome: not when the visitor prefers reduced motion, has data saver on,
   or is on a slow connection. A pause button is always offered (WCAG 2.2.2),
   and the clip pauses itself when scrolled off screen or the tab is hidden. */
export function init() {
  const holder = document.querySelector('[data-hero-video]');
  const button = document.querySelector('.hero-pause');
  if (!holder) return;

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const conn = navigator.connection || {};
  const slow = conn.saveData || /(^|-)2g|3g/.test(conn.effectiveType || '');
  if (reduced || slow) return;

  const video = document.createElement('video');
  Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: true, preload: 'auto' });
  video.setAttribute('aria-hidden', 'true');
  video.poster = holder.querySelector('img')?.currentSrc || '';
  // WebM (VP9) is smaller; MP4 (H.264) is the fallback for older Safari.
  const webm = holder.dataset.heroWebm;
  video.src = webm && video.canPlayType('video/webm; codecs="vp9"') ? webm : holder.dataset.heroVideo;
  video.style.opacity = '0';
  video.style.transition = 'opacity 0.8s';
  video.addEventListener('playing', () => { video.style.opacity = '1'; }, { once: true });
  holder.append(video);

  let userPaused = false;
  if (button) {
    button.hidden = false;
    button.addEventListener('click', () => {
      userPaused = !video.paused;
      if (userPaused) video.pause(); else video.play();
      button.setAttribute('aria-pressed', String(userPaused));
      button.setAttribute('aria-label', userPaused ? 'Play background video' : 'Pause background video');
    });
  }

  const resume = () => { if (!userPaused) video.play().catch(() => {}); };
  new IntersectionObserver(([entry]) => (entry.isIntersecting ? resume() : video.pause())).observe(holder);
  document.addEventListener('visibilitychange', () => (document.hidden ? video.pause() : resume()));
}
