const go = (p, h) => p.evaluate((h) => { location.hash = h; }, h);
const centre = (p) => p.evaluate(() => { const s = document.querySelector('.stg'); s && s.scrollIntoView({ block: 'center' }); });
export default { file: 'EZ_Loop_Looks_Light_v10', hash: '#home', async run(p, c) {
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
  // every look also comes in light: Settings > Mode, switch to Light, look at Home, and back to Dark
  const mode = () => p.evaluate(() => { const c = [...document.querySelectorAll('#theme .secnav .chip')].find((x, i) => i === 2); c && c.click(); });
  await go(p, '#theme'); await c.wait(1300); await mode(); await c.wait(700);
  await c.spot('.seg:has(button[data-mode="light"])', 6, 22); await c.wait(1500);
  await c.tap('button[data-mode="light"]'); await c.wait(1800); await c.unspot(); await c.wait(900);
  await go(p, '#home'); await c.wait(3000);
  await go(p, '#theme'); await c.wait(1300); await mode(); await c.wait(500);
  await c.tap('button[data-mode="dark"]'); await c.wait(1800);
  await go(p, '#home'); await c.wait(1800);
} };
