export default { file: 'EZ_Loop_Module_Irrigation_Light_v4', hash: '#irrigation', async run(p, c) {
  await p.evaluate(() => window.DEMO.dryGarden());
  await c.wait(1800);
  await c.spot([10, 62, 520, 110], 4, 22); await c.wait(3000);
  await c.spot([6, 180, 528, 540], 4, 22); await c.wait(4200);
  await p.screenshot({ path: '/tmp/ir1.png' });
  await c.unspot(); await c.wait(1000);
} };
