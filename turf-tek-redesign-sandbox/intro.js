/* Putting green intro (sandbox trial).
   Plays when any link to a putting greens page is clicked:
   ball is putted into the hole -> hole opens into a circle -> official logo file
   appears (never redrawn or reshaped) -> circle opens, grass rises -> page. */
(() => {
  const TARGETS = ['putting-greens', 'residential-putting'];
  const VF = '#86C53F', FB = '#E2E872', DS = '#22372B';
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const css = document.createElement('style');
  css.textContent = `
  #pgIntro{position:fixed;inset:0;z-index:9999;display:none}
  #pgIntro canvas{position:absolute;inset:0;width:100%;height:100%}
  #pgLogo{position:absolute;left:50%;top:50%;width:min(64vw,420px);transform:translate(-50%,-50%);opacity:0;pointer-events:none}
  #pgLogo img{width:100%;display:block}
  #pgSkip{position:absolute;right:16px;top:16px;background:rgba(20,33,27,.45);color:#fff;border:0;padding:8px 14px;border-radius:20px;font:600 13px Satoshi,system-ui,sans-serif;cursor:pointer}`;
  document.head.appendChild(css);

  const el = document.createElement('div');
  el.id = 'pgIntro';
  el.innerHTML = `<canvas></canvas><div id="pgLogo"><img src="assets/logo-deep-spring-fresh-blade.png" alt="Turf Tek"></div><button id="pgSkip">Skip ›</button>`;
  document.body.appendChild(el);
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), logo = el.querySelector('#pgLogo');

  let W, H, raf, t0, blades = [], target = null, navigated = false;
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  const out = t => 1 - Math.pow(1 - t, 3);
  const mix = (a, b, k) => { const p = s => [1, 3, 5].map(i => parseInt(s.slice(i, i + 2), 16)); const A = p(a), B = p(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * k)).join(',')})`; };
  // timeline in seconds
  const T = { roll: [.25, 1.35], drop: [1.35, 1.6], grow: [1.6, 2.15], logoIn: [2.0, 2.45], open: [3.0, 3.5], grass: [3.0, 3.75], nav: 3.6, reveal: [3.95, 4.35] };

  function size() {
    const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    blades = []; const n = Math.ceil(W / 5) + 20;
    for (let i = 0; i < n; i++) blades.push({ x: Math.random() * (W + 40) - 20, h: (.75 + Math.random() * .6) * H, w: 6 + Math.random() * 10, bend: (Math.random() - .5) * .5, d: Math.random() * .25, c: Math.random() });
  }

  function green() {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 1.6);
    g.addColorStop(0, '#4c9a46'); g.addColorStop(1, DS);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = .07; ctx.fillStyle = '#fff'; const s = Math.max(40, W / 10);
    for (let x = -H; x < W + H; x += s * 2) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + s, 0); ctx.lineTo(x + s - H * .4, H); ctx.lineTo(x - H * .4, H); ctx.fill(); }
    ctx.globalAlpha = 1;
  }

  function frame(now) {
    const t = (now - t0) / 1000, cx = W / 2, cy = H / 2, R0 = Math.min(W, H) * .028;
    ctx.clearRect(0, 0, W, H); green();

    // hole -> circle -> opens to full screen
    const gr = ease(seg(t, ...T.grow)), op = ease(seg(t, ...T.open));
    const Rl = Math.min(W * .44, 290), R = R0 + (Rl - R0) * gr + (Math.hypot(W, H) - Rl) * op;
    ctx.beginPath(); ctx.arc(cx, cy, R + 3, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fillStyle = mix('#14211b', '#ffffff', out(gr)); ctx.fill();
    if (gr > .05 && op < 1) { ctx.lineWidth = 6 * (1 - op); ctx.strokeStyle = FB; ctx.beginPath(); ctx.arc(cx, cy, R + 2, 0, 7); ctx.stroke(); }

    // ball putted in
    const r = seg(t, ...T.roll), dr = seg(t, ...T.drop);
    if (dr < 1) {
      const sx = cx - W * .42, sy = cy + H * .32, k = out(r);
      let bx = sx + (cx - sx) * k, by = sy + (cy - sy) * k; const br = Math.min(W, H) * .022 * (1 - .75 * dr);
      if (dr > 0) { bx = cx + Math.sin(dr * 9) * R0 * .25 * (1 - dr); by = cy + dr * R0 * .3; }
      ctx.globalAlpha = 1 - dr * .9;
      ctx.beginPath(); ctx.ellipse(bx + br * .35, by + br * .55, br, br * .55, 0, 0, 7); ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.fill();
      const bg = ctx.createRadialGradient(bx - br * .35, by - br * .35, br * .1, bx, by, br); bg.addColorStop(0, '#fff'); bg.addColorStop(1, '#cfd3cc');
      ctx.beginPath(); ctx.arc(bx, by, br, 0, 7); ctx.fillStyle = bg; ctx.fill(); ctx.globalAlpha = 1;
    }

    // official logo file: only opacity and position change
    const li = out(seg(t, ...T.logoIn)), lo = seg(t, T.open[0], T.open[0] + .25);
    logo.style.opacity = (li * (1 - lo)).toFixed(3);

    // grass rises from the bottom
    const gs = seg(t, ...T.grass);
    if (gs > 0) {
      for (const b of blades) {
        const p = out(cl((gs - b.d) / (1 - b.d))); if (p <= 0) continue;
        const h = b.h * p, tip = b.x + b.bend * h, c = b.x + b.bend * h * .2;
        ctx.beginPath(); ctx.moveTo(b.x - b.w / 2, H); ctx.quadraticCurveTo(c - b.w / 3, H - h * .55, tip, H - h);
        ctx.quadraticCurveTo(c + b.w / 3, H - h * .55, b.x + b.w / 2, H); ctx.closePath();
        ctx.fillStyle = b.c < .6 ? VF : (b.c < .85 ? '#74ae34' : '#a3d06a'); ctx.fill();
      }
      const f = ease(cl((gs - .55) / .45));
      if (f > 0) { ctx.globalAlpha = f; ctx.fillStyle = VF; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
    }

    // switch page under the grass, then fade the intro away
    if (t >= T.nav && !navigated) { navigated = true; location.hash = target; }
    const rv = seg(t, ...T.reveal);
    el.style.opacity = (1 - ease(rv)).toFixed(3);
    if (rv >= 1) return finish();
    raf = requestAnimationFrame(frame);
  }

  function play(k) {
    target = k; navigated = false; size();
    el.style.display = 'block'; el.style.opacity = 1; logo.style.opacity = 0;
    t0 = performance.now(); raf = requestAnimationFrame(frame);
  }
  function finish() {
    cancelAnimationFrame(raf); el.style.display = 'none';
    if (!navigated) { navigated = true; location.hash = target; }
  }
  el.querySelector('#pgSkip').addEventListener('click', finish);
  addEventListener('resize', () => { if (el.style.display === 'block') size(); });

  // catch clicks on any link to a putting greens page
  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || reduce || e.metaKey || e.ctrlKey) return;
    const k = a.getAttribute('href').slice(1);
    if (!TARGETS.includes(k) || location.hash.slice(1) === k) return;
    e.preventDefault(); e.stopPropagation();
    play(k);
  }, true);
})();
