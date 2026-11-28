const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Module_Security_Light_v12', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.spot('#alp', 4, 24); await c.wait(3200);
  await c.spot('#sectog', 4, 20); await c.wait(2600);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await tag(p, '#scams .cam', 0, 'pc');
  await c.spot('[data-rec=pc]', 4, 24); await c.wait(4000);
  await c.unspot(); await c.wait(1000);
} };
