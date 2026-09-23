'use strict';
const { esc, lines, button, ARROW, ARROW_DOWN, layout, enquirySection } = require('./layout.js');
const gearArt = require('./gear-art.js');

/* Equipment hire: one overview page, one page per category (the Hire
   dropdown), and one page per package. All three read content/hire.json.

   URLs are flat: /hire/<category>/ and /hire/<package>/. A package's URL
   comes from its `slug`, so renaming a package does not break links, but
   changing the slug does. build.js refuses to build if two slugs collide. */

const hireLayout = (site, page, path, body) =>
  layout({
    site, page, current: '/hire/', path, body,
    contactHref: '/hire/#enquire',
    instaHref: site.instagramHire,
    instaHandle: site.instagramHireHandle,
  });

const packsIn = (hire, cat) => (hire.packages || []).filter((p) => p.category === cat.slug);

/* The picture for a package: a real photo when one has been uploaded,
   otherwise the line drawing. */
const visual = (p, { eager = false } = {}) =>
  p.photo
    ? `<img src="${esc(p.photo)}" alt="${esc(p.photoAlt || p.heading)}"${eager ? '' : ' loading="lazy"'} decoding="async">`
    : gearArt(p.art);

/* One package card. The whole card links through to the package's own page. */
function packCard(p) {
  return `  <a class="pack" href="/hire/${esc(p.slug)}/">
    <div class="pack-art${p.photo ? ' has-photo' : ''}">${visual(p)}</div>
    <div class="pack-body">
      <h3>${esc(p.heading)}</h3>
      <p class="pack-cap">${esc(p.capacity)}</p>
      <p class="pack-price">${esc(p.price)}</p>
      <ul>
        ${(p.items || []).map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
      ${p.note ? `<p class="pack-note">${esc(p.note)}</p>` : ''}
      <span class="pack-more">View package ${ARROW}</span>
    </div>
  </a>`;
}

/* Delivery, setup, site visits, someone on the night. Shown on every
   hire page, so the extra help is never more than a scroll away. */
function servicesSection(hire) {
  const cards = (hire.services || []).map((s) => `    <article class="card">
      <h3>${esc(s.heading)}</h3>
      <p>${esc(s.copy)}</p>
    </article>`).join('\n');
  return `<section class="section" id="setup">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(hire.servicesEyebrow)}</span>
      <h2>${lines(hire.servicesHeading)}</h2>
    </div>
  </div>
  <div class="cards">
${cards}
  </div>
  <p class="note">${button(hire.servicesButtonLabel, '#enquire', { ghost: true, arrow: ARROW_DOWN })}</p>
</section>`;
}

/* Photos of the rig at our own events. Renders nothing until photos are
   added in the editor, so an empty gallery never shows. */
function gallerySection(hire) {
  const photos = (hire.gallery || []).filter((g) => g && g.image);
  if (!photos.length) return '';
  return `<section class="section" id="gallery">
  <div class="section-head">
    <div><span class="eyebrow green">${esc(hire.galleryEyebrow)}</span></div>
  </div>
  <div class="rig-gallery">
    ${photos.map((g) => `<figure><img src="${esc(g.image)}" alt="${esc(g.alt || '')}" loading="lazy" decoding="async">${g.caption ? `<figcaption>${esc(g.caption)}</figcaption>` : ''}</figure>`).join('\n    ')}
  </div>
</section>`;
}

function whySection(hire) {
  return `<section class="section production" id="why">
  <div>
    <span class="eyebrow green">${esc(hire.whyEyebrow)}</span>
    <h2>${lines(hire.whyHeading)}</h2>
  </div>
  <div class="copy">
    ${(hire.whyCopy || []).map((p) => `<p>${esc(p)}</p>`).join('\n    ')}
  </div>
</section>`;
}

/* Quick links to each category, under the intro. */
function categoryNav(hire, active) {
  return `<nav class="hire-cats" aria-label="Hire categories">
  ${(hire.categories || []).map((c) =>
    `<a href="/hire/${esc(c.slug)}/"${c.slug === active ? ' aria-current="page"' : ''}>${esc(c.name)}</a>`).join('\n  ')}
</nav>`;
}

