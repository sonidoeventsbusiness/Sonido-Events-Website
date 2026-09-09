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
  };
  const upcoming = readJson(path.join(dir, 'upcoming.json'));

  const nightsDir = path.join(dir, 'nights');
  const nightList = fs
    .readdirSync(nightsDir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => readJson(path.join(nightsDir, f)))
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

function build() {
  const { content, upcoming, nights, nightList } = loadContent();
  const site = content.site;

  if (!nightList.length) throw new Error('No nights found in content/nights/');

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

  const written = [];
  written.push(write('.', home({ site, content, upcoming, nights })));
  written.push(write('events', events({ site, content, upcoming })));
  written.push(write('hire', hire({ site, content })));
  written.push(write('shop', shop({ site, content })));

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

  console.log(`Built ${written.length} pages into _site/`);
  for (const f of written) console.log('  ' + path.relative(ROOT, f));
  console.log(`${nightList.length} night(s) in the archive: ${nightList.map((n) => n.slug).join(', ')}`);
}

build();
