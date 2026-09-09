'use strict';
const { esc, lines, button, layout } = require('./layout.js');

/* Where the hire enquiry form lands. */
module.exports = function thanksEnquiry({ site, content }) {
  const hire = content.hire;

  const body = `<section class="page-intro thanks">
  <span class="eyebrow green">${esc(hire.thanksEyebrow)}</span>
  <h1 class="page-title">${lines(hire.thanksHeading)}</h1>
  <p>${esc(hire.thanksCopy)}</p>
  <p>In the meantime you can reach us at <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
  ${button(hire.thanksButtonLabel, '/')}
</section>`;

  return layout({
    site,
    page: { title: hire.thanksTitle, description: hire.thanksCopy, noindex: true },
    current: '', path: '/thanks/enquiry/', body,
    contactHref: site.instagramHire,
    instaHref: site.instagramHire,
    instaHandle: site.instagramHireHandle,
  });
};
