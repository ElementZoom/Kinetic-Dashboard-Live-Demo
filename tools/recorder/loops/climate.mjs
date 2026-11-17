export default { file: 'EZ_Loop_Climate_Light_v10', hash: '#climate', async run(p, c) {
  await c.wait(1500);
  await c.spot('#climate .card.main2', 4, 22); await c.wait(2400);
  await c.spot('#climate .card.main2 .chips', 4, 20); await c.wait(1400);
  for (const m of ['cool', 'dry', 'fan_only', 'heat_cool', 'heat']) { await c.tap('#climate .card.main2 .chips [data-m="' + m + '"]'); await c.wait(2200); }
  await c.spot('#climate .card.rm:nth-of-type(1)', 4, 22); await c.wait(1800);
  await c.tap('#climate .card.rm .rnd[data-d="1"]'); await c.wait(1500); await c.tap('#climate .card.rm .rnd[data-d="1"]'); await c.wait(2200);
  await c.spot('#climate .card.rm', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(1000);
} };