/* ---- /hire/ ---------------------------------------------------------- */
function hirePage({ site, content }) {
  const hire = content.hire;

  // Packages grouped under their category, in category order. Categories
  // with no packages (lighting) get a single enquiry card instead.
  const groups = (hire.categories || []).map((c) => {
    const packs = packsIn(hire, c);
    const inner = packs.length
      ? packs.map(packCard).join('\n')
      : `  <a class="pack pack-enquire" href="/hire/${esc(c.slug)}/">
    <div class="pack-body">
      <p class="pack-note">${esc(hire.categoryEmptyCopy)}</p>
      <span class="pack-more">Find out more ${ARROW}</span>
    </div>
  </a>`;
    return `  <div class="pack-group">
    <h3 class="pack-group-head"><a href="/hire/${esc(c.slug)}/">${esc(c.name)} <span class="arrow">${ARROW}</span></a></h3>
    <div class="packs">
${inner}
    </div>
  </div>`;
  }).join('\n');

  const terms = (hire.terms || []).map((t) => `    <div class="term">
      <h3>${esc(t.heading)}</h3>
      <p>${esc(t.copy)}</p>
    </div>`).join('\n');

  const body = `<section class="page-intro">
  <span class="eyebrow green">${esc(hire.introEyebrow)}</span>
  <h1 class="page-title">${lines(hire.introHeading)}</h1>
  <p>${esc(hire.introCopy)}</p>
  ${button(hire.introButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
  ${categoryNav(hire)}
</section>
<section class="section" id="packages">
  <div class="section-head">
    <div>
      <span class="eyebrow green">${esc(hire.packagesEyebrow)}</span>
      <h2>${lines(hire.packagesHeading)}</h2>
    </div>
    <p class="section-aside">${esc(hire.packagesNote)}</p>
  </div>
${groups}
</section>
${whySection(hire)}
${gallerySection(hire)}
${servicesSection(hire)}
<section class="section enquire">
  <div>
    <h2>${lines(hire.elseHeading)}</h2>
    <p>${esc(hire.elseCopy)}</p>
  </div>
  ${button(hire.elseButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
</section>
<section class="section" id="terms">
  <div class="section-head">
    <div><span class="eyebrow green">${esc(hire.termsEyebrow)}</span></div>
  </div>
  <div class="terms">
${terms}
  </div>
</section>
${enquirySection(content.enquiry, site, 'hire')}`;

  return hireLayout(site, hire, '/hire/', body);
}

/* ---- /hire/<category>/ ---------------------------------------------- */
function categoryPage({ site, content, category }) {
  const hire = content.hire;
  const packs = packsIn(hire, category);
  const page = { title: category.title, description: category.description };

  const list = packs.length
    ? `<section class="section" id="packages">
  <div class="section-head">
    <div><span class="eyebrow green">${esc(hire.packagesEyebrow)}</span></div>
    <p class="section-aside">${esc(hire.packagesNote)}</p>
  </div>
  <div class="packs">
${packs.map(packCard).join('\n')}
  </div>
</section>`
    : `<section class="section enquire">
  <div>
    <p>${esc(hire.categoryEmptyCopy)}</p>
  </div>
  ${button(hire.categoryButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
</section>`;

  const body = `<section class="page-intro">
  <span class="eyebrow green"><a href="/hire/">${esc(hire.introEyebrow)}</a></span>
  <h1 class="page-title">${lines(category.heading)}</h1>
  <p>${esc(category.copy)}</p>
  ${button(hire.categoryButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
  ${categoryNav(hire, category.slug)}
</section>
${list}
${whySection(hire)}
${servicesSection(hire)}
${enquirySection(content.enquiry, site, `hire-${category.slug}`)}`;

  return hireLayout(site, page, `/hire/${category.slug}/`, body);
}

/* ---- /hire/<package>/ ----------------------------------------------- */
function bundlePage({ site, content, pack }) {
  const hire = content.hire;
  const category = (hire.categories || []).find((c) => c.slug === pack.category);
  const page = {
    title: pack.title || `${pack.heading} Hire Melbourne | Sonido`,
    description: pack.description || `${pack.heading} hire in Melbourne. ${pack.capacity}. 24 hour hire from ${pack.price}.`,
  };

  // Same category first, topped up from the rest, three at most.
  const others = (hire.packages || []).filter((p) => p.slug !== pack.slug);
  const related = others.filter((p) => p.category === pack.category)
    .concat(others.filter((p) => p.category !== pack.category))
    .slice(0, 3);

  const crumb = category
    ? `<a href="/hire/">Hire</a> / <a href="/hire/${esc(category.slug)}/">${esc(category.name)}</a>`
    : '<a href="/hire/">Hire</a>';

  const body = `<section class="page-intro bundle-intro">
  <span class="eyebrow green">${crumb}</span>
  <div class="bundle">
    <div class="bundle-art${pack.photo ? ' has-photo' : ''}">${visual(pack, { eager: true })}</div>
    <div class="bundle-body">
      <h1 class="bundle-title">${esc(pack.heading)}</h1>
      <p class="bundle-cap">${esc(pack.capacity)}</p>
      <p class="bundle-price">${esc(pack.price)}</p>
      <span class="eyebrow">${esc(hire.bundleIncludedLabel)}</span>
      <ul class="bundle-list">
        ${(pack.items || []).map((i) => `<li>${esc(i)}</li>`).join('\n        ')}
      </ul>
      ${pack.note ? `<p class="bundle-note">${esc(pack.note)}</p>` : ''}
      <p class="bundle-terms">${esc(hire.bundleTermsLine)}</p>
      ${button(hire.bundleButtonLabel, '#enquire', { arrow: ARROW_DOWN })}
    </div>
  </div>
</section>
${servicesSection(hire)}
${whySection(hire)}
<section class="section" id="more">
  <div class="section-head">
    <div><h2>${lines(hire.bundleRelatedHeading)}</h2></div>
    <p class="section-aside"><a href="/hire/">${esc(hire.bundleBackLabel)} ${ARROW}</a></p>
  </div>
  <div class="packs">
${related.map(packCard).join('\n')}
  </div>
</section>
${enquirySection(content.enquiry, site, `hire-${pack.slug}`)}`;

  return hireLayout(site, page, `/hire/${pack.slug}/`, body);
}

module.exports = hirePage;
module.exports.categoryPage = categoryPage;
module.exports.bundlePage = bundlePage;
