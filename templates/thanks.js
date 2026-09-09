'use strict';
const { esc, lines, button, layout } = require('./layout.js');

/* Where the signup form lands after a successful submission. */
module.exports = function thanks({ site, content }) {
  const signup = content.signup;

  const body = `<section class="page-intro thanks">
  <span class="eyebrow green">${esc(signup.thanksEyebrow)}</span>
  <h1 class="page-title">${lines(signup.thanksHeading)}</h1>
  <p>${esc(signup.thanksCopy)}</p>
  ${button(signup.thanksButtonLabel, '/')}
</section>`;

  return layout({
    site,
    page: { title: signup.thanksTitle, description: signup.thanksCopy },
    current: '', body,
    contactHref: site.instagramEvents,
    instaHref: site.instagramEvents,
    instaHandle: site.instagramEventsHandle,
  });
};
