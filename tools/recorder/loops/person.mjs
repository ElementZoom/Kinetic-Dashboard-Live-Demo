const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Person_Light_v8', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.spot('#sectog', 4, 20); await c.wait(2600);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await tag(p, '#scams .cam', 0, 'pc');
  await c.spot('[data-rec=pc]', 4, 24); await c.wait(3800);
  await c.tap('[data-rec=pc]'); await c.wait(1800);
  await c.spot('[data-rec=pc]', 0, 10); await c.wait(4000);
  await c.tap([506, 66]); await c.wait(1500);
  await c.unspot(); await c.wait(1200);
} };
