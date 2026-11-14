export default { file: 'EZ_Loop_KitchenDisplay_Light_v6', hash: '#home', async run(p, c) {
  await c.wait(1500);
  await c.spot([10, 60, 520, 115]); await c.wait(3200);
  await c.spot([10, 185, 520, 160]); await c.wait(3200);
  await c.spot([10, 380, 520, 190]); await c.wait(1600);
  await c.tap('#home [data-d="1"], #home .rnd', {}); await c.wait(2200);
  await c.spot([10, 600, 520, 265]); await c.wait(3200);
  await c.unspot(); await c.wait(1500);
} };
