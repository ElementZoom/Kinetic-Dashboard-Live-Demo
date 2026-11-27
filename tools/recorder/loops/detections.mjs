const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
const show = (p, n) => p.evaluate((n) => { const e = document.querySelector('[data-rec=' + n + ']'); if (e) e.scrollIntoView({ block: 'center' }); }, n).then(() => p.waitForTimeout(500));
export default { file: 'EZ_Loop_Detections_Light_v14', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.tap('#stabs button:nth-of-type(2)'); await c.wait(1800);
  await c.spot('#stabs, #dtp .dthd', 4, 20); await c.wait(3200);
  await tag(p, '#dtp .dthr', 0, 'g0'); await show(p, 'g0');
  await c.spot('[data-rec=g0]', 4, 24); await c.wait(3600);
  await c.tap('[data-rec=g0] .dtr:not(.dtst)'); await c.wait(1800);
  await c.unspot(); await c.wait(5000);
  await c.tap([508, 30]); await c.wait(1800);
  await c.spot('[data-rec=g0]', 4, 24); await c.wait(1500);
  await tag(p, '#dtp .dthr', 1, 'g1'); await show(p, 'g1');
  await c.spot('[data-rec=g1]', 4, 24); await c.wait(1500);
  await c.tap('[data-rec=g1] .dtr'); await c.wait(1800);
  await c.unspot(); await c.wait(4800);
  await c.tap([508, 30]); await c.wait(1500);
  await c.unspot(); await c.wait(1200);
} };
