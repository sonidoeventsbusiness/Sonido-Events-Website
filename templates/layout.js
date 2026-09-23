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

/* U+FE0E pins these to their text glyph. Without it some phones render the
   arrow as a full-colour emoji, which is not the look. */
const ARROW = '↗︎';
const ARROW_DOWN = '↓︎';

const button = (label, href, { ghost = false, arrow = ARROW, external = false, style = '' } = {}) =>
  `<a class="button${ghost ? ' ghost' : ''}" href="${esc(href)}"` +
  (external ? ' target="_blank" rel="noopener"' : '') +
  (style ? ` style="${esc(style)}"` : '') +
  `>${esc(label)} <span class="arrow">${arrow}</span></a>`;

const NAV = [
  { href: '/events/', label: 'Events' },
  { href: '/past-events/', label: 'Past events' },
  { href: '/production/', label: 'Production' },
  { href: '/hire/', label: 'Hire' },
  { href: '/shop/', label: 'Shop', badge: 'SOON' },
];

function header(site, current, contactHref, path) {
  const here = path || current;
  const items = NAV.map((item) => {
    // aria-current="page" only on the exact page; a parent section
    // (Hire, while on a hire package) is highlighted with a class instead.
    const active = item.href === here ? ' aria-current="page"'
      : item.href === current ? ' class="is-parent"' : '';
    const badge = item.badge ? ` <small>${esc(item.badge)}</small>` : '';
    const link = `<a${active} href="${esc(item.href)}">${esc(item.label)}${badge}</a>`;

    // Hire gets a dropdown of its categories. build.js puts them on
    // site.hireMenu from content/hire.json, so the menu follows the editor.
    const sub = item.href === '/hire/' && Array.isArray(site.hireMenu) && site.hireMenu.length
      ? site.hireMenu : null;
    if (!sub) return `    ${link}`;
    return `    <div class="nav-drop">
      ${link}
      <div class="nav-sub">
        ${sub.map((c) => `<a${c.href === here ? ' aria-current="page"' : ''} href="${esc(c.href)}">${esc(c.label)}</a>`).join('\n        ')}
      </div>
    </div>`;
  }).join('\n');

  return `<header class="header">
  <a class="logo brand-logo" href="/" aria-label="Sonido Events home"><span class="wordmark"></span></a>
  <button class="menu" aria-expanded="false" aria-controls="navigation">Menu +</button>
  <nav class="nav" id="navigation" aria-label="Main navigation">
${items}
    <a class="contact" href="${esc(contactHref)}">Get in touch ${ARROW}</a>
  </nav>
</header>`;
}

function footer(site, instaHref, instaHandle) {
  return `<footer class="foot">
  <div class="foot-top">
    <a href="/" class="foot-brand brand-logo" aria-label="Sonido Events home"><span class="wordmark"></span></a>
    <div class="foot-contact">
      <a href="${esc(instaHref)}" target="_blank" rel="noopener">${esc(site.footerFollowLabel)}<br><br>${esc(instaHandle)} ${ARROW}</a>
      <a href="mailto:${esc(site.email)}">${esc(site.emailLabel)}<br><br>${esc(site.email)}</a>
    </div>
  </div>
  <nav class="foot-links" aria-label="More">
    <a href="/about/">About</a>
    <a href="/faq/">FAQ</a>
    <a href="/production/">Production</a>
    <a href="/hire/">Equipment hire</a>
  </nav>
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
    <button class="pbtn" type="button" data-action="prev" aria-label="Previous clip">←︎</button>
    <video playsinline controlslist="nodownload" preload="auto"></video>
    <button class="pbtn" type="button" data-action="next" aria-label="Next clip">→︎</button>
  </div>
  <div class="player-bottom">
    <div class="player-rail"><i></i></div>
    <div class="player-actions">
      <span data-player-time>${esc(firstTime)}</span>
      <div class="group">
        <button type="button" data-sound>Sound on</button>
        ${extraAction}
        <button type="button" data-action="close" data-close>Close ✕︎</button>
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
  <span class="tile-label"><b>${esc(clip.time)}</b><span>${esc(clip.caption)} ${ARROW}</span></span>
</button>`;
}

