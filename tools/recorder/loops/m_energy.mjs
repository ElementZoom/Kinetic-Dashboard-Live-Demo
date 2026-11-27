export default { file: 'EZ_Loop_Module_Energy_Light_v3', hash: '#energy', async run(p, c) {
  await c.wait(1500);
  await c.spot('#energy .ensl > .pn:nth-child(1)', 4, 22); await c.wait(3200);
  await c.unspot(); await c.wait(300);
  await c.tap('#energy .ehc .chip:nth-child(2)'); await c.wait(2200);
  await c.spot('#energy .ensl > .pn:nth-child(1)', 4, 22); await c.wait(3000);
  await c.unspot(); await c.wait(300);
  await c.tap('#energy .ehc .chip:nth-child(3)'); await c.wait(2200);
  await c.spot('#energy .ensl > .pn:nth-child(1)', 4, 22); await c.wait(3000);
  await c.unspot(); await c.wait(800);
} };
