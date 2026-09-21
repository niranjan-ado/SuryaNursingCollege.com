# suryanursingcollege.com

Website of **Surya Nursing Educational College**, Sobhanpur Bhatta, Sahibganj, Jharkhand.
Hand-written HTML, CSS and JavaScript. No framework, no build step, no dependencies.
Hosted on Azure Static Web Apps, deployed from `main` by GitHub Actions.

Designed, built and maintained by Niranjan Ramamurthy ([Adostrophe](https://adostrophe.com/)).

---

## Version 2 (September 2026): what changed and why

### Design concept: day and night
The college's logo is a sun (*Surya*) and its motto is **अहर्निशं सेवामहे**, "we serve, day and night".
The redesign takes both literally:

- **Day** (light theme): paper white with the logo's sun orange `#FF8500`.
- **Night** (dark theme): deep indigo `#16133A` with marigold `#FFC247`.
- Inner pages open on a night-blue band with a CSS-only sun rising on its lower edge.
- The home page opens on the college's own drone footage of the building at sunset.

Type is **Anek Latin** (headings, variable width axis used for the condensed hero wordmark) and
**Mukta** (body), both from the Indian foundry Ek Type. Both have Devanagari companions, so a
Hindi version of the site can use the same families. The motto is set in Anek Devanagari, subset to
just the glyphs used (29 KB, only downloaded on pages that show Devanagari).

### Problems fixed from version 1

| Problem | Fix |
|---|---|
| Enquiry form posted to `/submit-inquiry`, which never existed. Every enquiry since launch was lost. | Form now writes a WhatsApp message to the admissions number and opens WhatsApp. "Call instead" alongside. No server to break. |
| `/academics` didn't exist; 8 menu links on every page returned 404. | New Academics page: clinical training, field visits, extracurricular, seminars, anti-ragging, careers, approvals. |
| 18 images saved without file extensions, requested as `.jpg`: broken on labs, Red Cross and service pages. | All images renamed (kebab-case), re-encoded, correctly referenced. |
| `blog/why-choose-nursing` was a byte-for-byte copy of the exam-prep article. | New original article. |
| Google Map on the contact page blocked by the Content Security Policy (no `frame-src`). | CSP rewritten; map loads. |
| GTM container loaded with the gtag.js loader (wrong script). | Proper `gtm.js` loader in `js/analytics.js`. |
| CSS/JS cached for one year with no version numbers, so returning visitors could get stale files forever. | CSS/JS revalidate (`max-age=0, must-revalidate`); images/fonts/video stay immutable. |
| `site.webmanifest` and `safari-pinned-tab.svg` referenced on every page but missing. | Manifest added; dead reference removed. |
| No Open Graph tags on several pages; og images were WebP (not shown by WhatsApp/Facebook). | Every page has OG tags; 1200×630 JPG share images. |
| 520 inline `style=""` attributes, 51 inline `onclick` handlers, footers drifted apart across pages. | Zero inline styles or handlers. Shared blocks identical on every page. |
| Mobile dropdown got stuck open; theme choice saved on every load (stopped following the phone's setting). | Navigation and theme rewritten. |
| 13 MB of images, faculty photos 300 to 530 KB each, GPS location embedded in one photo. | 5.2 MB total, two WebP sizes per photo, all metadata stripped. |
| 183 MB promo video unused. | 1.2 MB hero loop (WebM + MP4) and a 21 MB 720p film with `preload="none"`. |

Content rule for this revision: nothing written on the old site was removed except the two staff
members the college asked to take down. Wording was only changed where it was a button label or
heading style.

### Performance
First visit to the home page on a phone is about **190 KB** before the optional video:
HTML 7 KB, CSS 11 KB, JS 4 KB (all gzipped), fonts ~100 KB, hero photo 42 KB.
The drone loop is added only when the visitor hasn't asked for reduced motion, doesn't have Data
Saver on, and isn't on a 2G/3G connection. It pauses when scrolled away or the tab is hidden.

### Quality checks run before release
- 23 automated browser tests (Playwright): menus, mobile menu with focus handling, day/night toggle
  and persistence, enquiry validation and WhatsApp hand-off, course preselect, syllabus tabs and
  keyboard control, photo viewer, video pause, reduced motion, and the site with JavaScript off.
- `html-validate` (recommended ruleset + no inline styles): 0 errors across all 21 pages.
- axe-core (WCAG 2.1 AA + best practices), day and night themes: 0 violations.
- No horizontal scrolling at 390 px.
- Old-vs-new text comparison on every page to confirm no content was dropped.

---

## Project structure

```
/                       HTML pages (one file per page, clean URLs: /about serves about.html)
/blog/                  articles + author page
/css/styles.css         the only stylesheet
/js/boot.js             runs before paint: theme + no-js flag (tiny, not deferred)
/js/analytics.js        Google Tag Manager loader
/js/main.js             ES module entry; imports the modules below
/js/modules/            header, nav, theme, inquiry (site-wide)
                        tabs, lightbox, hero-video (loaded only on pages that use them)
/assets/images/         WebP photos (name-640.webp / name-1280.webp), OG JPGs, icons
/assets/fonts/          self-hosted, subset WOFF2
/assets/icons/sprite.svg  all icons, used as <svg><use href="/assets/icons/sprite.svg#name">
/assets/video/          hero loop + campus film
staticwebapp.config.json  redirects, 404, caching, security headers (CSP)
```

## How to edit

### Shared blocks (header, footer, head)
Every page contains identical copies of three blocks, marked:

```html
<!-- SHARED:HEAD START --> ... <!-- SHARED:HEAD END -->
<!-- SHARED:HEADER START --> ... <!-- SHARED:HEADER END -->
<!-- SHARED:FOOTER START --> ... <!-- SHARED:FOOTER END -->
```

To change the menu or footer: edit one page, copy the block, then in VS Code use
**Find in Files** (regex on) with
`<!-- SHARED:HEADER START -->[\s\S]*?<!-- SHARED:HEADER END -->` and replace all.
The current menu item is highlighted by `nav.js`, so the blocks stay identical.

### CSS
`styles.css` is organised in cascade layers:
`reset → tokens → base → layout → components → utilities`.
A later layer always wins, so utilities never need `!important`.

- Colours live only in `@layer tokens` as semantic variables (`--bg`, `--text`, `--accent` …)
  written with `light-dark(dayValue, nightValue)`. Change a colour once and both themes follow.
- Type and spacing are fluid: `--step--1` … `--step-5`, `--space-3xs` … `--space-3xl`.
- Do not add `style=""` attributes. The CSP forbids them and the browser will ignore them.

### Adding a photo
1. Export two WebP files: `my-photo-640.webp` and `my-photo-1280.webp` (quality ~75, no EXIF/GPS).
2. Use:
   ```html
   <img src="/assets/images/my-photo-1280.webp"
        srcset="/assets/images/my-photo-640.webp 640w, /assets/images/my-photo-1280.webp 1280w"
        sizes="(min-width: 64rem) 50vw, 100vw" width="1280" height="853"
        alt="Describe what is in the photo" loading="lazy" decoding="async">
   ```
3. Images are cached for a year. **Never overwrite a file in place.** Give a changed photo a new name.

### Adding an icon
Copy a Material Symbols SVG (outlined, 24px) into `assets/icons/sprite.svg` as
`<symbol id="name" viewBox="0 -960 960 960">…paths…</symbol>`, then use
`<svg class="icon" aria-hidden="true"><use href="/assets/icons/sprite.svg#name"></use></svg>`.

### Enquiry form
Lives in the shared footer (dialog) and on `/contact#enquire`.
The WhatsApp number is the `WHATSAPP_NUMBER` constant in `js/modules/inquiry.js`.
Any link with `data-inquiry` opens the dialog; `data-program="anm|gnm|bsc"` preselects a course.
Submissions push `inquiry_whatsapp` to the GTM dataLayer.

### Security headers
`staticwebapp.config.json` sets a strict CSP: scripts only from this site, Google Tag Manager and
Cloudflare Insights; no inline scripts or styles; frames only from Google (Maps, GTM).
If a new third-party service is added (a chat widget, a YouTube embed), its domain must be added
to the CSP or it will be silently blocked.
If Cloudflare sits in front of the site, keep **Rocket Loader off**: it rewrites script tags and
will break the ES modules.

## Local preview
Clean URLs need a server that maps `/about` to `about.html`. With VS Code, the Live Server
extension works for most pages if you open `about.html` directly. Otherwise any static server
with "clean URLs" support, e.g. `npx serve .`

## Deploy
Push to `main` → GitHub Actions → Azure Static Web Apps.
Open a pull request instead to get a private preview URL for review before going live.
