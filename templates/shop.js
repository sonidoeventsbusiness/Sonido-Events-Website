'use strict';
const { esc, lines, button, layout, signupSection } = require('./layout.js');

module.exports = function shop({ site, content }) {
  const page = content.shop;

  /* No intro block: the coming-soon panel is the page, so it carries the h1. */
  const body = `<section class="section shop-stage section-lead">
  <span class="eyebrow">${esc(page.stageEyebrow)}</span>
  <h1 class="page-title">${lines(page.stageHeading)}</h1>
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
