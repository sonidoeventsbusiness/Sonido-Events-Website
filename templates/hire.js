'use strict';
const { esc, lines, button, layout, enquiryForm } = require('./layout.js');

module.exports = function hire({ site, content }) {
  const page = content.hire;

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
  ${button(page.introButtonLabel, '#enquire', { arrow: '↓' })}
</section>
<section class="section production" id="production">
  <div>
    <span class="eyebrow green">${esc(page.productionEyebrow)}</span>
    <h2>${lines(page.productionHeading)}</h2>
  </div>
  <div class="copy">
    ${page.productionCopy.map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
</section>
<section class="section" id="equipment">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(page.equipmentEyebrow)}</span>
      <h2>${lines(page.equipmentHeading)}</h2>
    </div>
  </div>
  <div class="cards">
    ${page.cards.map((c) => `<article class="card">
      <span class="eyebrow green">${esc(c.eyebrow)}</span>
      <h3>${esc(c.heading)}</h3>
      <p>${esc(c.copy)}</p>
    </article>`).join('\n    ')}
  </div>
  <p class="note">${esc(page.equipmentNote)}</p>
</section>
<section class="section enquiry" id="enquire">
  <div class="enquiry-copy">
    <span class="eyebrow green">${esc(page.enquireEyebrow)}</span>
    <h2>${lines(page.enquireHeading)}</h2>
    <p>${esc(page.enquireCopy)}</p>
    <p class="enquiry-direct">Or email us directly at
      <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
  </div>
  ${enquiryForm(page, site.instagramHire, site.instagramHireHandle)}
</section>`;

  return layout({
    site, page, current: '/hire/', body,
    contactHref: site.instagramHire,
    instaHref: site.instagramHire,
    instaHandle: site.instagramHireHandle,
  });
};
