'use strict';
const { esc, lines, button, layout } = require('./layout.js');

module.exports = function about({ site, content }) {
  const page = content.about;

  // Only sections with both a heading and a paragraph are shown. An empty
  // list removes the whole block, so nothing half-written reaches the page.
  const filled = (page.sections || []).filter((s) => s && s.heading && s.heading.trim() && s.copy && s.copy.trim());
  const sections = filled.map((s) => `  <article class="about-block">
    <h2>${esc(s.heading)}</h2>
    <p>${esc(s.copy)}</p>
  </article>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
</section>
${filled.length ? `<section class="section">
  <div class="about-blocks">
${sections}
  </div>
</section>
` : ''}<section class="section enquire">
  <div>
    <span class="eyebrow">${esc(page.closingEyebrow)}</span>
    <h2>${lines(page.closingHeading)}</h2>
    <p>${esc(page.closingCopy)}</p>
  </div>
  ${button(page.closingButtonLabel, '/production/#enquire')}
</section>`;

  return layout({ site, page, current: '/about/', body });
};
