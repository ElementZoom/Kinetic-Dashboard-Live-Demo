import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const S = process.env.SLOW ? +process.env.SLOW : 0.8; // pacing multiplier
// The phone is the S26 Ultra: 412 CSS px wide (what the real phone reports), 19.5:9. Loops are still written in the old 540-wide coordinates (x, y, w, h and the +208 bottom anchor);
// K converts them. PHONE_W=540 records the old, too-small layout. The mp4 is always 720x1558 and frames are captured at up to 2x.
export const W = +process.env.PHONE_W || 412, K = W / 540, H = Math.round(1168 * K), DY = 208, DPR = Math.min(2, 1080 / W);
export async function open(name, { zh = false, hash = '', dark = false, w = W, h = H, record = true } = {}) {
  const dir = `/tmp/rl-${name}${zh ? '-zh' : ''}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: true, hasTouch: true, deviceScaleFactor: DPR });
  await ctx.addInitScript(() => { try { localStorage.dashPal = JSON.stringify({ mode: 'light' }); } catch (e) {} });
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
  const frames = []; const cdp = await ctx.newCDPSession(p);
  cdp.on('Page.screencastFrame', async (ev) => { frames.push({ t: ev.metadata.timestamp, data: ev.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: Math.round(w * DPR), maxHeight: Math.round(h * DPR), everyNthFrame: 1 });
  return { b, ctx, p, dir, cdp, frames, ready: (Date.now() - t0) / 1000 };
}
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
  __spotN++;
  if (res && res.what.length) console.log(`[fit] ${globalThis.__loop} #${__spotN} ${JSON.stringify(res.orig)} -> ${JSON.stringify(res.final)} grew for: ${res.what.join(' | ')}`);
  if (process.env.AUDIT) { await p.waitForTimeout(900); fs.mkdirSync('/tmp/audit', { recursive: true }); await p.screenshot({ path: `/tmp/audit/${globalThis.__loop}_${String(__spotN).padStart(2, '0')}.png` }); }
}
export async function unspot(p) { await p.evaluate(() => window.__ezOff()); }
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
  await new Promise(r => setTimeout(r, 400));
  await h.cdp.send('Page.stopScreencast').catch(() => {});
  const fr = h.frames; const end = Date.now() / 1000;
  await h.ctx.close(); await h.b.close();
  const d = h.dir + '/fr'; fs.mkdirSync(d, { recursive: true });
  let list = '';
  fr.forEach((f, i) => { const n = `${d}/${String(i).padStart(5, '0')}.jpg`; fs.writeFileSync(n, Buffer.from(f.data, 'base64')); const dur = i < fr.length - 1 ? Math.max(fr[i + 1].t - f.t, 0.008) : 0.6; list += `file '${n}'\nduration ${dur.toFixed(4)}\n`; });
  list += `file '${d}/${String(fr.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(h.dir + '/list.txt', list);
  execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i ${h.dir}/list.txt -vf "fps=60,scale=720:1558:flags=lanczos,format=yuv420p" -c:v libx264 -crf 19 -preset slow -r 60 -movflags +faststart -an ${base}.mp4`);
  execSync(`ffmpeg -y -loglevel error -ss 0.3 -i ${base}.mp4 -frames:v 1 -vf "scale=360:780:flags=lanczos" -c:v libwebp -quality 85 ${base}.webp`);
  return fr.length;
}
export async function scrollSheet(p, to, sel) {
  await p.evaluate(({ to, sel }) => {
    const els = sel ? [...document.querySelectorAll(sel)] : [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().height > 300 && e.getBoundingClientRect().width > 0);
    const e = els[els.length - 1]; if (e) e.scrollTo({ top: to, behavior: 'smooth' });
  }, { to, sel });
}
