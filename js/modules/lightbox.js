/* Photo viewer for galleries marked [data-gallery].
   Each thumbnail is a normal link to the larger image, so without
   JavaScript it simply opens the photo. With it, photos open in a <dialog>
   with previous/next buttons, arrow keys and swipe. */
let dialog, img, caption, counter, items = [], index = 0;

export function init() {
  build();
  for (const gallery of document.querySelectorAll('[data-gallery]')) {
    const links = [...gallery.querySelectorAll('a[href]')];
    links.forEach((link, i) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        items = links;
        show(i);
        dialog.showModal();
      });
    });
  }
}

function build() {
  dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', 'Photo viewer');
  dialog.innerHTML = `
    <figure>
      <img alt="">
      <figcaption>
        <span class="caption"></span>
        <span class="controls">
          <span class="counter" aria-live="polite"></span>
          <button class="icon-btn" type="button" data-prev aria-label="Previous photo"><svg class="icon" aria-hidden="true"><use href="/assets/icons/sprite.svg#chevron-left"></use></svg></button>
          <button class="icon-btn" type="button" data-next aria-label="Next photo"><svg class="icon" aria-hidden="true"><use href="/assets/icons/sprite.svg#chevron-right"></use></svg></button>
          <button class="icon-btn" type="button" data-close aria-label="Close photo viewer"><svg class="icon" aria-hidden="true"><use href="/assets/icons/sprite.svg#close"></use></svg></button>
        </span>
      </figcaption>
    </figure>`;
  document.body.append(dialog);
  img = dialog.querySelector('img');
  caption = dialog.querySelector('.caption');
  counter = dialog.querySelector('.counter');

  dialog.querySelector('[data-prev]').addEventListener('click', () => step(-1));
  dialog.querySelector('[data-next]').addEventListener('click', () => step(1));
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') step(1);
    if (event.key === 'ArrowLeft') step(-1);
  });

  let startX = null;
  img.addEventListener('pointerdown', (e) => { startX = e.clientX; });
  img.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
    startX = null;
  });
}

function step(delta) {
  show((index + delta + items.length) % items.length);
}

function show(i) {
  index = i;
  const link = items[i];
  const thumb = link.querySelector('img');
  img.src = link.href;
  img.alt = thumb?.alt || '';
  caption.textContent = link.closest('figure')?.querySelector('figcaption')?.textContent.trim() || thumb?.alt || '';
  counter.textContent = `${i + 1} of ${items.length}`;
  const single = items.length < 2;
  dialog.querySelector('[data-prev]').hidden = single;
  dialog.querySelector('[data-next]').hidden = single;
}
