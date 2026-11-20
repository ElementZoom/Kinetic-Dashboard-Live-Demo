const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Tablet_Landscape_v7', hash: '#home', size: { w: 1280, h: 800, mobile: false, dsf: 1 }, async run(p, c) {
  await c.wait(1500);
  await p.evaluate(() => { const f = (re, q) => [...document.querySelectorAll(q)].find(e => re.test(e.textContent) && e.getBoundingClientRect().height < 300 && e.getBoundingClientRect().width > 250); const hp = f(/heat pump|热泵/i, '#home .card, #home .pn, #home .hcl, #home .hm > *'); if (hp) hp.dataset.rec = 'hp'; const fc = f(/forecast|预报/i, '#home .card, #home .pn, #home .hm > *'); if (fc && fc !== hp) fc.dataset.rec = 'fc'; });
  await c.spot('.main > header', 6, 22); await c.wait(2600);
  await p.evaluate(() => window.DEMO.garage(true)); await c.wait(2600);
  await c.spot('#nacc', 8, 22); await c.wait(2600);
  await c.spot('#home .cam', 4, 22); await c.wait(3200);
  await c.spot('[data-rec=hp]', 4, 22); await c.wait(1200);
  await c.tap('[data-rec=hp] [data-d="1"]'); await c.wait(1800);
  await c.tap('[data-rec=hp] [data-d="-1"]'); await c.wait(1800);
  await c.spot('[data-rec=fc]', 4, 22); await c.wait(2800);
  await c.spot('#home .rc', 4, 22); await c.wait(3200);
  await c.spot('nav', 4, 26); await c.wait(2800);
  await c.unspot(); await c.wait(1200);
} };
