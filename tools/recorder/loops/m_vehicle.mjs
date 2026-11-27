const tab = async (p, c, i) => { const t = '#vehicle .secnav .chip[data-i="' + i + '"]'; if (!(await p.locator(t).filter({ visible: true }).count())) { await c.tap('#vehicle .secnav .chip.on'); await c.wait(900); } await c.tap(t); await c.wait(1600); };
export default { file: 'EZ_Loop_Module_Vehicle_Light_v6', hash: '#vehicle', async run(p, c) {
  await c.wait(1500);
  await c.spot('#vehicle .vgrid > .pn:nth-child(1)', 4, 22); await c.wait(2600);
  await c.unspot(); await c.wait(300);
  await c.scroll(330, '#vehicle'); await c.wait(900);
  await c.spot('#vehicle .vhfuel', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(300);
  await c.scroll(0, '#vehicle'); await c.wait(500);
  await tab(p, c, 1);
  await c.scroll(430, '#vehicle'); await c.wait(900);
  await c.spot('#vehicle .vhdist', 4, 22); await c.wait(3400);
  await c.unspot(); await c.wait(300);
  await c.scroll(0, '#vehicle'); await c.wait(500);
  await tab(p, c, 3);
  await c.tap('#vehicle .vhist .vhc .chip:nth-child(3)'); await c.wait(1800);
  await c.spot('#vehicle .vhist', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(800);
} };
