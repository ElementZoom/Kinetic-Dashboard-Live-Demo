export default { file: 'EZ_Loop_Detections_Light_v8', hash: '#security', async run(p, c) {
  await c.wait(1500);
  await c.tap([140, 95]); await c.wait(1800);
  await c.spot([20, 195, 500, 175], 4, 20); await c.wait(3200);
  await c.tap([166, 225]); await c.wait(1800);
  await c.spot([20, 365, 500, 430], 4, 24); await c.wait(3600);
  await c.tap([270, 525]); await c.wait(1800);
  await c.unspot(); await c.wait(5000);
  await c.tap([508, 30]); await c.wait(1800);
  await c.spot([20, 365, 500, 430], 4, 24); await c.wait(1500);
  await c.tap([247, 712]); await c.wait(1800);
  await c.tap([270, 525]); await c.wait(1800);
  await c.unspot(); await c.wait(4800);
  await c.tap([508, 30]); await c.wait(1500);
  await c.unspot(); await c.wait(1200);
} };
