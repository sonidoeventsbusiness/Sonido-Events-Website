/* SONIDO EVENTS — site behaviour
   1. mobile navigation
   2. lazy, in-view video tiles
   3. the reel: vertical scroll drives the horizontal filmstrip
   4. the player: full-screen clip playback with sound
   5. background beds: keep muted hero footage rolling
   6. hero lasers: the homepage laser stage

   Sections 4 and 5 each `return` early on pages that lack their markup,
   so anything added after them must live in its own IIFE or it silently
   never runs. That is why the lasers are scoped separately below.      */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 1. mobile navigation ---------------------------------------- */
  var toggle = document.querySelector('.menu');
  var nav = document.querySelector('.nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.textContent = open ? 'Close −' : 'Menu +';
    });
  }

  /* 2. lazy, in-view video tiles -------------------------------- */
  var tiles = Array.prototype.slice.call(document.querySelectorAll('.tile'));

  if (tiles.length && 'IntersectionObserver' in window) {
    // load a tile's loop only once it is near the viewport
    var loader = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var video = entry.target.querySelector('video');
        if (video && !video.getAttribute('src') && video.dataset.src) {
          video.setAttribute('src', video.dataset.src);
          video.load();
        }
        loader.unobserve(entry.target);
      });
    }, { rootMargin: '600px' });

    // play only what is actually on screen, so decoding stays cheap
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var video = entry.target.querySelector('video');
        if (!video) return;
        if (entry.isIntersecting) {
          var playing = video.play();
          if (playing && playing.catch) playing.catch(function () {});
          video.classList.add('is-live');
        } else {
          video.pause();
          video.classList.remove('is-live');
        }
      });
    }, { threshold: 0.25 });

    tiles.forEach(function (tile) {
      loader.observe(tile);
      if (!reduceMotion) player.observe(tile);
    });
  }

  /* 3. the reel -------------------------------------------------- */
  var reel = document.querySelector('.reel');
  var viewport = document.querySelector('.reel-viewport');
  var track = document.querySelector('.reel-track');
  var railFill = document.querySelector('.reel-bar .rail i');
  var railTime = document.querySelector('[data-reel-time]');
  var railCount = document.querySelector('[data-reel-count]');

  if (reel && viewport && track) {
    var pinned = window.matchMedia('(min-width: 901px)');
    var travel = 0;
    var offset = 0;
    var ticking = false;

    function measure() {
      if (!pinned.matches || reduceMotion) {
        reel.style.height = '';
        track.style.transform = '';
        travel = 0;
        return;
      }
      var extra = track.scrollWidth - viewport.clientWidth;
      travel = Math.max(0, extra);
      // the section is tall enough to scroll the whole strip past, then release
      reel.style.height = (window.innerHeight + travel) + 'px';
      offset = reel.getBoundingClientRect().top + window.scrollY;
      render();
    }

    function render() {
      if (!travel) return;
      var progress = (window.scrollY - offset) / travel;
      progress = Math.min(1, Math.max(0, progress));
      track.style.transform = 'translate3d(' + (-progress * travel) + 'px,0,0)';
      if (railFill) railFill.style.width = (progress * 100).toFixed(2) + '%';
      updateReadout(progress);
    }

    function updateReadout(progress) {
      if (!tiles.length) return;
      var i = Math.min(tiles.length - 1, Math.round(progress * (tiles.length - 1)));
      if (railTime) railTime.textContent = tiles[i].dataset.time || '';
      if (railCount) railCount.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(tiles.length).padStart(2, '0');
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { render(); ticking = false; });
    }, { passive: true });

    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
    if (pinned.addEventListener) pinned.addEventListener('change', measure);
    measure();
    updateReadout(0);
  }

  /* 4. the player ------------------------------------------------ */
  var shell = document.querySelector('.player');
  if (!shell || !tiles.length) return;

  var video = shell.querySelector('video');
  var fill = shell.querySelector('.player-rail i');
  var counter = shell.querySelector('[data-player-count]');
  var stamp = shell.querySelector('[data-player-time]');
  var caption = shell.querySelector('[data-player-caption]');
  var soundBtn = shell.querySelector('[data-sound]');
  var current = 0;
  var lastFocus = null;
  var wantsSound = true;

  function show(index, withSound) {
    current = (index + tiles.length) % tiles.length;
    var tile = tiles[current];
    video.src = tile.dataset.full;
    video.poster = tile.dataset.poster || '';
    video.muted = !wantsSound;
    if (typeof withSound === 'boolean') { wantsSound = withSound; video.muted = !withSound; }
    syncSound();
    var playing = video.play();
    if (playing && playing.catch) playing.catch(function () {
      // a browser that refuses sound still gets the picture
      video.muted = true;
      wantsSound = false;
      syncSound();
      video.play().catch(function () {});
    });
    if (counter) counter.textContent = String(current + 1).padStart(2, '0') + ' / ' + String(tiles.length).padStart(2, '0');
    if (stamp) stamp.textContent = tile.dataset.time || '';
    if (caption) caption.textContent = tile.dataset.caption || '';
    if (fill) fill.style.width = '0%';
  }

  function syncSound() {
    if (soundBtn) soundBtn.textContent = video.muted ? 'Sound off' : 'Sound on';
  }

  function open(index) {
    lastFocus = document.activeElement;
    shell.classList.add('is-open');
    shell.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-locked');
    show(index, true);
    var close = shell.querySelector('[data-close]');
    if (close) close.focus();
  }

  function close() {
    shell.classList.remove('is-open');
    shell.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-locked');
    video.pause();
    video.removeAttribute('src');
    video.load();
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }

  tiles.forEach(function (tile, index) {
    tile.addEventListener('click', function () { open(index); });
  });

  var replay = document.querySelector('[data-replay]');
  if (replay) replay.addEventListener('click', function () { open(0); });

  shell.addEventListener('click', function (event) {
    var action = event.target.closest('[data-action]');
    if (action) {
      var what = action.dataset.action;
      if (what === 'close') close();
      if (what === 'next') show(current + 1);
      if (what === 'prev') show(current - 1);
      return;
    }
    if (event.target === shell || event.target.classList.contains('player-stage')) close();
  });

  if (soundBtn) {
    soundBtn.addEventListener('click', function () {
      wantsSound = video.muted;
      video.muted = !wantsSound;
      syncSound();
    });
  }

  video.addEventListener('timeupdate', function () {
    if (!fill || !video.duration) return;
    fill.style.width = ((video.currentTime / video.duration) * 100).toFixed(2) + '%';
  });
  video.addEventListener('ended', function () { show(current + 1); });

  document.addEventListener('keydown', function (event) {
    if (!shell.classList.contains('is-open')) return;
    if (event.key === 'Escape') close();
    if (event.key === 'ArrowRight') show(current + 1);
    if (event.key === 'ArrowLeft') show(current - 1);
    if (event.key === 'm' || event.key === 'M') { wantsSound = video.muted; video.muted = !wantsSound; syncSound(); }
    if (event.key === ' ') {
      event.preventDefault();
      if (video.paused) video.play(); else video.pause();
    }
  });
})();