/* The mailing list block. Lives on the homepage and the events page, sharing
   one Netlify form name so submissions collect in a single list.
   `form-name` and the honeypot are what Netlify's form handling expects. */
function signupSection(signup, source = 'site') {
  return `<section class="section signup" id="signup">
  <div class="signup-copy">
    <span class="eyebrow green">${esc(signup.eyebrow)}</span>
    <h2>${lines(signup.heading)}</h2>
    <p>${esc(signup.copy)}</p>
  </div>
  <form class="signup-form" name="newsletter" method="POST" action="/thanks/"
        data-netlify="true" data-netlify-honeypot="bot-field">
    <input type="hidden" name="form-name" value="newsletter">
    <input type="hidden" name="source" value="${esc(source)}">
    <p class="signup-gotcha"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
    <div class="field">
      <label class="eyebrow" for="signup-name">${esc(signup.nameLabel)}</label>
      <input id="signup-name" name="name" type="text" autocomplete="given-name">
    </div>
    <div class="field">
      <label class="eyebrow" for="signup-email">${esc(signup.emailLabel)}</label>
      <input id="signup-email" name="email" type="email" required autocomplete="email">
    </div>
    <button class="button" type="submit">${esc(signup.buttonLabel)} <span class="arrow">${ARROW}</span></button>
    <p class="signup-small">${esc(signup.smallPrint)}</p>
  </form>
</section>`;
}

/* Structured data. Sonido has no public shopfront, so this describes the
   organisation and the area it serves rather than claiming a street address. */
function structuredData(site) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: site.brandName,
    url: site.url,
    logo: site.url + '/assets/sonido-mark.png',
    image: site.url + site.ogImage,
    description: site.shortDescription,
    email: site.email,
    areaServed: { '@type': 'Place', name: site.areaServed },
    sameAs: [site.instagramEvents, site.instagramHire].filter(Boolean),
  };

  // Name the services in the terms people search for. No address is claimed —
  // Sonido has no shopfront, so this stays an Organization serving an area
  // rather than a LocalBusiness pinned to a street.
  if (Array.isArray(site.services) && site.services.length) {
    data.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: `${site.brandName} services`,
      itemListElement: site.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
          areaServed: { '@type': 'Place', name: site.areaServed },
          provider: { '@type': 'Organization', name: site.brandName, url: site.url },
        },
      })),
    };
  }

  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/* The enquiry form and the block around it. Used on both the production and
   the hire pages, feeding one Netlify form; the hidden `source` field says
   which page it came from. Instagram is offered alongside it, not instead of
   it, and both accounts are listed because they are answered by different
   parts of the business. */
function enquiryForm(enquiry, source) {
  const field = (id, name, label, type = 'text', extra = '') =>
    `    <div class="field">
      <label class="eyebrow" for="enq-${id}">${esc(label)}</label>
      <input id="enq-${id}" name="${esc(name)}" type="${type}"${extra}>
    </div>`;

  return `<form class="enquiry-form" name="enquiry" method="POST" action="/thanks/enquiry/"
      data-netlify="true" data-netlify-honeypot="bot-field">
  <input type="hidden" name="form-name" value="enquiry">
  <input type="hidden" name="source" value="${esc(source)}">
  <p class="signup-gotcha"><label>Leave this empty <input name="bot-field" tabindex="-1" autocomplete="off"></label></p>
  <p class="enquiry-intro">${esc(enquiry.formIntro)}</p>
  <div class="field-grid">
${field('name', 'name', enquiry.formNameLabel, 'text', ' required autocomplete="name"')}
${field('email', 'email', enquiry.formEmailLabel, 'email', ' required autocomplete="email"')}
${field('phone', 'phone', enquiry.formPhoneLabel, 'tel', ' autocomplete="tel"')}
${field('date', 'event date', enquiry.formDateLabel, 'date')}
${field('venue', 'venue', enquiry.formVenueLabel)}
${field('guests', 'expected guests', enquiry.formGuestsLabel, 'number', ' min="1"')}
  </div>
  <div class="field">
    <label class="eyebrow" for="enq-details">${esc(enquiry.formDetailsLabel)}</label>
    <textarea id="enq-details" name="details" rows="5" placeholder="${esc(enquiry.formDetailsHint)}"></textarea>
  </div>
  <button class="button" type="submit">${esc(enquiry.formButtonLabel)} <span class="arrow">${ARROW}</span></button>
</form>`;
}

