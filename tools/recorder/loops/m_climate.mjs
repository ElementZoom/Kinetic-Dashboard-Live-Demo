export default { file: 'EZ_Loop_Module_Climate_Light_v6', hash: '#climate', async run(p, c) {
  await c.wait(1500);
  await c.spot([24, 170, 490, 42], 4, 20); await c.wait(1400);
  for (const x of [230, 309, 388, 468, 150]) { await c.tap([x, 190]); await c.wait(2000); }
  await c.spot([10, 318, 520, 400], 4, 22); await c.wait(2800);
  await c.unspot(); await c.wait(800);
} };
