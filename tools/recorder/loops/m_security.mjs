export default { file: 'EZ_Loop_Module_Security_Light_v5', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.spot([10, 134, 520, 196], 4, 24); await c.wait(3200);
  await c.spot([10, 345, 520, 62], 4, 20); await c.wait(2600);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await c.spot([10, 421, 520, 293], 4, 24); await c.wait(4000);
  await c.unspot(); await c.wait(1000);
} };
