#!/usr/bin/env node
'use strict';

/* SONIDO EVENTS — site build
 *
 *   node build.js
 *
 * Reads the JSON in content/, renders the templates in templates/,
 * copies everything in static/ across, and writes the finished site
 * into _site/. No dependencies, no install step.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OUT = process.env.SONIDO_OUT
  ? path.resolve(process.env.SONIDO_OUT)
  : path.join(ROOT, '_site');

const readJson = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));

function loadContent() {
  const dir = path.join(ROOT, 'content');
  const content = {
    site: readJson(path.join(dir, 'site.json')),
    home: readJson(path.join(dir, 'home.json')),
    events: readJson(path.join(dir, 'events.json')),
    hire: readJson(path.join(dir, 'hire.json')),
    shop: readJson(path.join(dir, 'shop.json')),
    pastEvents: readJson(path.join(dir, 'past-events.json')),
    signup: readJson(path.join(dir, 'signup.json')),
  };
  const upcoming = readJson(path.join(dir, 'upcoming.json'));

  const nightsDir = path.join(dir, 'nights');
  const nightList = fs
    .readdirSync(nightsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(nightsDir, f)))
    // A night saved in the editor before its clips exist would otherwise fail
    // the build. Skip it with a warning instead, so the site still deploys.
    .filter((n) => {
      const ok = n && Array.isArray(n.clips) && n.clips.length > 0 && n.slug;
      if (!ok) console.warn(`  skipping night "${(n && n.slug) || 'unnamed'}" — no clips yet`);
      return ok;
    })
    .sort((a, b) => String(b.date).localeCompare(String(a.date))); // newest first

  const nights = {};
  for (const n of nightList) nights[n.slug] = n;

  return { content, upcoming, nights, nightList };
}

/* A hand-rolled recursive copy. fs.cpSync trips over some mounted
   filesystems, and this only needs readdir + copyFile, which always work. */
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const src = path.join(from, entry.name);
    const dest = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else if (entry.isFile()) fs.copyFileSync(src, dest);
  }
}

function write(routePath, html) {
  const dest = path.join(OUT, routePath, 'index.html');
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, html);
  return dest;
}

/* sitemap.xml and robots.txt — generated from the pages actually built,
   so a new night can never be missing from the sitemap. */
function writeSeoFiles(site, routes) {
  const urls = routes.map((r) => {
    const loc = site.url + r;
    return `  <url><loc>${loc}</loc></url>`;
  }).join('\n');

  fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);

  fs.writeFileSync(path.join(OUT, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /thanks/\n\n` +
    `Sitemap: ${site.url}/sitemap.xml\n`);
}

function build() {
  const { content, upcoming, nights, nightList } = loadContent();
  const site = content.site;

  if (!nightList.length) throw new Error('No usable nights in content/nights/ — every night needs at least one clip');

  // A previous build is cleared where the filesystem allows it; where it
  // doesn't, the copy below simply overwrites in place.
  try {
    fs.rmSync(OUT, { recursive: true, force: true });
  } catch (_) { /* read-only or restricted mount — overwrite instead */ }
  fs.mkdirSync(OUT, { recursive: true });

  // static files first, so a template can never be clobbered by a copy
  const staticDir = path.join(ROOT, 'static');
  if (fs.existsSync(staticDir)) copyDir(staticDir, OUT);

  const home = require('./templates/home.js');
  const events = require('./templates/events.js');
  const hire = require('./templates/hire.js');
  const shop = require('./templates/shop.js');
  const pastEvents = require('./templates/past-events.js');
  const thanks = require('./templates/thanks.js');
  const thanksEnquiry = require('./templates/thanks-enquiry.js');

  const written = [];
  written.push(write('.', home({ site, content, upcoming, nights })));
  written.push(write('events', events({ site, content, upcoming })));
  written.push(write('hire', hire({ site, content })));
  written.push(write('shop', shop({ site, content })));
  written.push(write('thanks', thanks({ site, content })));
  written.push(write(path.join('thanks', 'enquiry'), thanksEnquiry({ site, content })));

  // /past-events/ shows the newest night; every night also gets its own page
  const [newest, ...older] = nightList;
  written.push(
    write('past-events', pastEvents({ site, content, night: newest, others: older, isIndex: true }))
  );
  for (const night of nightList) {
    const others = nightList.filter((n) => n.slug !== night.slug);
    written.push(
      write(path.join('past-events', night.slug), pastEvents({ site, content, night, others, isIndex: false }))
    );
  }

  // /thanks/ is deliberately absent: it is noindex and has nothing to rank for
  const routes = ['/', '/events/', '/hire/', '/shop/', '/past-events/']
    .concat(nightList.map((n) => `/past-events/${n.slug}/`));
  writeSeoFiles(site, routes);

  console.log(`Built ${written.length} pages into _site/`);
  console.log(`sitemap.xml lists ${routes.length} URLs`);
  for (const f of written) console.log('  ' + path.relative(ROOT, f));
  console.log(`${nightList.length} night(s) in the archive: ${nightList.map((n) => n.slug).join(', ')}`);
}

build();
