export default { file: 'EZ_Loop_Tablet_Portrait_v3', hash: '#security', size: { w: 800, h: 1280, mobile: false, dsf: 1 }, async run(p, c) {
  await c.wait(1500);
  await c.spot([198, 166, 574, 152], 4, 22); await c.wait(3000);
  await p.evaluate(() => window.DEMO.person(true)); await c.wait(1200);
  await c.spot([198, 326, 574, 512], 4, 22); await c.wait(3400);
  await c.tap([330, 410]); await c.wait(2200);
  await c.unspot(); await c.wait(3500);
  await c.tap([748, 82]); await c.wait(1500);
} };
