# Sonido Events — website

A static site with no dependencies. Node is the only thing you need installed,
and everything below runs with the `node` that already ships on your Mac.

```
content/      everything you can edit — text, dates, the archive
templates/    how each page is put together (code)
static/       styles, scripts, images and video, copied across untouched
build.js      turns content + templates into the finished site
_site/        the built site (generated — never edit by hand)
```

## Day to day

You don't need any of this to change the website. Go to
**yourdomain.com/admin**, sign in, edit, hit Publish. The site rebuilds and is
live about a minute later.

Everything below is for when you want to work on your own machine.

## Preview it locally

```bash
node build.js     # build the site into _site/
node serve.js     # http://localhost:4173
```

Or `npm start` to do both at once.

## Add a night to the archive

Put the clips from the night in a folder, then:

```bash
node add-night.js --slug oct-2026 --title "02.10.26" ~/Desktop/october-clips
node build.js
```

It orders the clips by when they were actually filmed, reads the time off each
one, and builds the three files every tile needs:

| file | what it is | size |
| --- | --- | --- |
| `clip-NN-loop.mp4` | 6 s silent loop for the grid tile | ~650 KB |
| `clip-NN.mp4` | up to 14 s with sound, for the full-screen player | ~2–5 MB |
| `clip-NN.jpg` | poster frame | ~30 KB |

Captions are guessed from the time of night — open the editor afterwards and
change any that don't fit. Add `--dry-run` to see what it would do first.

Transcoding uses `avconvert`, `qlmanage` and `sips`, all built into macOS.

## Publishing

The site lives on Netlify and rebuilds whenever content changes on GitHub.
`netlify.toml` holds the build command — `node build.js`, publishing `_site`.
There is no install step, so builds take seconds.

## Notes

- Nothing loads until it's needed. Tiles show a poster, pull in the silent loop
  only when they come near the viewport, and play only while actually on
  screen. The full clip is fetched when someone opens the player.
- The logo is drawn as a CSS alpha mask (`.wordmark` in `styles.css`), not an
  `<img>`, so its fill can be any colour or animation and its soft edges never
  pick up a grey fringe.
- Page stats on the archive (clip count, first frame, last frame, running time)
  are worked out from the clips. Nothing to keep in sync by hand.
- Line breaks you type into a text field in the editor become line breaks on
  the page.
