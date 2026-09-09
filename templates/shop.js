'use strict';
const { esc, lines, button, layout, signupSection } = require('./layout.js');

module.exports = function shop({ site, content }) {
  const page = content.shop;

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(page.introEyebrow)}</span>
  <h1 class="page-title">${lines(page.introHeading)}</h1>
  <p>${esc(page.introCopy)}</p>
</section>
<section class="section shop-stage">
  <span class="eyebrow">${esc(page.stageEyebrow)}</span>
  <h2>${lines(page.stageHeading)}</h2>
  <p class="note">${esc(page.stageNote)}</p>
  ${button(page.stageButtonLabel, site.instagramEvents, { ghost: true, external: true })}
</section>
${signupSection({
  ...content.signup,
  eyebrow: page.signupEyebrow,
  heading: page.signupHeading,
  copy: page.signupCopy,
}, 'shop')}`;

  return layout({
    site, page, current: '/shop/', body,
    contactHref: site.instagramEvents,
    instaHref: site.instagramEvents,
    instaHandle: site.instagramEventsHandle,
  });
};