/* 5. background beds: keep the muted hero footage rolling ------- */
(function () {
  'use strict';
  var beds = document.querySelectorAll('.film-hero-bed video');
  if (!beds.length) return;
  function nudge() {
    beds.forEach(function (bed) {
      if (bed.paused) {
        var playing = bed.play();
        if (playing && playing.catch) playing.catch(function () {});
      }
    });
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) nudge(); });
  window.addEventListener('pageshow', nudge);
  nudge();
})();

(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* 6. hero lasers ---------------------------------------------- */
  /* Two emitters in the top corners throwing beams that cross through the
     middle, drawn additively so the crossings brighten the way real beams
     do in haze. Canvas, so there is no asset to download. Idle when the
     tab is hidden, when the hero is scrolled away, or when the visitor
     asks for reduced motion (they get a single still frame instead). */
  var laserCanvas = document.querySelector('.hero-lasers');
  if (laserCanvas && laserCanvas.getContext) {
    (function () {
      var ctx = laserCanvas.getContext('2d');
      var W = 0, H = 0;
      var t = reduceMotion ? 3.1 : 0;
      var running = false;
      var visible = true;
      var raf = null;
      var last = 0;

      function beam(x, y, angle, len, spread, alpha) {
        if (alpha <= 0.004) return;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);

        var g = ctx.createLinearGradient(0, 0, len, 0);
        g.addColorStop(0, 'rgba(177,239,128,' + (alpha * 0.55).toFixed(4) + ')');
        g.addColorStop(0.28, 'rgba(121,178,84,' + (alpha * 0.34).toFixed(4) + ')');
        g.addColorStop(1, 'rgba(121,178,84,0)');
        ctx.beginPath();
        ctx.moveTo(0, -1.6);
        ctx.lineTo(len, -spread);
        ctx.lineTo(len, spread);
        ctx.lineTo(0, 1.6);
        ctx.closePath();
        ctx.fillStyle = g;
        ctx.fill();

        var core = ctx.createLinearGradient(0, 0, len, 0);
        core.addColorStop(0, 'rgba(226,255,199,' + (alpha * 0.75).toFixed(4) + ')');
        core.addColorStop(0.5, 'rgba(177,239,128,' + (alpha * 0.22).toFixed(4) + ')');
        core.addColorStop(1, 'rgba(177,239,128,0)');
        ctx.beginPath();
        ctx.moveTo(0, -0.9);
        ctx.lineTo(len, -spread * 0.16);
        ctx.lineTo(len, spread * 0.16);
        ctx.lineTo(0, 0.9);
        ctx.closePath();
        ctx.fillStyle = core;
        ctx.fill();

        ctx.restore();
      }

      function glow(x, y, radius, alpha) {
        var g = ctx.createRadialGradient(x, y, 0, x, y, radius);
        g.addColorStop(0, 'rgba(177,239,128,' + (alpha * 0.5).toFixed(4) + ')');
        g.addColorStop(0.4, 'rgba(121,178,84,' + (alpha * 0.16).toFixed(4) + ')');
        g.addColorStop(1, 'rgba(121,178,84,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      }

      var RIGS = [
        { fx: 0.08, base: 0.62, swing: 0.36, phase: 0 },
        { fx: 0.92, base: Math.PI - 0.62, swing: -0.36, phase: 1.9 }
      ];

      function draw() {
        if (!W || !H) return;
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = '#090a09';
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = 'lighter';

        var hz = ctx.createRadialGradient(W * 0.5, H * 0.06, 0, W * 0.5, H * 0.06, H * 1.25);
        var ha = 0.1 + Math.sin(t * 0.6) * 0.022;
        hz.addColorStop(0, 'rgba(121,178,84,' + ha.toFixed(4) + ')');
        hz.addColorStop(1, 'rgba(121,178,84,0)');
        ctx.fillStyle = hz;
        ctx.fillRect(0, 0, W, H);

        var len = Math.max(W, H) * 1.7;
        for (var r = 0; r < RIGS.length; r++) {
          var rig = RIGS[r];
          var ox = W * rig.fx, oy = -H * 0.05;
          glow(ox, oy + H * 0.05, H * 0.5, 0.5);
          for (var i = 0; i < 8; i++) {
            var f = (i / 7) - 0.5;
            var angle = rig.base
              + Math.sin(t * 0.3 + rig.phase) * rig.swing
              + f * 0.62
              + Math.sin(t * 0.9 + i * 1.1 + rig.phase) * 0.02;
            var flick = 0.5 + 0.5 * Math.sin(t * 1.3 + i * 2.2 + rig.phase);
            beam(ox, oy, angle, len, H * 0.07, 0.26 + flick * 0.36);
          }
        }
        ctx.globalCompositeOperation = 'source-over';
      }

      function resize() {
        var rect = laserCanvas.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        W = Math.max(1, Math.round(rect.width));
        H = Math.max(1, Math.round(rect.height));
        laserCanvas.width = Math.round(W * dpr);
        laserCanvas.height = Math.round(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        draw();
      }

      function frame(now) {
        if (!running) { raf = null; return; }
        raf = window.requestAnimationFrame(frame);
        if (!last) last = now;
        t += Math.min((now - last) / 1000, 0.05);
        last = now;
        draw();
      }

      function start() {
        if (running || reduceMotion || document.hidden || !visible) return;
        running = true;
        last = 0;
        raf = window.requestAnimationFrame(frame);
      }

      function stop() {
        running = false;
        if (raf) { window.cancelAnimationFrame(raf); raf = null; }
      }

      window.addEventListener('resize', resize);
      document.addEventListener('visibilitychange', function () {
        if (document.hidden) stop(); else start();
      });

      if (window.IntersectionObserver) {
        new IntersectionObserver(function (entries) {
          visible = entries[0].isIntersecting;
          if (visible) start(); else stop();
        }, { threshold: 0 }).observe(laserCanvas);
      }

      resize();
      start();
    })();
  }
})();
