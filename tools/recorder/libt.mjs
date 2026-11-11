import { chromium } from '/opt/npm-tools/node_modules/playwright/index.mjs';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
const S = process.env.SLOW ? +process.env.SLOW : 0.8; // pacing multiplier
export const W = 540, H = 1168; let DYT = 0;
export async function open(name, { zh = false, hash = '', dark = false, w = W, h = H, record = true, mobile = true, dsf = 2 } = {}) {
  const dir = `/tmp/rl-${name}${zh ? '-zh' : ''}`; fs.rmSync(dir, { recursive: true, force: true }); fs.mkdirSync(dir, { recursive: true });
  DYT = Math.max(w, h) > 1000 ? 0 : H - 960;
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: true, deviceScaleFactor: dsf });
  await ctx.addInitScript(() => { try { localStorage.dashPal = JSON.stringify({ mode: 'light' }); } catch (e) {} });
  const p = await ctx.newPage();
  const t0 = Date.now();
  await p.goto(`http://localhost:8765/app/dash.html${zh ? '?lang=zh' : ''}${hash}`);
  await p.waitForTimeout(2500);
  await p.evaluate(() => {
    const d = document.createElement('div'); d.id = 'ezspot'; d.dataset.off = '1';
    d.style.cssText = 'position:fixed;left:0;top:0;width:0;height:0;border-radius:22px;pointer-events:none;z-index:2147483000;box-shadow:0 0 0 0 rgba(16,22,44,0);transition:left .45s cubic-bezier(.4,0,.2,1),top .45s cubic-bezier(.4,0,.2,1),width .45s cubic-bezier(.4,0,.2,1),height .45s cubic-bezier(.4,0,.2,1),border-radius .45s,box-shadow .4s ease';
    document.body.appendChild(d);
    const r = document.createElement('div'); r.id = 'ezrip';
    r.style.cssText = 'position:fixed;width:46px;height:46px;margin:-23px 0 0 -23px;border-radius:50%;background:rgba(255,255,255,.85);box-shadow:0 0 0 2px rgba(20,35,60,.35);pointer-events:none;z-index:2147483600;opacity:0;transform:scale(.4);transition:opacity .15s, transform .35s';
    document.body.appendChild(r);
  });
  const frames = []; const cdp = await ctx.newCDPSession(p);
  cdp.on('Page.screencastFrame', async (ev) => { frames.push({ t: ev.metadata.timestamp, data: ev.data }); try { await cdp.send('Page.screencastFrameAck', { sessionId: ev.sessionId }); } catch (e) {} });
  await cdp.send('Page.startScreencast', { format: 'jpeg', quality: 95, maxWidth: w * dsf, maxHeight: h * dsf, everyNthFrame: 1 });
  return { b, ctx, p, dir, cdp, frames, w, h, ready: (Date.now() - t0) / 1000 };
}
export const wait = (p, ms) => p.waitForTimeout(ms * S);
let __spotN = 0;
export async function spot(p, target, pad = 10, radius = 22, dim = .58) {
  const res = await p.evaluate(({ target, pad, radius, dim, DYY }) => {
    let r;
    if (typeof target === 'string') { const els = [...document.querySelectorAll(target)].filter(e => e.getBoundingClientRect().width > 0); if (!els.length) return null; let x1 = 1e9, y1 = 1e9, x2 = -1e9, y2 = -1e9; els.forEach(e => { const q = e.getBoundingClientRect(); x1 = Math.min(x1, q.left); y1 = Math.min(y1, q.top); x2 = Math.max(x2, q.right); y2 = Math.max(y2, q.bottom); }); r = { left: x1, top: y1, width: x2 - x1, height: y2 - y1 }; }
    else r = { left: target[0], top: target[1] >= 720 ? target[1] + DYY : target[1], width: target[2], height: target[3] };
    const orig = { x: Math.round(r.left), y: Math.round(r.top), w: Math.round(r.width), h: Math.round(r.height) };
    const o = { l: r.left, t: r.top, r: r.left + r.width, b: r.top + r.height }; const CAP = 60;
    let L = o.l, T = o.t, R = o.r, B = o.b; const what = [];
    for (let it = 0; it < 6; it++) {
      let ch = false;
      for (const e of document.body.querySelectorAll('*')) {
        if (e.id === 'ezspot' || e.id === 'ezrip' || e.closest('#ezspot')) continue;
        const q = e.getBoundingClientRect(); if (q.width < 6 || q.height < 6 || q.width > 330 || q.height > 90) continue;
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
    const d = document.getElementById('ezspot'); const tr = 'left .45s cubic-bezier(.4,0,.2,1),top .45s cubic-bezier(.4,0,.2,1),width .45s cubic-bezier(.4,0,.2,1),height .45s cubic-bezier(.4,0,.2,1),border-radius .45s,box-shadow .4s ease';
    if (d.dataset.off === '1') { d.style.transition = 'box-shadow .4s ease'; }
    d.style.left = L - pad + 'px'; d.style.top = T - pad + 'px'; d.style.width = (R - L) + 2 * pad + 'px'; d.style.height = (B - T) + 2 * pad + 'px';
    d.style.borderRadius = radius + 'px'; if (d.dataset.off === '1') { void d.offsetWidth; } d.style.boxShadow = `0 0 0 2000px rgba(16,22,44,${dim})`; if (d.dataset.off === '1') { d.dataset.off = '0'; setTimeout(() => { d.style.transition = tr; }, 450); }
    return { orig, final: { x: Math.round(L), y: Math.round(T), w: Math.round(R - L), h: Math.round(B - T) }, what };
  }, { target, pad, radius, dim, DYY: DYT });
  __spotN++;
  if (res && res.what.length) console.log(`[fit] ${globalThis.__loop} #${__spotN} ${JSON.stringify(res.orig)} -> ${JSON.stringify(res.final)} grew for: ${res.what.join(' | ')}`);
  if (process.env.AUDIT) { await p.waitForTimeout(900); fs.mkdirSync('/tmp/audit', { recursive: true }); await p.screenshot({ path: `/tmp/audit/${globalThis.__loop}_${String(__spotN).padStart(2, '0')}.png` }); }
}
export async function unspot(p) { await p.evaluate(() => { const d = document.getElementById('ezspot'); d.style.transition = 'box-shadow .3s ease'; d.style.boxShadow = '0 0 0 0 rgba(16,22,44,0)'; d.dataset.off = '1'; }); }
async function ripple(p, x, y) {
  await p.evaluate(({ x, y }) => { const r = document.getElementById('ezrip'); r.style.transition = 'none'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.opacity = '.9'; r.style.transform = 'scale(.4)'; void r.offsetWidth; r.style.transition = 'opacity .5s, transform .35s'; r.style.transform = 'scale(1)'; setTimeout(() => r.style.opacity = '0', 250); }, { x, y });
}
async function release(p) { await p.evaluate(() => { const d = document.getElementById('ezspot'); if (!d || d.dataset.off === '1') return; d.style.transition = 'box-shadow .25s ease'; d.style.boxShadow = '0 0 0 0 rgba(16,22,44,0)'; d.dataset.off = '1'; }); }
export async function tap(p, sel, opt = {}) {
  if (Array.isArray(sel)) { const ty = sel[1] >= 720 ? sel[1] + DYT : sel[1]; await ripple(p, sel[0], ty); await p.waitForTimeout(260 * S); await release(p); await p.touchscreen.tap(sel[0], ty); return; }
  const loc = typeof sel === 'string' ? p.locator(sel).filter({ visible: true }).nth(opt.nth || 0) : sel;
  await loc.scrollIntoViewIfNeeded().catch(() => {});
  const bb = await loc.boundingBox(); if (!bb) throw new Error('no box ' + sel);
  const x = bb.x + bb.width * (opt.fx ?? .5), y = bb.y + bb.height * (opt.fy ?? .5);
  await ripple(p, x, y); await p.waitForTimeout(260 * S);
  await release(p); await p.touchscreen.tap(x, y);
}
export async function finish(h, base) {
  const land = h.w > h.h, tab = Math.max(h.w, h.h) > 1000;
  h.mw = tab ? h.w : 720; h.mh = tab ? h.h : 1558; h.ww = tab ? Math.round(h.w * .75) : 540; h.wh = tab ? Math.round(h.h * .75) : 1168;
  await new Promise(r => setTimeout(r, 400));
  await h.cdp.send('Page.stopScreencast').catch(() => {});
  const fr = h.frames; const end = Date.now() / 1000;
  await h.ctx.close(); await h.b.close();
  const d = h.dir + '/fr'; fs.mkdirSync(d, { recursive: true });
  let list = '';
  fr.forEach((f, i) => { const n = `${d}/${String(i).padStart(5, '0')}.jpg`; fs.writeFileSync(n, Buffer.from(f.data, 'base64')); const dur = i < fr.length - 1 ? Math.max(fr[i + 1].t - f.t, 0.008) : 0.6; list += `file '${n}'\nduration ${dur.toFixed(4)}\n`; });
  list += `file '${d}/${String(fr.length - 1).padStart(5, '0')}.jpg'\n`;
  fs.writeFileSync(h.dir + '/list.txt', list);
  execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i ${h.dir}/list.txt -vf "fps=30,scale=${h.mw}:${h.mh}:flags=lanczos,format=yuv420p" -c:v libx264 -crf 20 -preset slow -movflags +faststart -an ${base}.mp4`);
  execSync(`ffmpeg -y -loglevel error -f concat -safe 0 -i ${h.dir}/list.txt -vf "fps=15,scale=${h.ww}:${h.wh}:flags=lanczos" -c:v libwebp_anim -quality 82 -compression_level 5 -loop 0 ${base}.webp`);
  return fr.length;
}
export async function scrollSheet(p, to, sel) {
  await p.evaluate(({ to, sel }) => {
    const els = sel ? [...document.querySelectorAll(sel)] : [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 20 && /auto|scroll/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().height > 300 && e.getBoundingClientRect().width > 0);
    const e = els[els.length - 1]; if (e) e.scrollTo({ top: to, behavior: 'smooth' });
  }, { to, sel });
}
