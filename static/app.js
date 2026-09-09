/* SONIDO EVENTS — site behaviour
   1. mobile navigation
   2. lazy, in-view video tiles
   3. the reel: vertical scroll drives the horizontal filmstrip
   4. the player: full-screen clip playback with sound            */

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
