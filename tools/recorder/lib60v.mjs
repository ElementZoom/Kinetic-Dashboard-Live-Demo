import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const S = process.env.SLOW ? +process.env.SLOW : 0.8; // pacing multiplier
// The phone is the S26 Ultra: 412 CSS px wide (what the real phone reports), 19.5:9. Loops are still written in the old 540-wide coordinates (x, y, w, h and the +208 bottom anchor);
// K converts them. PHONE_W=540 records the old, too-small layout. The mp4 is always 720x1558 and frames are captured at up to 2x.
export const W = +process.env.PHONE_W || 412, K = W / 540, H = Math.round(1168 * K), DY = 208, DPR = Math.min(2, 1080 / W);
export async function open(name, { zh = false, hash = '', dark = false, w = W, h = H, record = true, pre = null } = {}) {
  const dir = `/tmp/rl-${name}${zh ? '-zh' : ''}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch({ args: ['--enable-begin-frame-control', '--run-all-compositor-stages-before-draw', '--disable-new-content-rendering-timeout', '--disable-threaded-animation', '--disable-threaded-scrolling', '--disable-checker-imaging', '--disable-gpu-vsync'] });
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: DPR });
  await ctx.addInitScript(() => { try { localStorage.dashPal = JSON.stringify({ mode: 'dark' }); } catch (e) {} window.__cmForce = true; });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(`http://localhost:8765/app/dash.html${zh ? '?lang=zh' : ''}${hash}`);
  await p.waitForTimeout(2500);
  await p.evaluate((K) => {
    const d = document.createElement('div'); d.id = 'ezspot';
    d.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;box-sizing:border-box;border:3px solid rgba(255,255,255,0);border-radius:22px;pointer-events:none;z-index:2147483000';
    const bl = document.createElement('div'); bl.id = 'ezblur';
    bl.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:2146999000;opacity:0;backdrop-filter:blur(5px);-webkit-backdrop-filter:blur(5px)';
    document.body.append(bl, d);
    const r = document.createElement('div'); r.id = 'ezrip';
    r.style.cssText = `position:fixed;width:${46 * K}px;height:${46 * K}px;margin:-${23 * K}px 0 0 -${23 * K}px;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px rgba(20,35,60,.35);pointer-events:none;z-index:2147483600;opacity:0;transform:scale(.4);transition:opacity .15s, transform .35s`;
    document.body.appendChild(r);
    // focus tween driven by requestAnimationFrame: hole position, dim, blur and border all move together
    const S = { l: 0, t: 0, w: 0, h: 0, r: 22, a: 0, dim: .5 }; let tg = null, aT = null, anim = false;
    const ez = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    const draw = () => {
      const W = innerWidth, H = innerHeight, r = Math.max(0, Math.min(S.r, S.w / 2, S.h / 2));
      d.style.left = S.l + 'px'; d.style.top = S.t + 'px'; d.style.width = S.w + 'px'; d.style.height = S.h + 'px'; d.style.borderRadius = r + 'px';
      d.style.borderColor = `rgba(255,255,255,${.97 * S.a})`;
      d.style.boxShadow = `0 0 0 2500px rgba(16,22,44,${S.dim * S.a}), 0 0 0 1.5px rgba(124,92,255,${.9 * S.a}), 0 0 26px 5px rgba(124,92,255,${.5 * S.a})`;
      bl.style.opacity = S.a;
      const { l, t, w, h } = S;
      bl.style.clipPath = `path(evenodd,"M0 0H${W}V${H}H0Z M${l + r} ${t}H${l + w - r}A${r} ${r} 0 0 1 ${l + w} ${t + r}V${t + h - r}A${r} ${r} 0 0 1 ${l + w - r} ${t + h}H${l + r}A${r} ${r} 0 0 1 ${l} ${t + h - r}V${t + r}A${r} ${r} 0 0 1 ${l + r} ${t}Z")`;
    };
    const loop = (now) => {
      let busy = false;
      if (tg) { const k = Math.min(1, (now - tg.t0) / 450), e = ez(k); for (const f of ['l', 't', 'w', 'h', 'r']) S[f] = tg.from[f] + (tg.to[f] - tg.from[f]) * e; S.dim = tg.to.dim; if (k < 1) busy = true; else tg = null; }
      if (aT) { const k = Math.min(1, (now - aT.t0) / aT.dur); S.a = aT.from + (aT.to - aT.from) * ez(k); if (k < 1) busy = true; else aT = null; }
      draw(); if (busy) requestAnimationFrame(loop); else anim = false;
    };
    const kick = () => { if (!anim) { anim = true; requestAnimationFrame(loop); } };
    window.__ezTo = (g) => { const now = performance.now(); if (S.a < .02) { Object.assign(S, g); tg = null; aT = { t0: now, from: S.a, to: 1, dur: 380 }; } else { tg = { t0: now, from: { l: S.l, t: S.t, w: S.w, h: S.h, r: S.r }, to: g }; aT = null; S.a = 1; } kick(); };
    window.__ezOff = () => { if (S.a < .02) return; aT = { t0: performance.now(), from: S.a, to: 0, dur: 300 }; kick(); };
    window.__ezOn = () => S.a > .02;
  }, K);
  if (pre) { await pre(p); await p.waitForTimeout(400); }   // a loop's own set-up before the first recorded frame (optional `pre` in the loop file)
  // Deterministic capture: Chrome only draws when we ask (HeadlessExperimental.beginFrame) and its clock is virtual, so every frame is exactly 1/60 s of page time
  // (CSS transitions, rAF tweens, timers and smooth scrolling all advance by that step), whatever the machine can keep up with. The old screencast dropped frames under load.
  const cdp = await ctx.newCDPSession(p); const frames = []; const FT = 1000 / 60; let rec = false, n = 0, stop = false;
  // virtual camera: eases (0.75 s, cubic) towards the spot being shown and back out to the full phone; applied to the frames afterwards as a crop, so it is exact on every frame
  const camPath = []; let cam = { z: 1, x: w / 2, y: h / 2 }, tw = null; const ez = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
  const camStep = () => { if (tw) { const k = Math.min(1, (n - tw.n0) / tw.d), e = ez(k); cam = { z: tw.a.z + (tw.b.z - tw.a.z) * e, x: tw.a.x + (tw.b.x - tw.a.x) * e, y: tw.a.y + (tw.b.y - tw.a.y) * e }; if (k >= 1) tw = null; } };
  let ticks = Number(process.hrtime.bigint() / 1000n) / 1000;
  const bf = async (shot) => cdp.send('HeadlessExperimental.beginFrame', { frameTimeTicks: ticks, interval: FT, ...(shot ? { screenshot: { format: 'jpeg', quality: 93 } } : {}) });
  for (let i = 0; i < 150 && !stop; i++) { ticks = Number(process.hrtime.bigint() / 1000n) / 1000; await bf(false); await new Promise(r => setTimeout(r, 16)); }   // warm-up in real time: the page loads and settles
  await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pause' });
  const hh = { b, ctx, p, dir, cdp, frames, ready: (Date.now() - t0) / 1000, n: () => n, rec: v => { rec = v; }, stop: () => { stop = true; } };
  hh.camTo = (b) => { const Z = +process.env.ZOOM || 1.22; const z = b ? Math.max(1, Math.min(Z, .9 * w / Math.max(b.w, 1), .9 * h / Math.max(b.h, 1))) : 1; const hw = w / z / 2, hh2 = h / z / 2; const to = b ? { z, x: Math.min(Math.max(b.x + b.w / 2, hw), w - hw), y: Math.min(Math.max(b.y + b.h / 2, hh2), h - hh2) } : { z: 1, x: w / 2, y: h / 2 }; tw = { a: { ...cam }, b: to, n0: n, d: 54 }; }; hh.camPath = camPath; hh.view = { w, h };
  hh.pump = (async () => { while (!stop) {
    const done = new Promise(r => cdp.once('Emulation.virtualTimeBudgetExpired', r));
    await cdp.send('Emulation.setVirtualTimePolicy', { policy: 'pauseIfNetworkFetchesPending', budget: FT }); await done;
    ticks += FT; const r = await bf(rec); n++; camStep();
    if (rec && r.screenshotData) { const f = `${dir}/fr/${String(frames.length).padStart(5, '0')}.jpg`; fs.mkdirSync(`${dir}/fr`, { recursive: true }); fs.writeFileSync(f, Buffer.from(r.screenshotData, 'base64')); frames.push(f); camPath.push({ ...cam }); }
  } })();
  const real = p.waitForTimeout.bind(p); p.waitForTimeout = (ms) => framesFor(hh, ms);   // every wait in a loop (and inside tap / spot) counts frames of page time, not real time
  globalThis.__h = hh;
  if (pre) { await pre(p); await p.waitForTimeout(400); }
  hh.rec(true);
  return hh;
}
const framesFor = (h, ms) => { const target = h.n() + Math.max(1, Math.round(ms / (1000 / 60))); return new Promise(res => { const t = setInterval(() => { if (h.n() >= target) { clearInterval(t); res(); } }, 4); }); };
export const wait = (p, ms) => p.waitForTimeout(ms * S);
let __spotN = 0;
export async function spot(p, target, pad = 10, radius = 22, dim = .5) {
  const res = await p.evaluate(({ target, pad, radius, dim, DYY, K }) => {
    let r;
    if (typeof target === 'string') { const els = [...document.querySelectorAll(target)].filter(e => e.getBoundingClientRect().width > 0); if (!els.length) return null; let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9; els.forEach(e => { const q = e.getBoundingClientRect(); x1 = Math.min(x1, q.left); y1 = Math.min(y1, q.top); x2 = Math.max(x2, q.right); y2 = Math.max(y2, q.bottom); }); r = { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }; }
    else r = { left: target[0] * K, top: (target[1] >= 720 ? target[1] + DYY : target[1]) * K, width: target[2] * K, height: target[3] * K };
    const orig = { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    const o = { l: r.left, t: r.top, r: r.left + r.width, b: r.top + r.height }; const CAP = 60 * K;
    let L = o.l, T = o.t, R = o.r, B = o.b; const what = [];
    for (let it = 0; it < 6; it++) {
      let ch = false;
      for (const e of document.body.querySelectorAll('*')) {
        if (e.id === 'ezspot' || e.id === 'ezrip' || e.closest('#ezspot')) continue;
        const q = e.getBoundingClientRect(); if (q.width < 6 || q.height < 6 || q.width > 330 * K || q.height > 90 * K) continue;
        const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none' || +cs.opacity < .2) continue;
        const ix = Math.min(q.right, R) - Math.max(q.left, L), iy = Math.min(q.bottom, B) - Math.max(q.top, T);
        if (ix <= 0 || iy <= 0) continue;
        const ratio = ix * iy / (q.width * q.height); if (ratio < .02 || ratio > .985) continue;
        let vis = 0; for (const [a, b] of [[.2,.2],[.5,.2],[.8,.2],[.2,.5],[.5,.5],[.8,.5],[.2,.8],[.5,.8],[.8,.8]]) { const hh = document.elementFromPoint(q.left + q.width * a, q.top + q.height * b); if (hh && (e.contains(hh) || hh.contains(e))) vis++; } if (vis < 7) continue;
        const hasBg = cs.backgroundColor !== 'rgba(0, 0, 0, 0)' || cs.backgroundImage !== 'none' || cs.borderTopWidth !== '0px';
        const hasTxt = [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        if (!(hasTxt || hasBg || ['svg', 'IMG', 'CANVAS'].includes(e.tagName))) continue;
        const nL = Math.min(L, q.left), nT = Math.min(T, q.top), nR = Math.max(R, q.right), nB = Math.max(B, q.bottom); if (o.l - nL > CAP || o.t - nT > CAP || nR - o.r > CAP || nB - o.b > CAP) continue;
        if (nL < L - .5 || nT < T - .5 || nR > R + .5 || nB > B + .5) { L = nL; T = nT; R = nR; B = nB; ch = true; what.push((e.textContent || e.tagName).trim().slice(0, 18)); }
      }
      if (!ch) break;
    }
    window.__ezTo({ l: L - pad, t: T - pad, w: (R - L) + 2 * pad, h: (B - T) + 2 * pad, r: radius, dim });
    return { orig, final: { x: Math.round(L), y: Math.round(T), w: Math.round(R - L), h: Math.round(B - T) }, what };
  }, { target, pad: pad * K, radius: radius * K, dim, DYY: DY, K });
  if (globalThis.__h && res) globalThis.__h.camTo(res.final);
  __spotN++;
  if (res && res.what.length) console.log(`[fit] ${globalThis.__loop} #${__spotN} ${JSON.stringify(res.orig)} -> ${JSON.stringify(res.final)} grew for: ${res.what.join(' | ')}`);
  if (process.env.AUDIT) { await p.waitForTimeout(900); fs.mkdirSync('/tmp/audit', { recursive: true }); await p.screenshot({ path: `/tmp/audit/${globalThis.__loop}_${String(__spotN).padStart(2, '0')}.png` }); }
}
export async function unspot(p) { await p.evaluate(() => window.__ezOff()); if (globalThis.__h) globalThis.__h.camTo(null); }
async function ripple(p, x, y) {
  await p.evaluate(({ x, y }) => { const r = document.getElementById('ezrip'); r.style.transition = 'none'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.opacity = '.9'; r.style.transform = 'scale(.4)'; void r.offsetWidth; r.style.transition = 'opacity .5s, transform .35s'; r.style.transform = 'scale(1)'; setTimeout(() => r.style.opacity = '0', 250); }, { x, y });
}
async function release(p) { await p.evaluate(() => window.__ezOff()); }
export async function tap(p, sel, opt = {}) {
  if (Array.isArray(sel)) { const ty = (sel[1] >= 720 ? sel[1] + DY : sel[1]) * K, tx = sel[0] * K; await ripple(p, tx, ty); await p.waitForTimeout(260 * S); await release(p); await p.touchscreen.tap(tx, ty); return; }
  const loc = typeof sel === 'string' ? p.locator(sel).filter({ visible: true }).nth(opt.nth || 0) : sel;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const bb = await loc.boundingBox(); if (!bb) throw new Error('no box ' + sel);
  const x = bb.x + bb.width * (opt.fx ?? .5), y = bb.y + bb.height * (opt.fy ?? .5);
  await ripple(p, x, y); await p.waitForTimeout(260 * S);
  await release(p); await p.touchscreen.tap(x, y);
}
export async function finish(h, base) {
  await h.p.waitForTimeout(400); h.rec(false); h.stop(); await h.pump.catch(() => {}); await h.ctx.close().catch(() => {}); await h.b.close().catch(() => {});
  const d = h.dir + '/fr', zd = h.dir + '/zf'; fs.rmSync(zd, { recursive: true, force: true }); fs.mkdirSync(zd, { recursive: true });
  fs.writeFileSync(h.dir + '/cam.json', JSON.stringify({ view: h.view, path: h.camPath }));
  // the camera: each frame is cropped to its zoom window and scaled to the 720x1558 output (Lanczos)
  fs.writeFileSync(h.dir + '/cam.py', `import json,sys\nfrom PIL import Image\nj=json.load(open('${h.dir}/cam.json'));W,H=j['view']['w'],j['view']['h']\nfor i,c in enumerate(j['path']):\n    im=Image.open('${d}/%05d.jpg'%i);sx=im.width/W;sy=im.height/H;cw,ch=W/c['z'],H/c['z'];x0=c['x']-cw/2;y0=c['y']-ch/2\n    im.resize((720,1558),Image.LANCZOS,box=(x0*sx,y0*sy,(x0+cw)*sx,(y0+ch)*sy)).save('${zd}/%05d.jpg'%i,quality=95)\n`);
  execSync(`python3 ${h.dir}/cam.py`, { stdio: 'inherit' });
  execSync(`ffmpeg -y -loglevel error -framerate 60 -i ${zd}/%05d.jpg -vf "format=yuv420p" -c:v libx264 -crf 18 -preset slow -r 60 -movflags +faststart -an ${base}.mp4`);
  execSync(`ffmpeg -y -loglevel error -ss 0.3 -i ${base}.mp4 -frames:v 1 -vf "scale=360:780:flags=lanczos" -c:v libwebp -quality 85 ${base}.webp`);
  return h.frames.length;
}
export async function scrollSheet(p, to, sel) {
  await p.evaluate(({ to, sel }) => {
    const els = sel ? [...document.querySelectorAll(sel)] : [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().height > 300 && e.getBoundingClientRect().width > 0);
    const e = els[els.length - 1]; if (e) e.scrollTo({ top: to, behavior: 'smooth' });
  }, { to, sel });
}
