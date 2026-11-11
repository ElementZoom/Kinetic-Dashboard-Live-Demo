export default { file: 'EZ_Loop_Warning_Light_v5', hash: '#home', async run(p, c) {
  await p.evaluate(() => { const D = window.DEMO; D.alerts(true); ["binary_sensor.demo_front_door_contact","binary_sensor.demo_patio_door_contact","switch.demo_backyard_tap","input_boolean.demo_rubbish_day","binary_sensor.demo_washing_machine_leak"].forEach(i => D.push(i, "off")); D.push("binary_sensor.demo_master_window", "on"); });
  await c.wait(1500);
  await c.spot([335, 10, 100, 44], 6, 20); await c.wait(1800);
  await c.tap([385, 32]); await c.wait(1600);
  await c.spot([49, 244, 462, 112], 4, 20); await c.wait(3200);
  await c.tap([270, 300]); await c.wait(1800);
  await c.spot([16, 10, 508, 90], 4, 22); await c.wait(2600);
  await c.spot([16, 130, 508, 190], 4, 20); await c.wait(3400);
  await c.spot([16, 330, 508, 180], 4, 20); await c.wait(3200);
  await c.scroll(450); await c.wait(1200);
  await c.spot([16, 535, 508, 125], 4, 20); await c.wait(3600);
  await c.spot([16, 668, 508, 76], 4, 20); await c.wait(3000);
  await c.unspot(); await c.wait(1200);
} };
