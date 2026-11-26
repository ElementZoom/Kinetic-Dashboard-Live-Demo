const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_OneLook_Light_v10', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await c.spot('#hc', 6, 24); await c.wait(2000);
  await c.tap('#nacc'); await c.wait(1600);
  await c.spot('#np .nptabs', 6, 18); await c.wait(1600);
  await c.tap('#np .nptabs button:nth-child(2)'); await c.wait(1400);
  await c.spot('#npc', 4, 18); await c.wait(3800);
  await c.scroll(300); await c.wait(3800);
  await c.scroll(700); await c.wait(3600);
  await c.unspot(); await c.wait(1200);
} };
