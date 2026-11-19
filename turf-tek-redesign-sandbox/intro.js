/* Service-page intros (sandbox trial).
   Clicking a link to a service page: a circle bursts out of the icon (or tap point),
   a short scene plays, then the circle shrinks back to that point to reveal the new page.
   The Turf Tek logo is the official file, shown unaltered (fade only). */
(() => {
  const C = { ds: '#22372B', ds2: '#14211B', vf: '#86C53F', vf2: '#74ae34', vf3: '#a3d06a', fb: '#E2E872', mist: '#CFE4B1',
    gold: '#D6A461', brown: '#8B5B29', tint: '#F4F8EE', dirt: '#b48a5c', mud: '#6b4a2b', mud2: '#4e341d' };
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- overlay ---------- */
  const css = document.createElement('style');
  css.textContent = `
  #sx{position:fixed;inset:0;z-index:9999;display:none;will-change:clip-path}
  #sx canvas{position:absolute;inset:0;width:100%;height:100%}
  #sx .lg{position:absolute;left:50%;top:max(14px,3vh);transform:translateX(-50%);width:min(40vw,210px);opacity:0;pointer-events:none;background:rgba(255,255,255,.92);padding:8px 14px;border-radius:14px;box-shadow:0 4px 18px rgba(20,33,27,.18)}
  #sx .lg img{width:100%;display:block}
  #sx .sk{position:absolute;right:14px;bottom:14px;background:rgba(20,33,27,.5);color:#fff;border:0;padding:7px 13px;border-radius:20px;font:600 12px Satoshi,system-ui,sans-serif;cursor:pointer}`;
  document.head.appendChild(css);
  const el = document.createElement('div'); el.id = 'sx';
  el.innerHTML = `<canvas></canvas><div class="lg"><img src="assets/logo-deep-spring-fresh-blade.png" alt="Turf Tek"></div><button class="sk">Skip ›</button>`;
  document.body.appendChild(el);
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d'), lg = el.querySelector('.lg');

  /* ---------- helpers ---------- */
  let W, H, S, gy;
  const cl = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const seg = (t, a, b) => cl((t - a) / (b - a));
  const lerp = (a, b, k) => a + (b - a) * k;
  const out = t => 1 - Math.pow(1 - t, 3);
  const inOut = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  const back = t => { const c = 1.9; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
  const rnd = i => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x); };
  const circ = (x, y, r, col) => { ctx.beginPath(); ctx.arc(x, y, Math.max(0, r), 0, 7); ctx.fillStyle = col; ctx.fill(); };
  const rect = (x, y, w, h, col) => { ctx.fillStyle = col; ctx.fillRect(x, y, w, h); };
  const line = (x1, y1, x2, y2, w, col) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.lineWidth = w; ctx.strokeStyle = col; ctx.lineCap = 'round'; ctx.stroke(); };

  function size() {
    const d = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    S = Math.min(W, H * 1.15); gy = H * .7;
  }
  function sky() { const g = ctx.createLinearGradient(0, 0, 0, gy); g.addColorStop(0, C.tint); g.addColorStop(1, C.mist); rect(0, 0, W, gy, g); }
  function sun(x, y, r, spin = 0) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(spin);
    for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); line(r * 1.25, 0, r * 1.6, 0, r * .12, C.fb); }
    ctx.restore(); circ(x, y, r, C.fb);
  }
  // blades of grass along y=base from x0..x1, grown by k
  function blades(x0, x1, base, h, k, seed = 1) {
    if (k <= 0 || x1 <= x0) return;
    const step = Math.max(5, S / 120);
    for (let x = x0, i = 0; x < x1; x += step, i++) {
      const r = rnd(i * 7.1 + seed), hh = h * (.45 + r * .75) * k, lean = (rnd(i * 3.3 + seed) - .5) * hh * .5;
      ctx.beginPath(); ctx.moveTo(x - step * .55, base + 1); ctx.quadraticCurveTo(x, base - hh * .5, x + lean, base - hh);
      ctx.quadraticCurveTo(x + step * .1, base - hh * .5, x + step * .55, base + 1); ctx.closePath();
      ctx.fillStyle = r < .55 ? C.vf : (r < .82 ? C.vf2 : C.vf3); ctx.fill();
    }
  }
  function turf(x0, x1, top = gy, k = 1, seed = 1) { rect(x0, top, x1 - x0, H - top, C.vf); blades(x0, x1, top, S * .035, k, seed); }
  function stripes(x0, y0, w, h, n, a = C.vf, b = C.vf2) { for (let i = 0; i < n; i++) rect(x0 + w / n * i, y0, w / n + 1, h, i % 2 ? b : a); }
  function shadow(x, y, rx) { ctx.beginPath(); ctx.ellipse(x, y, rx, rx * .28, 0, 0, 7); ctx.fillStyle = 'rgba(20,33,27,.22)'; ctx.fill(); }

  /* ---------- scenes: each gets p = 0..1 ---------- */
  function apartment(p, roofDeck) {
    sky(); sun(W * .16, H * .16, S * .06, p);
    rect(0, gy, W, H - gy, C.dirt);
    const bw = S * .4, bh = S * .4, bx = W / 2 - bw / 2, by = gy - bh;
    rect(bx, by, bw, bh, C.ds);
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) {
      const lit = rnd(r * 9 + c) > .35; rect(bx + bw * (.08 + c * .23), by + bh * (.07 + r * .155), bw * .14, bh * .09, lit ? C.fb : '#3c5547');
    }
    rect(W / 2 - bw * .08, gy - bh * .14, bw * .16, bh * .14, C.gold);
    ctx.beginPath(); ctx.moveTo(bx, gy); ctx.lineTo(bx + bw, gy); ctx.lineTo(bx + bw * 1.15, H); ctx.lineTo(bx - bw * .15, H); ctx.closePath(); ctx.fillStyle = '#e9e3d6'; ctx.fill();
    const g = out(seg(p, .08, .8));
    turf(bx - g * (bx + 10), bx, gy, out(seg(p, .08, .9)), 2);
    turf(bx + bw, bx + bw + g * (W - bx - bw + 10), gy, out(seg(p, .08, .9)), 3);
    if (roofDeck) { const rg = out(seg(p, .2, .85)); rect(W / 2 - bw / 2 * rg, by - S * .012, bw * rg, S * .014, C.vf); blades(W / 2 - bw / 2 * rg, W / 2 + bw / 2 * rg, by - S * .01, S * .03, rg, 5); }
  }

  function house(p) {
    sky(); sun(W * .82, H * .15, S * .06, p);
    rect(0, gy, W, H - gy, C.dirt);
    const hw = S * .4, hh = S * .22, hx = W / 2 - hw / 2, hy = gy - hh;
    rect(hx, hy, hw, hh, '#fff'); ctx.lineWidth = 3; ctx.strokeStyle = C.ds; ctx.strokeRect(hx, hy, hw, hh);
    ctx.beginPath(); ctx.moveTo(hx - hw * .08, hy); ctx.lineTo(W / 2, hy - hh * .75); ctx.lineTo(hx + hw * 1.08, hy); ctx.closePath(); ctx.fillStyle = C.ds; ctx.fill();
    rect(W / 2 - hw * .07, gy - hh * .55, hw * .14, hh * .55, C.gold);
    rect(hx + hw * .1, hy + hh * .25, hw * .2, hh * .3, C.fb); rect(hx + hw * .7, hy + hh * .25, hw * .2, hh * .3, C.fb);
    // lawn rolls out from the house toward you
    const g = inOut(seg(p, .1, .85)), lh = (H - gy) * g;
    stripes(0, gy, W, lh, 12);
    blades(0, W, gy + lh, S * .03, g > 0 && g < 1 ? 1 : 0, 4);
    blades(0, W, gy, S * .03, out(seg(p, .7, 1)), 6);
    // walkway
    ctx.beginPath(); ctx.moveTo(W / 2 - hw * .07, gy); ctx.lineTo(W / 2 + hw * .07, gy); ctx.lineTo(W / 2 + hw * .16, H); ctx.lineTo(W / 2 - hw * .16, H); ctx.closePath(); ctx.fillStyle = '#e9e3d6'; ctx.fill();
  }

  function playground(p, pip) {
    sky(); sun(W * .85, H * .15, S * .055, p);
    rect(0, gy, W, H - gy, C.dirt);
    const cx = W / 2, g = out(seg(p, .55, .95));
    if (pip) { rect(cx - g * W, gy, g * W * 2, H - gy, '#3a78b5'); for (let i = 0; i < 9; i++) circ(cx + (rnd(i) - .5) * W * 1.6 * g, gy + (H - gy) * (.3 + rnd(i + 4) * .6), S * .05 * g, i % 2 ? C.vf : C.fb); }
    else turf(cx - g * W, cx + g * W, gy, g, 8);
    const ph = S * .34 * back(seg(p, 0, .3)), x1 = cx - S * .2, x2 = cx - S * .02;
    rect(x1 - S * .012, gy - ph, S * .024, ph, C.ds); rect(x2 - S * .012, gy - ph, S * .024, ph, C.ds);
    const dk = out(seg(p, .22, .38)), dy = gy - S * .17;
    rect(x1, dy, (x2 - x1) * dk, S * .022, C.gold);
    const rf = back(seg(p, .34, .5));
    if (rf > 0) { ctx.save(); ctx.translate((x1 + x2) / 2, gy - S * .34); ctx.scale(rf, rf);
      ctx.beginPath(); ctx.moveTo(-S * .13, 0); ctx.lineTo(0, -S * .1); ctx.lineTo(S * .13, 0); ctx.closePath(); ctx.fillStyle = C.vf; ctx.fill(); ctx.restore(); }
    const sl = out(seg(p, .42, .58));
    if (sl > 0) line(x2, dy, lerp(x2, cx + S * .24, sl), lerp(dy, gy - S * .01, sl), S * .03, C.fb);
    const ld = seg(p, .3, .5); for (let i = 1; i <= 4; i++) if (ld > i / 4 - .2) line(x1 - S * .07, gy - S * .17 * i / 4.5, x1, gy - S * .17 * i / 4.5, S * .008, C.ds);
    if (ld > 0) { line(x1 - S * .07, gy, x1 - S * .07, lerp(gy, dy, ld), S * .01, C.ds); }
    // swing set
    const sw = back(seg(p, .48, .64));
    if (sw > 0) { const sx = cx + S * .33, top = gy - S * .24 * sw;
      line(sx - S * .1, gy, sx, top, S * .012, C.ds); line(sx + S * .1, gy, sx, top, S * .012, C.ds);
      line(sx - S * .14, top, sx + S * .14, top, S * .012, C.ds);
      const a = Math.sin(p * 14) * .35 * sw; ctx.save(); ctx.translate(sx - S * .05, top); ctx.rotate(a);
      line(0, 0, 0, S * .17, S * .004, C.ds); rect(-S * .025, S * .17, S * .05, S * .012, C.gold); ctx.restore(); }
  }

  function dogScene(p) {
    sky(); sun(W * .85, H * .14, S * .05, p);
    const tg = out(seg(p, .44, .56));
    rect(0, gy, W, H - gy, C.mud);
    for (let i = 0; i < 6; i++) { ctx.beginPath(); ctx.ellipse(W * (.1 + i * .17), gy + (H - gy) * (.25 + rnd(i) * .5), S * .07, S * .018, 0, 0, 7); ctx.fillStyle = C.mud2; ctx.fill(); }
    if (tg > 0) { const top = H - (H - gy) * tg; stripes(0, top, W, H - top, 10); blades(0, W, top, S * .03, tg < 1 ? 1 : 0, 9); }
    if (tg >= 1) blades(0, W, gy, S * .03, 1, 9);
    const size = S * .2, y = gy + (H - gy) * .35;
    if (p < .44) {
      const k = p / .44, x = lerp(-size * 1.4, W + size * 1.4, k);
      for (let i = 0; i < 10; i++) { const a = rnd(Math.floor(p * 90) + i), b = rnd(i * 3 + Math.floor(p * 90)); circ(x - size * (.3 + a * .6), y - size * (.1 + b * .5), size * .035 * (1 - a * .5), C.mud2); }
      dog(x, y, size, 1, p, k);
    } else if (p > .55) {
      const k = (p - .55) / .45, x = lerp(W + size * 1.4, -size * 1.4, k);
      dog(x, y, size, -1, p, 0);
    }
  }
  function dog(x, y, s, dir, t, mud) {
    const run = Math.sin(t * 70), by = y - s * .5 + Math.abs(run) * s * .05;
    shadow(x, y + s * .02, s * .5);
    ctx.save(); ctx.translate(x, 0); ctx.scale(dir, 1);
    [[-.32, 1], [-.18, -1], [.22, 1], [.36, -1]].forEach(([lx, ph]) => line(lx * s, by + s * .12, lx * s + run * ph * s * .14, y, s * .07, C.gold));
    line(-.42 * s, by - s * .06, -.6 * s, by - s * .28 + run * s * .05, s * .06, C.gold);
    ctx.beginPath(); ctx.ellipse(0, by, s * .48, s * .2, 0, 0, 7); ctx.fillStyle = C.gold; ctx.fill();
    circ(s * .5, by - s * .22, s * .17, C.gold);
    ctx.beginPath(); ctx.ellipse(s * .66, by - s * .18, s * .1, s * .07, 0, 0, 7); ctx.fillStyle = C.gold; ctx.fill();
    circ(s * .75, by - s * .2, s * .03, C.ds2); circ(s * .55, by - s * .27, s * .022, C.ds2);
    ctx.beginPath(); ctx.ellipse(s * .43, by - s * .26, s * .06, s * .13, -.5, 0, 7); ctx.fillStyle = C.brown; ctx.fill();
    if (mud > 0) for (let i = 0; i < 9; i++) { if (rnd(i + 40) > mud) continue; circ((rnd(i) - .5) * s * .8, by + (rnd(i + 9) - .3) * s * .25, s * (.04 + rnd(i + 2) * .05), C.mud2); }
    ctx.restore();
  }

  function bounceBall(p, kind) {
    sky();
    if (kind === 'court') { rect(0, gy, W, H - gy, '#2f6b52'); line(0, gy + (H - gy) * .3, W, gy + (H - gy) * .3, 3, '#fff'); }
    else turf(0, W, gy, 1, 11);
    const r = S * (kind === 'court' ? .07 : .06), n = 3;
    const x = lerp(-r, W + r, p), ph = (p * n) % 1, amp = S * .4 * Math.pow(.7, Math.floor(p * n));
    const h = 4 * ph * (1 - ph), y = gy - r - h * amp;
    const sq = h < .08 ? 1 - (.08 - h) * 3 : 1;
    shadow(x, gy + 2, r * (1.1 - h * .4));
    ctx.save(); ctx.translate(x, y + r * (1 - sq)); ctx.scale(2 - sq, sq); ctx.rotate(p * 12);
    circ(0, 0, r, kind === 'court' ? '#d9792b' : C.fb);
    ctx.lineWidth = r * .08; ctx.strokeStyle = kind === 'court' ? C.ds2 : C.ds;
    ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(r, 0); ctx.moveTo(0, -r); ctx.lineTo(0, r); ctx.stroke();
    ctx.beginPath(); ctx.arc(-r * 1.25, 0, r * .9, -.8, .8); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 1.25, 0, r * .9, Math.PI - .8, Math.PI + .8); ctx.stroke();
    ctx.restore();
  }

  function football(p) {
    sky(); stripes(0, gy, W, H - gy, 8);
    for (let i = 1; i < 8; i++) line(W / 8 * i, gy + 4, W / 8 * i - S * .03, H, 2, 'rgba(255,255,255,.75)');
    blades(0, W, gy, S * .02, 1, 12);
    const gx = W * .8, cb = gy - S * .3;
    line(gx, gy, gx, cb, S * .014, C.fb); line(gx - S * .1, cb, gx + S * .1, cb, S * .014, C.fb);
    line(gx - S * .1, cb, gx - S * .1, gy - S * .62, S * .012, C.fb); line(gx + S * .1, cb, gx + S * .1, gy - S * .62, S * .012, C.fb);
    const xx = k => W * .08 + k * W * 1.08, yy = k => gy - S * .05 - 4 * S * .5 * k * (1 - k);
    const k = out(p) * .5 + p * .5;
    for (let i = 1; i < 8; i++) { const kk = k - i * .022; if (kk > 0) circ(xx(kk), yy(kk), S * .006 * (1 - i / 9), 'rgba(34,55,43,.35)'); }
    const ang = Math.atan2(yy(k + .01) - yy(k), xx(k + .01) - xx(k));
    ctx.save(); ctx.translate(xx(k), yy(k)); ctx.rotate(ang); ctx.scale(1, .75 + .25 * Math.cos(p * 40));
    ctx.beginPath(); ctx.ellipse(0, 0, S * .065, S * .037, 0, 0, 7); ctx.fillStyle = C.brown; ctx.fill();
    line(-S * .025, 0, S * .025, 0, S * .005, '#fff'); for (let i = -2; i <= 2; i++) line(i * S * .01, -S * .008, i * S * .01, S * .008, S * .004, '#fff');
    ctx.restore();
  }

  function baseball(p) {
    sky(); rect(0, gy - S * .07, W, S * .07, C.ds);
    turf(0, W, gy, 1, 13);
    ctx.beginPath(); ctx.ellipse(W * .38, H, W * .35, (H - gy) * .55, 0, Math.PI, 0); ctx.fillStyle = C.dirt; ctx.fill();
    const px = W * .36, py = gy - S * .02, hitT = .32;
    // pitch
    let bx, by, br = S * .028;
    if (p < hitT) { const k = p / hitT; bx = lerp(W + br, px + S * .3, k); by = lerp(gy - S * .26, gy - S * .2, k * k); }
    else { const k = out(seg(p, hitT, .85)); bx = lerp(px + S * .3, W * 1.1, k); by = lerp(gy - S * .2, -S * .15, k) - Math.sin(k * Math.PI) * S * .1; br *= 1 - k * .5;
      for (let i = 1; i < 6; i++) { const kk = out(seg(p - i * .018, hitT, .85)); circ(lerp(px + S * .3, W * 1.1, kk), lerp(gy - S * .2, -S * .15, kk) - Math.sin(kk * Math.PI) * S * .1, br * (1 - i / 7), 'rgba(255,255,255,.5)'); } }
    // bat swing
    const sw = seg(p, hitT - .1, hitT + .04), a = lerp(-2.5, .35, sw * sw) + (p > hitT + .04 ? out(seg(p, hitT + .04, .6)) * .9 : 0);
    ctx.save(); ctx.translate(px, py - S * .18); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0, -S * .012); ctx.lineTo(S * .4, -S * .024); ctx.arc(S * .4, 0, S * .024, -Math.PI / 2, Math.PI / 2); ctx.lineTo(0, S * .012); ctx.closePath(); ctx.fillStyle = C.gold; ctx.fill();
    circ(0, 0, S * .018, C.brown); ctx.restore();
    if (p > hitT - .01 && p < hitT + .12) { const f = seg(p, hitT - .01, hitT + .12); ctx.globalAlpha = 1 - f;
      for (let i = 0; i < 10; i++) { const an = i / 10 * Math.PI * 2; line(px + S * .3 + Math.cos(an) * S * .04, gy - S * .2 + Math.sin(an) * S * .04, px + S * .3 + Math.cos(an) * S * (.06 + f * .08), gy - S * .2 + Math.sin(an) * S * (.06 + f * .08), S * .01, C.fb); }
      ctx.globalAlpha = 1; }
    circ(bx, by, br, '#fff'); ctx.beginPath(); ctx.arc(bx - br * .9, by, br * .7, -.7, .7); ctx.lineWidth = br * .15; ctx.strokeStyle = '#c0392b'; ctx.stroke();
  }

  function tennis(p) {
    sky(); rect(0, gy, W, H - gy, '#3f8f4a'); line(0, gy + 3, W, gy + 3, 4, '#fff');
    blades(0, W, gy, S * .012, 1, 14);
    const nx = W * .5; rect(nx - S * .012, gy - S * .17, S * .024, S * .17, 'rgba(34,55,43,.25)'); rect(nx - S * .006, gy - S * .17, S * .012, S * .17, C.ds);
    ctx.strokeStyle = 'rgba(34,55,43,.6)'; ctx.lineWidth = 1; for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(nx - S * .012, gy - S * .17 * i / 7); ctx.lineTo(nx + S * .012, gy - S * .17 * i / 7); ctx.stroke(); }
    rect(nx - S * .014, gy - S * .18, S * .028, S * .014, '#fff');
    const r = S * .035, bt = .55; let x, y, sq = 1;
    if (p < bt) { const k = p / bt; x = lerp(-r, W * .74, k); y = lerp(gy - S * .3, gy - r, k) - Math.sin(k * Math.PI) * S * .2; }
    else { const k = (p - bt) / (1 - bt); x = lerp(W * .74, W + r * 2, k); y = gy - r - Math.sin(k * Math.PI * .9) * S * .32; }
    const near = Math.abs(p - bt); if (near < .03) sq = .7 + near * 10;
    if (p > bt) { const f = seg(p, bt, bt + .25); ctx.globalAlpha = 1 - f; for (let i = 0; i < 6; i++) circ(W * .74 + (i - 2.5) * S * .025 * (1 + f * 2), gy - S * .01 - f * S * .03 * rnd(i), S * .012 * (1 + f), '#fff'); ctx.globalAlpha = 1; }
    shadow(x, gy + 2, r * .9);
    ctx.save(); ctx.translate(x, y + r * (1 - sq)); ctx.scale(2 - sq, sq); circ(0, 0, r, '#d4e157');
    ctx.lineWidth = r * .12; ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.arc(-r * 1.1, 0, r * .85, -.9, .9); ctx.stroke(); ctx.beginPath(); ctx.arc(r * 1.1, 0, r * .85, Math.PI - .9, Math.PI + .9); ctx.stroke(); ctx.restore();
  }

  function shade(p) {
    const cover = out(seg(p, .3, .7));
    sky(); const sr = S * .09;
    sun(W * .78, H * .15, sr * (1 + .08 * Math.sin(p * 20) * (1 - cover)), p * 1.5);
    turf(0, W, gy, 1, 15);
    // heat shimmer before the shade
    if (cover < 1) { ctx.globalAlpha = (1 - cover) * .5; for (let i = 0; i < 5; i++) { ctx.beginPath(); for (let x = 0; x < S * .2; x += 4) ctx.lineTo(W * (.2 + i * .14) + x, gy - S * .1 - Math.sin(x * .08 + p * 30 + i) * 4); ctx.lineWidth = 2; ctx.strokeStyle = C.gold; ctx.stroke(); } ctx.globalAlpha = 1; }
    // bench + little slide
    rect(W * .4, gy - S * .07, S * .2, S * .02, C.gold); rect(W * .4 + S * .02, gy - S * .05, S * .015, S * .05, C.ds); rect(W * .4 + S * .165, gy - S * .05, S * .015, S * .05, C.ds);
    const ph = S * .42 * back(seg(p, 0, .25)), l = W * .5 - S * .4, r = W * .5 + S * .4;
    line(l, gy, l, gy - ph, S * .016, C.ds); line(r, gy, r, gy - ph * .8, S * .016, C.ds);
    if (cover > 0) {
      const a = [l, gy - S * .42], b = [lerp(l, r, cover), lerp(gy - S * .42, gy - S * .34, cover)], c = [lerp(l, W * .5 + S * .05, cover), lerp(gy - S * .42, gy - S * .24, cover)];
      ctx.beginPath(); ctx.moveTo(l + S * .1, gy + (H - gy) * .15); ctx.lineTo(lerp(l, r, cover) + S * .1, gy + (H - gy) * .15); ctx.lineTo(lerp(l, r, cover) * .7 + l * .3, gy + (H - gy) * .55); ctx.closePath(); ctx.fillStyle = `rgba(20,33,27,${.28 * cover})`; ctx.fill();
      ctx.beginPath(); ctx.moveTo(...a); ctx.quadraticCurveTo((a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + S * .03, ...b); ctx.quadraticCurveTo((b[0] + c[0]) / 2, (b[1] + c[1]) / 2 - S * .02, ...c); ctx.quadraticCurveTo((c[0] + a[0]) / 2 + S * .02, (c[1] + a[1]) / 2, ...a); ctx.fillStyle = C.vf; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = C.ds; ctx.stroke();
    }
  }

  function putting(p) {
    const g = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.hypot(W, H) / 1.6); g.addColorStop(0, '#4c9a46'); g.addColorStop(1, C.ds);
    rect(0, 0, W, H, g);
    ctx.globalAlpha = .07; ctx.fillStyle = '#fff'; const s = Math.max(40, W / 10);
    for (let x = -H; x < W + H; x += s * 2) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + s, 0); ctx.lineTo(x + s - H * .4, H); ctx.lineTo(x - H * .4, H); ctx.fill(); }
    ctx.globalAlpha = 1;
    const cx = W / 2, cy = H / 2, R = S * .035;
    circ(cx, cy, R + 3, 'rgba(0,0,0,.25)'); circ(cx, cy, R, '#14211b');
    const r = seg(p, 0, .6), dr = seg(p, .6, .75), br = S * .026 * (1 - .75 * dr);
    if (dr < 1) { const sx = cx - W * .42, sy = cy + H * .3, k = out(r); let bx = lerp(sx, cx, k), by = lerp(sy, cy, k); if (dr > 0) { bx = cx; by = cy + dr * R * .3; }
      ctx.globalAlpha = 1 - dr * .9; circ(bx + br * .3, by + br * .4, br, 'rgba(0,0,0,.25)'); circ(bx, by, br, '#fff'); ctx.globalAlpha = 1; }
    const ring = seg(p, .72, 1); if (ring > 0) { ctx.globalAlpha = 1 - ring; ctx.beginPath(); ctx.arc(cx, cy, R + ring * S * .2, 0, 7); ctx.lineWidth = 5; ctx.strokeStyle = C.fb; ctx.stroke(); ctx.globalAlpha = 1; }
  }

  function bocce(p) {
    sky(); turf(0, W, gy, 1, 16); rect(0, gy - S * .03, W, S * .03, C.gold);
    const r = S * .045, tx = W * .66, ty = gy + (H - gy) * .45;
    circ(tx, ty, r * .45, '#fff');
    const k = out(seg(p, 0, .75)), x = lerp(-r, tx - r * 1.5, k);
    shadow(x, ty + r * .8, r); ctx.save(); ctx.translate(x, ty); ctx.rotate(k * 14); circ(0, 0, r, C.ds);
    line(-r * .7, 0, r * .7, 0, r * .12, C.vf); ctx.restore();
    const hit = seg(p, .74, 1); if (hit > 0) { ctx.globalAlpha = 1 - hit; ctx.beginPath(); ctx.arc(tx - r * .7, ty, r * (.5 + hit * 2), 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = C.fb; ctx.stroke(); ctx.globalAlpha = 1; }
  }

  const SCENES = {
    'commercial-landscape': [p => apartment(p, false), 1.25], rooftops: [p => apartment(p, true), 1.25],
    'residential-landscape': [house, 1.25],
    'commercial-playgrounds': [p => playground(p, false), 1.35], 'residential-playgrounds': [p => playground(p, false), 1.35], 'poured-in-place': [p => playground(p, true), 1.35],
    'commercial-pet-areas': [dogScene, 1.8], 'residential-pet-areas': [dogScene, 1.8],
    'commercial-athletics': [p => bounceBall(p, 'turf'), 1.1], 'residential-athletics': [p => bounceBall(p, 'turf'), 1.1], 'indoor-facilities': [p => bounceBall(p, 'turf'), 1.1],
    courts: [p => bounceBall(p, 'court'), 1.1], 'residential-courts': [p => bounceBall(p, 'court'), 1.1],
    'sport-fields': [football, 1.1], 'residential-fields': [football, 1.1], nextgen: [football, 1.1],
    baseball: [baseball, 1.15],
    'tennis-courts': [tennis, 1.0], 'residential-tennis': [tennis, 1.0],
    'shade-structures': [shade, 1.3],
    'putting-greens': [putting, 1.05], 'residential-putting': [putting, 1.05],
    bocce: [bocce, 1.0]
  };

  /* ---------- player ---------- */
  const OPEN = .38, CLOSE = .36, NAV_LEAD = .34;
  let raf, t0, scene, dur, target, ox, oy, rMax, navigated;
  function frame(now) {
    const t = (now - t0) / 1000, end = OPEN * .6 + dur;
    let r;
    if (t < OPEN) r = lerp(S * .03, rMax, back(t / OPEN));
    else if (t < end) r = rMax * 1.1;
    else r = lerp(rMax, 0, inOut(seg(t, end, end + CLOSE)));
    el.style.clipPath = `circle(${Math.max(0, r).toFixed(1)}px at ${ox}px ${oy}px)`;
    ctx.clearRect(0, 0, W, H);
    scene(cl((t - OPEN * .6) / dur));
    lg.style.opacity = (seg(t, OPEN * .5, OPEN) * (1 - seg(t, end - .15, end))).toFixed(3);
    if (t >= end - NAV_LEAD && !navigated) { navigated = true; location.hash = target; }
    if (t >= end + CLOSE) return finish();
    raf = requestAnimationFrame(frame);
  }
  function play(k, x, y) {
    size(); [scene, dur] = SCENES[k]; target = k; navigated = false; ox = x; oy = y;
    rMax = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
    el.style.clipPath = `circle(0px at ${x}px ${y}px)`; el.style.display = 'block';
    t0 = performance.now(); raf = requestAnimationFrame(frame);
  }
  function finish() {
    cancelAnimationFrame(raf); el.style.display = 'none';
    if (!navigated) { navigated = true; location.hash = target; }
  }
  el.querySelector('.sk').addEventListener('click', finish);
  addEventListener('resize', () => { if (el.style.display === 'block') size(); });

  document.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || reduce || e.metaKey || e.ctrlKey || el.style.display === 'block') return;
    const k = a.getAttribute('href').slice(1);
    if (!SCENES[k] || location.hash.slice(1) === k) return;
    e.preventDefault(); e.stopPropagation();
    const ic = a.querySelector('img.ic'), box = (ic || a).getBoundingClientRect();
    const useClick = !ic && e.clientX > 0;
    play(k, useClick ? e.clientX : box.left + box.width / 2, useClick ? e.clientY : box.top + box.height / 2);
  }, true);

  // preview hook for testing: window.__sxScene('baseball', 0.5)
  window.__sxScene = (k, p) => { size(); el.style.display = 'block'; el.style.clipPath = 'none'; lg.style.opacity = 1; ctx.clearRect(0, 0, W, H); SCENES[k][0](p); };
})();
