export default { file: 'EZ_Loop_Tablet_Landscape_v3', hash: '#home', size: { w: 1280, h: 800, mobile: false, dsf: 1 }, async run(p, c) {
  await c.wait(1500);
  await c.spot([198, 14, 1053, 68], 6, 22); await c.wait(2600);
  await p.evaluate(() => window.DEMO.garage(true)); await c.wait(2600);
  await c.spot('#nacc', 8, 22); await c.wait(2600);
  await c.spot([198, 223, 680, 389], 4, 22); await c.wait(3200);
  await c.spot([893, 223, 358, 206], 4, 22); await c.wait(1200);
  await c.tap([1010, 392]); await c.wait(1800);
  await c.tap([948, 392]); await c.wait(1800);
  await c.spot([893, 445, 358, 167], 4, 22); await c.wait(2800);
  await c.spot([198, 627, 1053, 141], 4, 22); await c.wait(3200);
  await c.spot([14, 14, 170, 772], 4, 26); await c.wait(2800);
  await c.unspot(); await c.wait(1200);
} };
