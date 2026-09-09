'use strict';

/* Shared page furniture: <head>, header, footer and the full-screen clip player.
   Page templates call layout({...}) and pass their own <main> markup in as `body`. */

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Content files use real line breaks; the design wants them as <br>. */
const lines = (s) => esc(s).replace(/\n/g, '<br>');

const button = (label, href, { ghost = false, arrow = '↗', external = false, style = '' } = {}) =>
  `<a class="button${ghost ? ' ghost' : ''}" href="${esc(href)}"` +
  (external ? ' target="_blank" rel="noopener"' : '') +
  (style ? ` style="${esc(style)}"` : '') +
  `>${esc(label)} <span class="arrow">${arrow}</span></a>`;

const NAV = [
  { href: '/events/', label: 'Events' },
  { href: '/past-events/', label: 'Past events' },
  { href: '/hire/', label: 'Production & hire' },
  { href: '/shop/', label: 'Shop', badge: 'SOON' },
];

function header(site, current, contactHref) {
  const items = NAV.map((item) => {
    const active = item.href === current ? ' aria-current="page"' : '';
    const badge = item.badge ? ` <small>${esc(item.badge)}</small>` : '';
    return `    <a${active} href="${esc(item.href)}">${esc(item.label)}${badge}</a>`;
  }).join('\n');

  return `<header class="header">
  <a class="logo brand-logo" href="/" aria-label="Sonido Events home"><span class="wordmark"></span></a>
  <button class="menu" aria-expanded="false" aria-controls="navigation">Menu +</button>
  <nav class="nav" id="navigation" aria-label="Main navigation">
${items}
    <a class="contact" href="${esc(contactHref)}" target="_blank" rel="noopener">Get in touch ↗</a>
  </nav>
</header>`;
}

function footer(site, instaHref, instaHandle) {
  return `<footer class="foot">
  <div class="foot-top">
    <a href="/" class="foot-brand brand-logo" aria-label="Sonido Events home"><span class="wordmark"></span></a>
    <a href="${esc(instaHref)}" target="_blank" rel="noopener">${esc(site.footerFollowLabel)}<br><br>${esc(instaHandle)} ↗</a>
  </div>
  <div class="foot-bottom">
    <span>${esc(site.footerCopyright)}</span>
    <span>${esc(site.footerLocation)}</span>
    <span>${esc(site.footerServices)}</span>
  </div>
</footer>`;
}

/* The player is only emitted on pages that actually have clip tiles. */
function player({ count, nightTitle, firstCaption, firstTime, extraAction }) {
  return `<div class="player" role="dialog" aria-modal="true" aria-label="Clip player" aria-hidden="true">
  <div class="player-top">
    <span><b data-player-count>01 / ${esc(String(count).padStart(2, '0'))}</b> · SONIDO ${esc(nightTitle)}</span>
    <span data-player-caption>${esc(firstCaption)}</span>
  </div>
  <div class="player-stage">
    <button class="pbtn" type="button" data-action="prev" aria-label="Previous clip">←</button>
    <video playsinline controlslist="nodownload" preload="auto"></video>
    <button class="pbtn" type="button" data-action="next" aria-label="Next clip">→</button>
  </div>
  <div class="player-bottom">
    <div class="player-rail"><i></i></div>
    <div class="player-actions">
      <span data-player-time>${esc(firstTime)}</span>
      <div class="group">
        <button type="button" data-sound>Sound on</button>
        ${extraAction}
        <button type="button" data-action="close" data-close>Close ✕</button>
      </div>
    </div>
  </div>
</div>`;
}

/* One clip tile. Used by both the homepage recap and the archive reel;
   app.js reads the data- attributes, so the markup must stay identical. */
function tile(clip, { labelStyle = 'short' } = {}) {
  const label =
    labelStyle === 'long'
      ? `Play clip ${clip.number} — ${clip.time}, ${clip.caption}`
      : `Play clip — ${clip.time}, ${String(clip.caption).toLowerCase()}`;

  return `<button class="tile" type="button" data-time="${esc(clip.time)}" data-caption="${esc(clip.caption)}"
        data-full="${esc(clip.full)}" data-poster="${esc(clip.poster)}"
        aria-label="${esc(label)}">
  <span class="tile-media">
    <img src="${esc(clip.poster)}" alt="" width="360" height="640" loading="lazy" decoding="async">
    <video data-src="${esc(clip.loop)}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>
  </span>
  <span class="tile-index">${esc(clip.number)}</span>
  <span class="tile-label"><b>${esc(clip.time)}</b><span>${esc(clip.caption)} ↗</span></span>
</button>`;
}

function layout({ site, page, current, contactHref, instaHref, instaHandle, body, playerHtml = '' }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="${esc(site.themeColor)}">
<meta name="description" content="${esc(page.description || site.defaultDescription)}">
<title>${esc(page.title)}</title>
<link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/favicon.png">
<link rel="preload" as="image" href="/assets/sonido-mark.png">
<link rel="stylesheet" href="/styles.css">
<script src="/app.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

${header(site, current, contactHref)}

<main id="main">
${body}
</main>

${footer(site, instaHref, instaHandle)}
${playerHtml ? '\n' + playerHtml + '\n' : ''}
</body>
</html>
`;
}

module.exports = { esc, lines, button, layout, player, tile };
