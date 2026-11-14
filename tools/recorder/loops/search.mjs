export default { file: 'EZ_Loop_Search_Light_v5', hash: '#home', async run(p, c) {
  await c.wait(1200);
  await c.spot([492, 8, 40, 40], 6, 20); await c.wait(2000);
  await c.tap([503, 32]); await c.wait(1500);
  await c.spot('.srb', 4, 26); await c.wait(1400);
  await c.tap('.srb'); await c.wait(600);
  await p.keyboard.type('garage', { delay: 300 }); await c.wait(500);
  await c.spot('.srfs,#srl', 0, 18); await c.wait(3800);
  await c.spot('.srb', 4, 26);
  await p.keyboard.press('Control+a'); await p.keyboard.type(c.zh ? '天气' : 'rain', { delay: 300 }); await c.wait(600);
  await c.spot('.srfs,#srl', 0, 18); await c.wait(3600);
  await c.unspot(); await c.wait(1000);
} };
