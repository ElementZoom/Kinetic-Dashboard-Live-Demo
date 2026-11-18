export default { file: 'EZ_Loop_Module_Shading_Light_v9', hash: '#rooms/master', async run(p, c) {
  await c.wait(1500);
  const L = '.tl[data-e="cover.demo_master_curtain_left"]', R = '.tl[data-e="cover.demo_master_curtain_right"]';
  await c.tap('#roomspg .chips button:nth-of-type(2), #rv .chips button:nth-of-type(2)'); await c.wait(1600);
  await c.spot(L + ',' + R, 4, 24); await c.wait(2600);
  await c.tap(L + ' [data-a="close_cover"]'); await c.wait(900); await c.tap(R + ' [data-a="close_cover"]'); await c.wait(5200);
  await c.tap(L + ' [data-a="open_cover"]'); await c.wait(900); await c.tap(R + ' [data-a="open_cover"]'); await c.wait(5200);
  await c.unspot(); await c.wait(800);
} };
