#!/usr/bin/env node
'use strict';

/* Local preview:  node serve.js  →  http://localhost:4173
 * Supports byte-range requests, which video playback needs. */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '_site');
const PORT = Number(process.argv[2] || process.env.PORT || 4173);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.yml': 'text/yaml; charset=utf-8', '.mp4': 'video/mp4', '.mov': 'video/quicktime',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png',
  '.svg': 'image/svg+xml', '.webp': 'image/webp', '.ico': 'image/x-icon',
};

function resolve(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0]);
  // keep the request inside _site/
  const target = path.normalize(path.join(ROOT, clean));
  if (!target.startsWith(ROOT)) return null;
  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    return path.join(target, 'index.html');
  }
  return target;
}

http.createServer((req, res) => {
  const file = resolve(req.url);

  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    return res.end('404');
  }

  const size = fs.statSync(file).size;
  const type = TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream';
  const range = req.headers.range;

  if (range) {
    const m = /bytes=(\d*)-(\d*)/.exec(range);
    const start = m && m[1] ? Number(m[1]) : 0;
    const end = m && m[2] ? Number(m[2]) : size - 1;
    if (start >= size || end >= size) {
      res.writeHead(416, { 'Content-Range': `bytes */${size}` });
      return res.end();
    }
    res.writeHead(206, {
      'Content-Type': type,
      'Content-Range': `bytes ${start}-${end}/${size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': end - start + 1,
    });
    return fs.createReadStream(file, { start, end }).pipe(res);
  }

  res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => {
  console.log(`Sonido site → http://localhost:${PORT}`);
});
