export default { file: 'EZ_Loop_Garage_Light_v6', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await p.evaluate(() => window.DEMO.garage(true)); await c.wait(3500);
  await c.spot('.main > header', 6, 22); await c.wait(2400);
  await c.unspot(); await c.wait(500);
  await c.tap('a[href="#security"]'); await c.wait(2000);
  await p.evaluate(() => { const e = [...document.querySelectorAll('.cam')].find(x => x.getBoundingClientRect().width > 0 && /garage|车库/i.test(x.textContent)); if (e) e.dataset.rec = 'gar'; });
  await c.spot('[data-rec=gar]', 3, 24); await c.wait(2800);
  await c.tap('[data-rec=gar]'); await c.wait(2200);
  await c.spot('[data-rec=gar]', 0, 24); await c.wait(2800);
  await c.spot('.ctb', 6, 26); await c.wait(1600);
  await c.tap('.ctb'); await c.wait(1600);
  await c.spot('[data-e="switch.demo_garage_opener"]', 5, 22); await c.wait(2200);
  await c.tap('[data-e="switch.demo_garage_opener"]'); await c.wait(1400);
  await c.tap('[data-e="switch.demo_garage_opener"]'); await c.wait(1200);
  await c.spot('[data-rec=gar]', 0, 24); await c.wait(5000);
  await c.unspot(); await c.wait(900);
} };