function enquirySection(enquiry, site, source) {
  return `<section class="section enquiry" id="enquire">
  <div class="enquiry-copy">
    <span class="eyebrow green">${esc(enquiry.eyebrow)}</span>
    <h2>${lines(enquiry.heading)}</h2>
    <p>${esc(enquiry.copy)}</p>
    <p class="enquiry-direct">Or email us at
      <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    <div class="enquiry-socials">
      <span class="eyebrow">${esc(enquiry.instagramIntro)}</span>
      <a href="${esc(site.instagramHire)}" target="_blank" rel="noopener">
        <b>${esc(site.instagramHireHandle)}</b><span>${esc(enquiry.instagramHireLabel)}</span> ${ARROW}</a>
      <a href="${esc(site.instagramEvents)}" target="_blank" rel="noopener">
        <b>${esc(site.instagramEventsHandle)}</b><span>${esc(enquiry.instagramEventsLabel)}</span> ${ARROW}</a>
    </div>
  </div>
  ${enquiryForm(enquiry, source)}
</section>`;
}

function layout({ site, page, current, contactHref, instaHref, instaHandle, body, playerHtml = '', path = '' }) {
  contactHref = contactHref || '/production/#enquire';
  instaHref = instaHref || site.instagramEvents;
  instaHandle = instaHandle || site.instagramEventsHandle;
  const description = page.description || site.defaultDescription;
  const canonical = site.url + (path || current || '/');
  const ogImage = site.url + site.ogImage;

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="${esc(site.themeColor)}">
<meta name="google-site-verification" content="6JAvO1aT0wSGbATEVGo33qXtcUNv4yQqI6rE3Ql7Sf0">
<meta name="description" content="${esc(description)}">
<title>${esc(page.title)}</title>
<link rel="canonical" href="${esc(canonical)}">${page.noindex ? '\n<meta name="robots" content="noindex">' : ''}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brandName)}">
<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:url" content="${esc(canonical)}">
<meta property="og:image" content="${esc(ogImage)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(page.title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${esc(ogImage)}">
${structuredData(site)}
<link rel="icon" type="image/png" href="/favicon.png"><link rel="apple-touch-icon" href="/favicon.png">
<link rel="preload" as="image" href="/assets/sonido-mark.png">
<link rel="stylesheet" href="/styles.css">
<script src="/app.js" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>

${header(site, current, contactHref, path)}

<main id="main">
${body}
</main>

${footer(site, instaHref, instaHandle)}
${playerHtml ? '\n' + playerHtml + '\n' : ''}
</body>
</html>
`;
}

/* One upcoming-event row. Shared by the homepage and the events page so the
   two never drift apart. The poster is optional: without one the aside is
   just the button, exactly as before. */
const eventRow = (ev) => {
  const external = /^https?:/.test(ev.buttonHref);
  const target = external ? ' target="_blank" rel="noopener"' : '';
  const poster = ev.poster
    ? `<a class="event-poster" href="${esc(ev.buttonHref)}"${target}>` +
      `<img src="${esc(ev.poster)}" alt="${esc(ev.posterAlt || ev.heading)}" loading="lazy"></a>`
    : '';
  return `<div class="event-row">
  <div>
    <div class="date">${esc(ev.dateDisplay)}</div>
    <p>${lines(ev.dayLine)}</p>
  </div>
  <div>
    <h3>${esc(ev.heading)}</h3>
    <p>${lines(ev.copy)}</p>
  </div>
  <div class="event-aside">
    ${poster}
    ${button(ev.buttonLabel, ev.buttonHref, { external })}
  </div>
</div>`;
};

module.exports = { esc, lines, button, ARROW, ARROW_DOWN, eventRow, layout, player, tile, signupSection, enquiryForm, enquirySection };

