// The Cabinet: three small ASCII instruments that only run in view.
(function () {
  const css = getComputedStyle(document.documentElement);
  const read = (name, fallback) => css.getPropertyValue(name).trim() || fallback;
  const C = {
    ink: read('--ink', '#e7dfc8'),
    dim: read('--dim', '#948a7b'),
    red: read('--red', '#d65348'),
    gold: read('--gold', '#d6b36a'),
  };
  const MONO = '"JetBrains Mono", ui-monospace, monospace';
  const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const TAU = Math.PI * 2;
  const EYES = [[16, 15], [28, 15]];
  const plates = [];

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const hash = (x, y, s = 0) => {
    let n = Math.imul(x + 31, 374761393) ^ Math.imul(y + 17, 668265263) ^ Math.imul(s + 7, 2147483647);
    n = Math.imul(n ^ (n >>> 13), 1274126177);
    return ((n ^ (n >>> 16)) >>> 0) / 4294967296;
  };

  function makeGrid(p, cols, rows) {
    const cell = Math.min(p.w / cols, p.h / rows);
    const ox = (p.w - cols * cell) / 2;
    const oy = (p.h - rows * cell) / 2;
    return {
      cell,
      put(x, y, ch, color) {
        if (x < 0 || x >= cols || y < 0 || y >= rows) return;
        p.ctx.fillStyle = color;
        p.ctx.fillText(ch, ox + (x + .5) * cell, oy + (y + .5) * cell);
      },
    };
  }

  function makePlate(selector, init, draw) {
    const canvas = document.querySelector(selector);
    if (!canvas) return null;
    const p = {
      canvas,
      screen: canvas.closest('.cab-screen'),
      ctx: canvas.getContext('2d'),
      w: 1, h: 1, t: 0, last: 0,
    };
    p.draw = (t) => draw(t, p);
    p.resize = () => {
      const r = p.screen.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      p.w = Math.max(1, Math.round(r.width));
      p.h = Math.max(1, Math.round(r.height));
      p.canvas.width = Math.round(p.w * dpr);
      p.canvas.height = Math.round(p.h * dpr);
      p.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      p.ctx.textAlign = 'center';
      p.ctx.textBaseline = 'middle';
      p.draw(p.t);
    };
    init(p);
    plates.push(p);
    return p;
  }

  function blink(p, t) {
    p.blinkUntil = t + .18;
    p.nextBlink = t + 4 + Math.random() * 4;
  }

  function initWatcher(p) {
    p.gaze = { x: 0, y: 0 };
    p.target = { x: 0, y: 0 };
    p.pointer = false;
    p.nextBlink = 3.5;
    p.blinkUntil = 0;
    p.screen.addEventListener('pointermove', (e) => {
      const r = p.screen.getBoundingClientRect();
      p.pointer = true;
      p.target.x = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
      p.target.y = clamp(((e.clientY - r.top) / r.height) * 2 - 1, -1, 1);
    });
    p.screen.addEventListener('pointerleave', () => {
      p.pointer = false;
      p.target.x = 0;
      p.target.y = 0;
    });
    p.screen.addEventListener('pointerdown', () => blink(p, p.t));
  }

  function drawWatcher(t, p) {
    p.t = t;
    if (t > p.nextBlink) blink(p, t);
    const tx = p.pointer ? p.target.x : Math.sin(t * .31) * .6;
    const ty = p.pointer ? p.target.y : Math.cos(t * .27) * .3;
    p.gaze.x += (tx - p.gaze.x) * .08;
    p.gaze.y += (ty - p.gaze.y) * .08;

    const ctx = p.ctx;
    ctx.clearRect(0, 0, p.w, p.h);
    const g = makeGrid(p, 44, 32);
    ctx.font = `500 ${Math.max(7, Math.min(13, g.cell * 1.1))}px ${MONO}`;
    const { put } = g;

    // Short feather tufts — not wings.
    [[9, 5], [10, 6], [11, 7], [12, 8], [35, 5], [34, 6], [33, 7], [32, 8]]
      .forEach(([x, y]) => put(x, y, '#', C.ink));

    // Head: a broad facial disk with a sparse etched interior.
    for (let y = 3; y < 28; y++) for (let x = 4; x < 40; x++) {
      const d = ((x - 22) / 15) ** 2 + ((y - 14) / 10.8) ** 2;
      if (d > 1.06) continue;
      if (d > .9) { put(x, y, '#', C.ink); continue; }
      if (EYES.some(([ex, ey]) => Math.hypot(x - ex, y - ey) < 5.7)) continue;
      if (hash(x, y, 1) > .78) put(x, y, hash(x, y, 2) > .5 ? '.' : ':', C.dim);
    }

    // Chest below the disk.
    for (let y = 23; y < 32; y++) for (let x = 13; x < 31; x++) {
      const d = ((x - 22) / 8) ** 2 + ((y - 28) / 4.6) ** 2;
      if (d > 1.05) continue;
      if (d > .82) put(x, y, '#', C.ink);
      else if (hash(x, y, 4) > .82) put(x, y, '.', C.dim);
    }

    EYES.forEach(([ex, ey]) => {
      for (let y = ey - 7; y <= ey + 7; y++) for (let x = ex - 7; x <= ex + 7; x++) {
        const d = Math.hypot(x - ex, y - ey);
        if (d >= 6.3 && d < 6.8) put(x, y, ':', C.dim);
        if (d >= 5.3 && d < 5.8) put(x, y, ':', C.gold);
      }
      if (t < p.blinkUntil) {
        for (let dx = -2; dx <= 2; dx++) put(ex + dx, ey, '-', C.ink);
      } else {
        const px = Math.round(ex + p.gaze.x * 1.7);
        const py = Math.round(ey + p.gaze.y * 1.2);
        ctx.save();
        ctx.shadowColor = C.red;
        ctx.shadowBlur = 7;
        put(px, py, 'o', C.red);
        ctx.restore();
      }
    });

    put(22, 19, 'v', C.gold);
    put(21, 20, '\\', C.gold);
    put(23, 20, '/', C.gold);
    put(22, 21, '^', C.gold);

    [[19, 26], [20, 26], [24, 26], [25, 26], [18, 28], [26, 28]]
      .forEach(([x, y]) => put(x, y, '.', C.dim));
    put(18, 30, '|', C.ink);
    put(26, 30, '|', C.ink);
    for (let x = 8; x <= 36; x += 2) put(x, 31, '-', C.gold);
    put(8, 31, '+', C.gold);
    put(36, 31, '+', C.gold);
  }

  makePlate('[data-cab="watcher"]', initWatcher, drawWatcher);

  function initSignal(p) {
    p.tune = 0;
    p.tuneTarget = 0;
    p.pulse = -9;
    p.screen.addEventListener('pointermove', (e) => {
      const r = p.screen.getBoundingClientRect();
      p.tuneTarget = clamp(((e.clientX - r.left) / r.width) * 2 - 1, -1, 1);
    });
    p.screen.addEventListener('pointerleave', () => { p.tuneTarget = 0; });
    p.screen.addEventListener('pointerdown', () => { p.pulse = p.t; });
  }

  function drawSignal(t, p) {
    p.t = t;
    p.tune += (p.tuneTarget - p.tune) * .07;
    const ctx = p.ctx;
    ctx.clearRect(0, 0, p.w, p.h);
    const g = makeGrid(p, 48, 30);
    ctx.font = `500 ${Math.max(7, Math.min(13, g.cell * 1.1))}px ${MONO}`;
    const { put } = g;

    for (let x = 2; x < 46; x += 2) {
      put(x, 2, '|', C.dim);
      put(x, 28, '|', C.dim);
    }
    for (let y = 4; y < 27; y++) for (let x = 2; x < 46; x++) {
      if (hash(x, y, 10) > .95) put(x, y, hash(x, y, 11) > .5 ? '0' : '1', C.dim);
    }

    for (let x = 2; x < 46; x++) {
      const v = Math.sin(x * .31 - t * 1.15 + p.tune * 2.2) * .6
        + Math.sin(x * .12 + t * .55) * .26
        + Math.sin(x * .55 + t * .23) * .14;
      const y = Math.round(15 + v * 7);
      put(x, y, x % 2 ? '=' : '+', C.gold);
      put(x, y - 1, '.', C.dim);
      put(x, y + 1, '.', C.dim);
      if (v > .55) put(x, y, '#', C.red);
    }

    const sx = Math.floor((t * 5) % 48);
    for (let y = 3; y < 29; y += 2) put(sx, y, ':', C.gold);

    const age = t - p.pulse;
    if (age >= 0 && age < 1) {
      const r = Math.round(age * 18);
      for (let a = 0; a < TAU; a += .4) {
        put(Math.round(24 + Math.cos(a) * r), Math.round(15 + Math.sin(a) * r * .55), '.', C.red);
      }
      for (let x = 3; x < 45; x++) if (Math.abs(x - 24) < r * .7) put(x, 29, '-', C.dim);
    }
  }

  makePlate('[data-cab="signal"]', initSignal, drawSignal);
  function initBlade(p) {
    p.start = 0;
    p.flash = -9;
    p.screen.addEventListener('pointerdown', () => {
      const now = performance.now() / 1000;
      p.start = now;
      p.flash = now;
      p.t = now;
    });
  }

  function drawBlade(t, p) {
    p.t = t;
    const phase = ((t - p.start) % 16 + 16) % 16 / 16;
    const melt = .5 - .5 * Math.cos(phase * TAU);
    const ctx = p.ctx;
    ctx.clearRect(0, 0, p.w, p.h);
    const g = makeGrid(p, 48, 30);
    ctx.font = `500 ${Math.max(7, Math.min(13, g.cell * 1.1))}px ${MONO}`;
    const { put } = g;
    const hy = 16;

    for (let x = 4; x <= 10; x++) put(x, hy, '=', C.gold);
    put(4, hy, 'o', C.gold);
    [[11, hy - 2], [12, hy - 1], [12, hy + 1], [11, hy + 2]]
      .forEach(([x, y]) => put(x, y, '#', C.gold));

    const end = 44 - melt * 11;
    // The whole silhouette stays; the far edge thins to a dotted ghost as it melts.
    for (let x = Math.floor(end) + 1; x <= 44; x++) {
      const y = hy - Math.sin((x - 12) * .09) * .6 - (x - 12) * .01;
      put(x, Math.round(y), '.', C.dim);
    }
    for (let x = 12; x <= Math.min(44, end); x++) {
      const y = Math.round(hy - Math.sin((x - 12) * .09) * .6 - (x - 12) * .01);
      put(x, y, '=', C.ink);
      put(x, y - 1, '-', C.dim);
      put(x, y + 1, '.', C.dim);
      if (x % 6 === 0) put(x, y - 2, '.', C.gold);
    }
    put(Math.round(Math.min(44, end)), Math.round(hy - Math.sin((Math.min(44, end) - 12) * .09) * .6), '>', C.gold);
    if (melt > .12) {
      put(Math.round(Math.min(43, end)), hy, '#', C.red);
      put(Math.round(Math.min(44, end)) + 1, hy + 1, '.', C.red);
    }

    const gx = Math.round(13 + ((Math.sin(t * .6) + 1) / 2) * 28);
    if (gx < end) {
      put(gx, Math.round(hy - Math.sin((gx - 12) * .09) * .6 - (gx - 12) * .01), '#', C.gold);
    }

    if (melt > .08) {
      for (let i = 0; i < 14; i++) {
        const dx = 13 + Math.floor(hash(i, 21) * 30);
        if (dx > end) continue;
        const fall = (t * (.5 + hash(i, 22)) + i * 2.1) % 7;
        const y = hy + 2 + Math.floor(fall * (.5 + melt * 1.5));
        put(dx, y, i % 2 ? '|' : '.', i % 3 === 0 ? C.red : C.dim);
      }
    }
    if (melt > .35) {
      for (let x = 9; x < 41; x += 2) if (hash(x, 1, 12) > .45) put(x, 28, '~', C.dim);
    }
    if (t - p.flash < .4) {
      ctx.save();
      ctx.shadowColor = C.gold;
      ctx.shadowBlur = 10;
      put(11, hy - 3, '*', C.gold);
      ctx.restore();
    }
  }

  makePlate('[data-cab="blade"]', initBlade, drawBlade);
  const active = new Set();
  let raf = 0;

  function loop(now) {
    raf = 0;
    const t = now / 1000;
    for (const p of active) {
      if (now - p.last < 1000 / 24) continue;
      p.last = now;
      p.draw(t);
    }
    if (active.size) raf = requestAnimationFrame(loop);
  }

  function wake() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  if (!plates.length) return;

  plates.forEach((p) => p.resize());
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => plates.forEach((p) => {
      if (!active.has(p)) p.draw(p.t);
    }));
  }

  if (!REDUCED) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const p = plates.find((x) => x.screen === e.target);
        if (!p) return;
        if (e.isIntersecting) active.add(p);
        else active.delete(p);
      });
      if (active.size) wake();
    }, { threshold: .12 });
    plates.forEach((p) => io.observe(p.screen));

    const ro = new ResizeObserver((entries) => {
      entries.forEach((e) => {
        const p = plates.find((x) => x.screen === e.target);
        if (p) p.resize();
      });
    });
    plates.forEach((p) => ro.observe(p.screen));
  }
})();
