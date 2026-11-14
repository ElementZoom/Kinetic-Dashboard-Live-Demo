export default { file: 'EZ_Loop_Insights_Light_v7', hash: '#insights', async run(p, c) {
  await c.wait(1500);
  await c.spot([10, 150, 262, 120], 4); await c.wait(2800);
  await c.tap([140, 210]); await c.wait(1400);
  await c.spot([0, 730, 540, 230], 0, 28); await c.wait(4200);
  await c.tap([503, 772]); await c.wait(1200);
  await c.spot([10, 290, 520, 205], 4); await c.wait(3200);
  await c.spot([10, 652, 520, 90], 4); await c.wait(1800);
  await c.tap([275, 705]); await c.wait(1400);
  await p.evaluate(() => window.scrollTo(0, 400)); await c.wait(500);
  await c.spot('.insgp.open', 4); await c.wait(4000);
  await c.unspot(); await c.wait(1200);
} };
