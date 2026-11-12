export default { file: 'EZ_Loop_Lighting_Light_v5', hash: '#rooms/living', async run(p, c) {
  await c.wait(1500);
  await c.spot('.tl[data-e="light.demo_living_lights"],.tl[data-e="light.demo_kitchen_lights"]', 8); await c.wait(2600);
  await c.tap('.tl[data-e="light.demo_living_lights"]'); await c.wait(2400);
  await c.tap('.tl[data-e="light.demo_living_lights"]'); await c.wait(2400);
  await p.screenshot({ path: '/tmp/l1.png' });
  await c.spot('.tl[data-e="switch.demo_kitchen_led"],.tl[data-e="switch.demo_table_light"]', 8); await c.wait(2400);
  await c.tap('.tl[data-e="switch.demo_table_light"]'); await c.wait(3000);
  await p.screenshot({ path: '/tmp/l2.png' });
  await c.tap('.tl[data-e="switch.demo_table_light"]'); await c.wait(1500);
  await c.unspot(); await c.wait(1200);
} };
