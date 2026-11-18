const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_KitchenDisplay_Light_v9', hash: '#home', async run(p, c) {
  await c.wait(1500);
  await p.evaluate(() => { const hp = [...document.querySelectorAll('#home .card, #home .pn, #home .hcl')].find(e => /heat pump|热泵/i.test(e.textContent) && e.getBoundingClientRect().height < 260); if (hp) hp.dataset.rec = 'hp'; });
  await c.spot('#home .hs', 6, 22); await c.wait(3200);
  await c.spot('[data-rec=hp]', 4, 22); await c.wait(3200);
  await c.tap('[data-rec=hp] [data-d="1"]'); await c.wait(2200);
  await p.evaluate(() => { const r = [...document.querySelectorAll('#home .rc')].slice(0, 3); r.forEach(e => e.dataset.rec = 'rm'); });
  await c.spot('[data-rec=rm]', 4, 22); await c.wait(3200);
  await c.spot('#btab', 6, 26); await c.wait(3000);
  await c.unspot(); await c.wait(1500);
} };
