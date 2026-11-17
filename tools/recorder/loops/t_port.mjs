const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Tablet_Portrait_v5', hash: '#security', size: { w: 800, h: 1280, mobile: false, dsf: 1 }, async run(p, c) {
  await c.wait(1500);
  await c.spot('#alp, #sectog', 4, 22); await c.wait(3000);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await tag(p, '#scams .cam', 0, 'pc');
  await c.spot('#scams', 4, 22); await c.wait(3400);
  await c.tap('[data-rec=pc]'); await c.wait(2200);
  await c.unspot(); await c.wait(3500);
  await c.tap([748, 82]); await c.wait(1500);
} };
