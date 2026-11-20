export default { file: 'EZ_Loop_Module_Vehicle_Light_v4', hash: '#vehicle', async run(p, c) {
  await c.wait(1500);
  await c.spot('#vehicle .vgrid > .pn:nth-child(1)', 4, 22); await c.wait(2600);
  await c.unspot(); await c.wait(300);
  await c.scroll(330, '#vehicle'); await c.wait(900);
  await c.spot('#vehicle .vhfuel', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(300);
  await c.scroll(0, '#vehicle'); await c.wait(500);
  await c.tap('#vehicle .secnav .chip:nth-child(2)'); await c.wait(1600);
  await c.scroll(430, '#vehicle'); await c.wait(900);
  await c.spot('#vehicle .vhdist', 4, 22); await c.wait(3400);
  await c.unspot(); await c.wait(300);
  await c.scroll(0, '#vehicle'); await c.wait(500);
  await c.tap('#vehicle .secnav .chip:nth-child(4)'); await c.wait(1600);
  await c.tap('#vehicle .vhist .vhc .chip:nth-child(3)'); await c.wait(1800);
  await c.spot('#vehicle .vhist', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(800);
} };
