'use strict';
const { esc, lines, button, eventRow, layout, signupSection } = require('./layout.js');

module.exports = function events({ site, content, upcoming }) {
  const page = content.events;

  const eventRows = upcoming.events.map(eventRow).join('\n');

  /* The coming-up block leads the page, so its heading carries the h1.
     There is no separate intro section above it any more. */
  const body = `<section class="section section-lead">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(page.comingUpEyebrow)}</span>
      <h1 class="page-title">${lines(page.comingUpHeading)}</h1>
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
</section>
${signupSection(content.signup)}`;

  return layout({ site, page, current: '/events/', body });
};
