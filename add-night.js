#!/usr/bin/env node
'use strict';

/* Add a night to the archive.
 *
 *   node add-night.js --slug oct-2026 --title "02.10.26" ~/Desktop/october-clips
 *
 * Takes a folder of phone videos, orders them by when they were filmed,
 * and produces the three files each tile needs plus the night's content
 * file. Uses the transcoding tools built into macOS — nothing to install.
 *
 * Flags:
 *   --slug      folder name for the night        (required)
 *   --title     shown big, e.g. 02.10.26         (defaults to the date)
 *   --date      YYYY-MM-DD                       (defaults to the first clip)
 *   --location  defaults to "Melbourne / Naarm"
 *   --dry-run   show what would happen, change nothing
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = __dirname;
const VIDEO_RE = /\.(mov|mp4|m4v)$/i;

function parseArgs(argv) {
  const opts = { dryRun: false };
  const rest = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') opts.dryRun = true;
    else if (a.startsWith('--')) opts[a.slice(2).replace(/-([a-z])/g, (m, c) => c.toUpperCase())] = argv[++i];
    else rest.push(a);
  }
  opts.source = rest[0];
  return opts;
}

/* When was this actually filmed? macOS keeps the capture date in Spotlight
   metadata; fall back to the file's modification time. */
function capturedAt(file) {
  try {
    const out = execFileSync('mdls', ['-raw', '-name', 'kMDItemContentCreationDate', file], {
      encoding: 'utf8',
    }).trim();
    if (out && out !== '(null)') {
      const d = new Date(out.replace(' +0000', 'Z').replace(' ', 'T'));
      if (!isNaN(d)) return d;
    }
  } catch (_) { /* not macOS, or no Spotlight data */ }
  return fs.statSync(file).mtime;
}

const hhmm = (d) =>
  String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');

/* A rough arc for the night; every caption is editable afterwards. */
function phaseFor(time) {
  const mins = Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5));
  const from = (h, m) => h * 60 + m;
  if (mins >= from(20, 0) && mins < from(22, 30)) return 'Early doors';
  if (mins >= from(22, 30) && mins < from(23, 30)) return 'Room filling';
  if (mins >= from(23, 30) || mins < from(0, 5)) return 'Midnight';
  if (mins < from(1, 0)) return 'Peak time';
  return 'Last hour';
}

function run(cmd, args, dryRun) {
  if (dryRun) { console.log('    would run:', cmd, args.join(' ')); return; }
  execFileSync(cmd, args, { stdio: ['ignore', 'ignore', 'pipe'] });
}

function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (!opts.slug || !opts.source) {
    console.error('Usage: node add-night.js --slug <name> [--title <title>] [--date YYYY-MM-DD] <folder of clips>');
    process.exit(1);
  }
  if (!fs.existsSync(opts.source)) {
    console.error(`No such folder: ${opts.source}`);
    process.exit(1);
  }

  const files = fs
    .readdirSync(opts.source)
    .filter((f) => VIDEO_RE.test(f) && !f.startsWith('.'))
    .map((f) => path.join(opts.source, f))
    .map((f) => ({ file: f, at: capturedAt(f) }))
    .sort((a, b) => a.at - b.at); // chronological, not alphabetical

  if (!files.length) {
    console.error(`No video files found in ${opts.source}`);
    process.exit(1);
  }

  const outDir = path.join(ROOT, 'static', 'assets', 'events', opts.slug);
  const date = opts.date || files[0].at.toISOString().slice(0, 10);
  const dateLine = files[0].at.toLocaleDateString('en-AU', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
  const title =
    opts.title ||
    `${String(files[0].at.getDate()).padStart(2, '0')}.${String(files[0].at.getMonth() + 1).padStart(2, '0')}.${String(files[0].at.getFullYear()).slice(2)}`;

  console.log(`\n${files.length} clips → ${opts.slug} (${dateLine})`);
  if (opts.dryRun) console.log('DRY RUN — nothing will be written\n');
  else fs.mkdirSync(outDir, { recursive: true });

  const clips = files.map(({ file, at }, i) => {
    const n = String(i + 1).padStart(2, '0');
    const time = hhmm(at);
    const loop = path.join(outDir, `clip-${n}-loop.mp4`);
    const full = path.join(outDir, `clip-${n}.mp4`);
    const poster = path.join(outDir, `clip-${n}.jpg`);

    console.log(`  ${n}  ${time}  ${path.basename(file)}`);

    // 6s silent loop for the grid tile
    run('avconvert', ['--source', file, '--output', loop, '--preset', 'PresetMediumQuality',
                      '--start', '4', '--duration', '6', '--replace'], opts.dryRun);
    // up to 14s with sound for the full-screen player
    run('avconvert', ['--source', file, '--output', full, '--preset', 'Preset640x480',
                      '--start', '4', '--duration', '14', '--replace'], opts.dryRun);
    // poster frame
    if (!opts.dryRun) {
      execFileSync('qlmanage', ['-t', '-s', '900', '-o', outDir, loop], { stdio: 'ignore' });
      execFileSync('sips', ['-s', 'format', 'jpeg', '-Z', '720', `${loop}.png`, '--out', poster],
                   { stdio: 'ignore' });
      fs.rmSync(`${loop}.png`, { force: true });
    } else {
      console.log('    would build the poster frame');
    }

    return {
      number: n, time, caption: phaseFor(time),
      loop: `/assets/events/${opts.slug}/clip-${n}-loop.mp4`,
      full: `/assets/events/${opts.slug}/clip-${n}.mp4`,
      poster: `/assets/events/${opts.slug}/clip-${n}.jpg`,
    };
  });

  const night = {
    slug: opts.slug, date, title,
    eyebrow: '', dateLine,
    location: opts.location || 'Melbourne / Naarm',
    clips,
  };

  const jsonPath = path.join(ROOT, 'content', 'nights', `${opts.slug}.json`);
  if (opts.dryRun) {
    console.log(`\nWould write ${path.relative(ROOT, jsonPath)}`);
  } else {
    fs.writeFileSync(jsonPath, JSON.stringify(night, null, 2) + '\n');
    console.log(`\nWrote ${path.relative(ROOT, jsonPath)}`);
    console.log('Next: node build.js — then check the captions in the editor.');
  }
}

main();
