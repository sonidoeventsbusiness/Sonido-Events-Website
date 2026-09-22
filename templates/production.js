'use strict';
const { esc, lines, button, ARROW_DOWN, layout, enquirySection } = require('./layout.js');

module.exports = function production({ site, content }) {
  const page = content.production;
  const enquiry = content.enquiry;

  const services = (page.services || []).map((s) => `    <article class="card">
      <h3>${esc(s.heading)}</h3>
      <p>${esc(s.copy)}</p>
    </article>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
  ${button(page.introButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
</section>
<section class="section production" id="approach">
  <div>
    <span class="eyebrow green">${esc(page.approachEyebrow)}</span>
    <h2>${lines(page.approachHeading)}</h2>
  </div>
  <div class="copy">
    ${(page.approachCopy || []).map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
</section>
<section class="section" id="scope">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(page.servicesEyebrow)}</span>
      <h2>${lines(page.servicesHeading)}</h2>
    </div>
  </div>
  <div class="cards">
${services}
  </div>
  <p class="note">${esc(page.servicesNote)}</p>
</section>
<section class="section enquire">
  <div>
    <span class="eyebrow">${esc(page.hireEyebrow)}</span>
    <h2>${lines(page.hireHeading)}</h2>
    <p>${esc(page.hireCopy)}</p>
  </div>
  ${button(page.hireButtonLabel, '/hire/')}
</section>
${enquirySection(enquiry, site, 'production')}`;

  return layout({
    site, page, current: '/production/', body,
    contactHref: '/production/#enquire',
    instaHref: site.instagramHire,
    instaHandle: site.instagramHireHandle,
  });
};
