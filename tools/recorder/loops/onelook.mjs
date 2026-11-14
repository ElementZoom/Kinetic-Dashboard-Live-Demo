export default { file: 'EZ_Loop_OneLook_Light_v5', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await c.spot([360, 14, 114, 50], 6, 24); await c.wait(2000);
  await c.tap([430, 38]); await c.wait(1600);
  await c.spot([155, 89, 98, 44], 6, 18); await c.wait(1600);
  await c.tap([205, 111]); await c.wait(1400);
  await c.spot([15, 120, 510, 330], 4, 18); await c.wait(3800);
  await c.spot([15, 120, 510, 760], 4, 18); await c.scroll(300); await c.wait(3800);
  await c.scroll(700); await c.wait(3600);
  await c.unspot(); await c.wait(1200);
} };
