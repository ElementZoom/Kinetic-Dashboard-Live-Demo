export default { file: 'EZ_Loop_Garage_Light_v11', hash: '#home',
  // before the first frame: the header chip shows only the garage-open indicator in this loop (no weather warning / "+N" next to it, no "3 new" pill before the door opens)
  async pre(p) { await p.evaluate(() => { const g = NSK.find(k => k[0] === 'garage'); NSK.length = 0; NSK.push(g); drawNotif(); const st = document.createElement('style'); st.textContent = '#nacc:not([data-k]){display:none!important}'; document.head.append(st); }); },
  async run(p, c) {
  await c.wait(600);
  await p.evaluate(() => window.DEMO.garage(true)); await c.wait(900);
  await c.spot('.main > header', 6, 22); await c.wait(3000);
  await c.unspot(); await c.wait(500);
  await c.tap('a[href="#security"]'); await c.wait(2000);
  await p.evaluate(() => { const e = [...document.querySelectorAll('.cam')].find(x => x.getBoundingClientRect().width > 0 && /garage|车库/i.test(x.textContent)); if (e) e.dataset.rec = 'gar'; });
  await c.spot('[data-rec=gar]', 3, 24); await c.wait(2800);
  await c.tap('[data-rec=gar]'); await c.wait(2200);
  await c.spot('[data-rec=gar]', 0, 24); await c.wait(2800);
  await c.spot('.ctb', 6, 26); await c.wait(1600);
  await c.tap('.ctb'); await c.wait(1600);
  await c.spot('[data-e="switch.demo_garage_opener"]', 5, 22); await c.wait(2200);
  await c.tap('[data-e="switch.demo_garage_opener"]'); await c.wait(1900);
  await c.tap('[data-e="switch.demo_garage_opener"]'); await c.wait(1200);
  await c.spot('[data-rec=gar]', 0, 24); await c.wait(5000);
  await c.unspot(); await c.wait(900);
} };
