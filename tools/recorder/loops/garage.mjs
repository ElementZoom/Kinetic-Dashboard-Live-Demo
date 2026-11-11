export default { file: 'EZ_Loop_Garage_Light_v4', hash: '#home', async run(p, c) {
  await p.evaluate(() => window.DEMO.garage(true)); await c.wait(4500);
  await c.spot([20, 128, 190, 40], 6, 14); await c.wait(1800);
  await c.tap([428, 917]); await c.wait(2200);
  await c.spot([10, 422, 520, 270], 4, 22); await c.wait(2400);
  await c.tap([270, 560]); await c.wait(2200);
  await c.wait(1500);
  await c.spot([4, 410, 532, 290], 0, 24); await c.wait(3000);
  await c.spot([200, 878, 140, 48], 4, 24); await c.wait(1400);
  await c.tap([270, 904]); await c.wait(1600);
  await c.spot([14, 770, 390, 72], 4, 20); await c.wait(2200);
  await c.tap([110, 806]); await c.wait(1400);
  await c.tap([110, 806]); await c.wait(1000);
  await c.spot([4, 410, 532, 290], 0, 24); await c.wait(6500);
  await c.unspot(); await c.wait(1000);
} };
