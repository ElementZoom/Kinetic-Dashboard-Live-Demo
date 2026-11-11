export default { file: 'EZ_Loop_Person_Light_v3', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.spot([10, 345, 520, 62], 4, 20); await c.wait(2600);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await c.spot([10, 421, 520, 293], 4, 24); await c.wait(3800);
  await c.tap([270, 570]); await c.wait(1800);
  await c.spot([4, 280, 532, 420], 0, 24); await c.wait(4000);
  await c.tap([506, 66]); await c.wait(1500);
  await c.unspot(); await c.wait(1200);
} };
