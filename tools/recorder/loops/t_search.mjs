export default { file: 'EZ_Loop_Tablet_Search_v2', hash: '#home', size: { w: 1280, h: 800, mobile: false, dsf: 1 }, async run(p, c) {
  await c.wait(1500);
  await c.spot('#hsrch', 8, 20); await c.wait(1800);
  await c.tap('#hsrch'); await c.wait(1600);
  await c.spot('.srb', 4, 26); await c.wait(1400);
  await c.tap('.srb'); await c.wait(600);
  await p.keyboard.type('garage', { delay: 300 }); await c.wait(500);
  await c.spot('.srfs,#srl', 0, 18); await c.wait(3800);
  await c.spot('.srb', 4, 26);
  await p.keyboard.press('Control+a'); await p.keyboard.type(c.zh ? '天气' : 'rain', { delay: 300 }); await c.wait(600);
  await c.spot('.srfs,#srl', 0, 18); await c.wait(3600);
  await c.unspot(); await c.wait(1000);
} };
