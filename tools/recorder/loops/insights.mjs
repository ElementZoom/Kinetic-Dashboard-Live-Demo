const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Insights_Light_v9', hash: '#insights', async run(p, c) {
  await c.wait(1500);
  await c.spot('#insights .insnav', 4); await c.wait(2800);
  await p.waitForSelector('#insbody .itg', { timeout: 20000 }); await c.wait(1200);
  await tag(p, '#insbody .itg', 0, 'i0'); await tag(p, '#insbody .itg', 1, 'i1');
  await c.tap('[data-rec=i0] > *'); await c.wait(1400);
  await c.spot('#insd .idp', 0, 28); await c.wait(4200);
  await c.tap('#insd .idp button'); await c.wait(1200);
  await c.spot('[data-rec=i1]', 4); await c.wait(3200);
  await tag(p, '#insbody .insm > *', 0, 'm0');
  await c.spot('[data-rec=m0]', 4); await c.wait(1800);
  await c.tap('[data-rec=m0]'); await c.wait(1400);
  await p.evaluate(() => { const e = document.querySelector('#insights'); if (e) e.scrollTop = 400; window.scrollTo(0, 400); }); await c.wait(500);
  await c.spot('.insgp.open', 4); await c.wait(4000);
  await c.unspot(); await c.wait(1200);
} };
