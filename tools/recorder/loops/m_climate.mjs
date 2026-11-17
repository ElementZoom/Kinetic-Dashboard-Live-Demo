export default { file: 'EZ_Loop_Module_Climate_Light_v10', hash: '#climate', async run(p, c) {
  await c.wait(1500);
  await c.spot('#climate .card.main2 .chips', 4, 20); await c.wait(1400);
  for (const m of ['cool', 'dry', 'fan_only', 'heat_cool', 'heat']) { await c.tap('#climate .card.main2 .chips [data-m="' + m + '"]'); await c.wait(2000); }
  await c.spot('#climate .card.rm', 4, 22); await c.wait(2800);
  await c.unspot(); await c.wait(800);
} };
