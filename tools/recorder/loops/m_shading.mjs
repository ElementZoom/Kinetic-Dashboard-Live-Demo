export default { file: 'EZ_Loop_Module_Shading_Light_v4', hash: '#rooms/master', async run(p, c) {
  await c.wait(1500);
  await c.spot([10, 364, 520, 224], 4, 24); await c.wait(2600);
  await c.tap([218, 510]); await c.wait(900); await c.tap([463, 510]); await c.wait(5200);
  await c.tap([76, 510]); await c.wait(900); await c.tap([321, 510]); await c.wait(5200);
  await c.unspot(); await c.wait(800);
} };
