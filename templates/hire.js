'use strict';
const { esc, lines, button, ARROW_DOWN, layout, enquirySection } = require('./layout.js');
const gearArt = require('./gear-art.js');

module.exports = function hire({ site, content }) {
  const page = content.hire;
  const enquiry = content.enquiry;

  const packages = (page.packages || []).map((p) => `  <article class="pack">
    <div class="pack-art">${gearArt(p.art)}</div>
    <div class="pack-body">
      <h3>${esc(p.heading)}</h3>
      <p class="pack-cap">${esc(p.capacity)}</p>
      <p class="pack-price">${esc(p.price)}</p>
      <ul>
        ${(p.items || []).map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
      ${p.note ? `<p class="pack-note">${esc(p.note)}</p>` : ''}
    </div>
  </article>`).join('\n');

  const terms = (page.terms || []).map((t) => `    <div class="term">
      <h3>${esc(t.heading)}</h3>
      <p>${esc(t.copy)}</p>
    </div>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
  ${button(page.introButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
</section>
<section class="section" id="packages">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(page.packagesEyebrow)}</span>
      <h2>${lines(page.packagesHeading)}</h2>
    </div>
    <p class="section-aside">${esc(page.packagesNote)}</p>
  </div>
  <div class="packs">
${packages}
  </div>
</section>
<section class="section enquire">
  <div>
    <h2>${lines(page.elseHeading)}</h2>
    <p>${esc(page.elseCopy)}</p>
  </div>
  ${button(page.elseButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
</section>
<section class="section" id="terms">
  <div class="section-head">
    <div><span class="eyebrow green">${esc(page.termsEyebrow)}</span></div>
  </div>
  <div class="terms">
${terms}
  </div>
</section>
${enquirySection(enquiry, site, 'hire')}`;

  return layout({
    site, page, current: '/hire/', body,
    contactHref: '/production/#enquire',
    instaHref: site.instagramHire,
    instaHandle: site.instagramHireHandle,
  });
};
