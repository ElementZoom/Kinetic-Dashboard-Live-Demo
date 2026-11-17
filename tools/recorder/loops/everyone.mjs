export default { file: 'EZ_Loop_Everyone_Light_v9', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await c.tap('#bmore'); await c.wait(1600);
  await c.spot('#mshe', 0, 26); await c.wait(3600);
  await c.spot('#navset2', 2, 14); await c.wait(1400);
  await c.tap('#navset2'); await c.wait(1800);
  await c.spot('#theme .setchips', 4, 18); await c.wait(2400);
  await c.tap('#theme .setchips button:nth-child(2)'); await c.wait(1800);
  await c.spot('.page.on .pn, .page.on .card', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(1000);
} };
