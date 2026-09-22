'use strict';
const { esc, lines, button, ARROW_DOWN, layout } = require('./layout.js');

/* Google reads FAQPage markup and can show these answers directly in the
   results. Built from the same content as the visible page, so the two can
   never disagree — which is what the guidelines require. */
function faqSchema(groups) {
  const items = [];
  for (const g of groups || []) {
    for (const i of g.items || []) {
      items.push({
        '@type': 'Question',
        name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer },
      });
    }
  }
  if (!items.length) return '';
  return `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items,
  })}</script>`;
}

module.exports = function faq({ site, content }) {
  const page = content.faq;

  const groups = (page.groups || []).map((g) => `<section class="section faq-group">
  <div class="section-head">
    <div><h2>${lines(g.heading)}</h2></div>
  </div>
  <div class="faq-list">
    ${(g.items || []).map((i) => `<details class="faq-item">
      <summary><span>${esc(i.question)}</span></summary>
      <p>${esc(i.answer)}</p>
    </details>`).join('\n    ')}
  </div>
</section>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
  ${button(page.introButtonLabel, '/production/#enquire', { arrow: ARROW_DOWN })}
</section>
${groups}
<section class="section enquire">
  <div>
    <span class="eyebrow">${esc(page.stillEyebrow)}</span>
    <h2>${lines(page.stillHeading)}</h2>
    <p>${esc(page.stillCopy)}</p>
  </div>
  ${button(page.stillButtonLabel, '/production/#enquire')}
</section>
${faqSchema(page.groups)}`;

  return layout({ site, page, current: '/faq/', body });
};
