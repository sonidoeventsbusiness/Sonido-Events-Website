'use strict';
const { esc, lines, button, layout, player, tile } = require('./layout.js');

/* Stats are derived from the clips, so adding a night never means
   remembering to update a count by hand. */
function stats(night) {
  const clips = night.clips;
  const first = clips[0].time;
  const last = clips[clips.length - 1].time;
  const mins = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  let span = mins(last) - mins(first);
  if (span < 0) span += 24 * 60; // the night ran past midnight
  const duration = `${Math.floor(span / 60)}H ${String(span % 60).padStart(2, '0')}M`;
  return [
    { value: String(clips.length), label: 'Clips from the floor' },
    { value: first, label: 'First frame' },
    { value: last, label: 'Last frame' },
    { value: duration, label: 'Of it on tape' },
  ];
}

function nightSection(night, index) {
  const number = String(index + 1).padStart(2, '0');
  const eyebrow = night.eyebrow || `${number} / ${night.title}`;

  return `<section class="night-head">
  <div class="night-title">
    <div>
      <span class="eyebrow green">${esc(eyebrow)}</span>
      <h2>${esc(night.title)}</h2>
    </div>
    <span class="eyebrow">${esc(night.dateLine)}<br>${esc(night.location)}</span>
  </div>
  <div class="stats">
    ${stats(night).map((s) => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join('\n    ')}
  </div>
</section>

<section class="reel" aria-label="Clips from ${esc(night.dateLine)}">
  <div class="reel-viewport">
    <div class="reel-hint">
      <span>__HINT_LEFT__</span>
      <span>__HINT_RIGHT__</span>
    </div>
    <div class="reel-track">
      ${night.clips.map((c) => tile(c, { labelStyle: 'long' })).join('\n      ')}
    </div>
    <div class="reel-bar">
      <span data-reel-count>01 / ${esc(String(night.clips.length).padStart(2, '0'))}</span>
      <span class="rail"><i></i></span>
      <span data-reel-time>${esc(night.clips[0].time)}</span>
    </div>
  </div>
</section>`;
}

/* Older nights get their own pages; this strip links to them. */
function archiveStrip(others) {
  if (!others.length) return '';
  return `
<section class="section">
  <div class="section-head">
    <div>
      <span class="eyebrow green">More from the archive</span>
      <h2>OTHER NIGHTS.</h2>
    </div>
  </div>
  <div class="cards">
    ${others.map((n) => `<article class="card">
      <span class="eyebrow green">${esc(n.dateLine)}</span>
      <h3>${esc(n.title)}</h3>
      <p>${esc(n.clips.length)} clips · ${esc(n.clips[0].time)} to ${esc(n.clips[n.clips.length - 1].time)}</p>
      <a href="/past-events/${esc(n.slug)}/">Watch the night ↗</a>
    </article>`).join('\n    ')}
  </div>
</section>`;
}

module.exports = function pastEvents({ site, content, night, others, isIndex }) {
  const page = content.pastEvents;
  const nightCount = others.length + 1;

  const body = `
  <section class="film-hero">
    <div class="film-hero-bed" aria-hidden="true">
      <video src="${esc(night.clips[0].full)}" poster="${esc(night.clips[0].poster)}" muted loop autoplay playsinline preload="metadata"></video>
    </div>
    <div class="film-hero-inner">
      <span class="eyebrow">${esc(page.heroEyebrow)}</span>
      <h1>${esc(page.heroHeading)}<br><em>${esc(page.heroHeadingEm)}</em></h1>
      <p>${esc(page.heroCopy)}</p>
      <div class="scroll-cue">
        <span>${esc(String(nightCount).padStart(2, '0'))} ${nightCount === 1 ? 'night' : 'nights'} archived · ${esc(night.clips.length)} clips</span>
        <span>Scroll ↓</span>
      </div>
    </div>
  </section>

  ${nightSection(night, 0)
    .replace('__HINT_LEFT__', esc(page.reelHintLeft))
    .replace('__HINT_RIGHT__', esc(page.reelHintRight))}

  <section class="reel-outro">
    <div>
      <span class="eyebrow green">${esc(page.outroEyebrow)}</span>
      <h3>${lines(page.outroHeading)}</h3>
    </div>
    <button class="button" type="button" data-replay>Play all ${esc(night.clips.length)} clips <span class="arrow">↗</span></button>
  </section>
${isIndex ? archiveStrip(others) : ''}
  <section class="section enquire" style="margin-top:74px">
    <div>
      <span class="eyebrow">${esc(page.nextEyebrow)}</span>
      <h2>${lines(page.nextHeading)}</h2>
      <p>${esc(page.nextCopy)}</p>
    </div>
    ${button(page.nextButtonLabel, '/events/')}
  </section>
`;

  const playerHtml = player({
    count: night.clips.length,
    nightTitle: night.title,
    firstCaption: night.clips[0].caption,
    firstTime: night.clips[0].time,
    extraAction: '<button type="button" data-action="next">Next ↗</button>',
  });

  return layout({
    site,
    page: {
      title: isIndex ? page.title : `${night.title} | Past events | Sonido Events`,
      description: page.description,
    },
    current: '/past-events/', path: isIndex ? '/past-events/' : `/past-events/${night.slug}/`, body, playerHtml,
    contactHref: site.instagramEvents,
    instaHref: site.instagramEvents,
    instaHandle: site.instagramEventsHandle,
  });
};
