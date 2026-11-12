export default { file: 'EZ_Loop_Everyone_Light_v5', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await c.tap([500, 917]); await c.wait(1600);
  await c.spot([10, 433, 520, 435], 0, 26); await c.wait(3600);
  await c.spot([22, 812, 496, 44], 2, 14); await c.wait(1400);
  await c.tap([270, 833]); await c.wait(1800);
  await c.spot([10, 74, 505, 42], 4, 18); await c.wait(2400);
  await c.tap([150, 95]); await c.wait(1800);
  await c.spot([10, 130, 520, 500], 0, 22); await c.wait(3200);
  await c.unspot(); await c.wait(1000);
} };
