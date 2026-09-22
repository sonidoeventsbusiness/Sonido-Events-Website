'use strict';
const { esc, lines, button, eventRow, layout, player, tile, signupSection } = require('./layout.js');

module.exports = function home({ site, content, upcoming, nights }) {
  const page = content.home;
  const night = nights[page.lastNightSlug];
  const featured = (page.lastNightFeatured || [])
    .map((n) => night && night.clips.find((c) => Number(c.number) === Number(n)))
    .filter(Boolean);

  const eventRows = upcoming.events.map(eventRow).join('\n');

  const body = `
  <section class="hero">
    <div class="hero-stage">
      <canvas class="hero-lasers" aria-hidden="true"></canvas>
      <div class="hero-stage-inner">
        <h1 class="hero-mark">
          <span class="sr-only">${esc(page.heroH1)}</span>
          <span class="wordmark" aria-hidden="true"></span>
        </h1>
        <h2 class="hero-line">${lines(page.heroSubHeading)}</h2>
        ${button(page.heroButtonLabel, page.heroButtonHref)}
      </div>
    </div>
  </section>

  <div class="strip">
    <span>${esc(page.stripLeft)}</span>
    <span>${esc(page.stripCentre)}</span>
    <span>${esc(page.stripRight)}</span>
  </div>

  <section class="section" id="next-event">
    <div class="section-head">
      <div>
        <span class="eyebrow green">${esc(page.nextEventEyebrow)}</span>
        <h2>${lines(page.nextEventHeading)}</h2>
      </div>
      <span class="eyebrow">${esc(page.nextEventAside)}</span>
    </div>
${eventRows}
  </section>

  <section class="section production">
    <div>
      <span class="eyebrow green">${esc(page.productionEyebrow)}</span>
      <h2>${lines(page.productionHeading)}</h2>
    </div>
    <div class="copy">
      <p>${esc(page.productionCopy)}</p>
      <div class="service-links">
        ${page.productionLinks.map((l) => `<a href="${esc(l.href)}">${esc(l.label)} <span>↗︎</span></a>`).join('\n        ')}
      </div>
    </div>
  </section>

  <section class="section" id="last-night">
    <div class="section-head">
      <div>
        <span class="eyebrow green">${esc(page.lastNightEyebrow)}</span>
        <h2>${lines(page.lastNightHeading)}</h2>
      </div>
      <span class="eyebrow">${esc(page.lastNightAside)}</span>
    </div>
    <div class="recap">
      ${featured.map((c) => tile(c)).join('\n      ')}
    </div>
    <div class="reel-outro" style="padding-left:0;padding-right:0">
      <p class="note" style="max-width:430px;margin:0">${esc(page.lastNightNote)}</p>
      ${button(page.lastNightButtonLabel, '/past-events/', { ghost: true })}
    </div>
  </section>

  ${signupSection(content.signup)}

`;

  const playerHtml = featured.length
    ? player({
        count: featured.length,
        nightTitle: night.title,
        firstCaption: featured[0].caption,
        firstTime: featured[0].time,
        extraAction:
          `<a class="button ghost" href="/past-events/" style="padding:11px 16px;font-size:11px;letter-spacing:1.4px;text-transform:uppercase;gap:10px">All ${night.clips.length} clips ↗︎</a>`,
      })
    : '';

  return layout({
    site, page, current: '/', path: '/', body, playerHtml,
    contactHref: site.instagramEvents,
    instaHref: site.instagramEvents,
    instaHandle: site.instagramEventsHandle,
  });
};
