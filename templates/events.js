'use strict';
const { esc, lines, button, layout } = require('./layout.js');

module.exports = function events({ site, content, upcoming }) {
  const page = content.events;

  const eventRows = upcoming.events.map((ev) => `<div class="event-row">
  <div>
    <div class="date">${esc(ev.dateDisplay)}</div>
    <p>${lines(ev.dayLine)}</p>
  </div>
  <div>
    <h3>${esc(ev.heading)}</h3>
    <p>${lines(ev.copy)}</p>
  </div>
  ${button(ev.buttonLabel, ev.buttonHref, { external: /^https?:/.test(ev.buttonHref) })}
</div>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
</section>
<section class="section">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(page.comingUpEyebrow)}</span>
      <h2>${lines(page.comingUpHeading)}</h2>
    </div>
  </div>
${eventRows}
  <div class="photo-pair">
    ${page.photos.map((p) => `<img src="${esc(p.src)}" alt="${esc(p.alt)}" loading="lazy">`).join('\n    ')}
  </div>
</section>
<section class="section enquire">
  <div>
    <span class="eyebrow">${esc(page.archiveEyebrow)}</span>
    <h2>${lines(page.archiveHeading)}</h2>
    <p>${esc(page.archiveCopy)}</p>
  </div>
  ${button(page.archiveButtonLabel, '/past-events/')}
</section>`;

  return layout({
    site, page, current: '/events/', body,
    contactHref: site.instagramEvents,
    instaHref: site.instagramEvents,
    instaHandle: site.instagramEventsHandle,
  });
};
