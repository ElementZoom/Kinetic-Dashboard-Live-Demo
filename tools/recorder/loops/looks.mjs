const go = (p, h) => p.evaluate((h) => { location.hash = h; }, h);
const centre = (p) => p.evaluate(() => { const s = document.querySelector('.stg'); s && s.scrollIntoView({ block: 'center' }); });
export default { file: 'EZ_Loop_Looks_Light_v2', hash: '#home', async run(p, c) {
  await c.wait(2000);
  await go(p, '#theme'); await c.wait(1500); await centre(p); await c.wait(600);
  await c.spot('.stg', 6, 22); await c.wait(1800);
  await c.tap('button[data-style="glass"]'); await c.unspot(); await c.wait(2000);
  await go(p, '#home'); await c.wait(2800);
  await go(p, '#theme'); await c.wait(1300); await centre(p); await c.wait(500);
  await c.tap('button[data-style="material"]'); await c.wait(2000);
  await go(p, '#home'); await c.wait(2800);
  await go(p, '#theme'); await c.wait(1300); await centre(p); await c.wait(500);
  await c.tap('button[data-style="default"]'); await c.wait(1600);
  await go(p, '#home'); await c.wait(1800);
} };
