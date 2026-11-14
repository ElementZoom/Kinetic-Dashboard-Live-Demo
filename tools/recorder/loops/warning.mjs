export default { file: 'EZ_Loop_Warning_Light_v8', hash: '#home', async run(p, c) {
  await p.evaluate(() => { const D = window.DEMO; D.alerts(true); ["binary_sensor.demo_front_door_contact","binary_sensor.demo_patio_door_contact","switch.demo_backyard_tap","input_boolean.demo_rubbish_day","binary_sensor.demo_washing_machine_leak"].forEach(i => D.push(i, "off")); D.push("binary_sensor.demo_master_window", "on"); });
  await c.wait(1500);
  await c.spot([360, 14, 114, 50], 6, 24); await c.wait(1800);
  await c.tap([416, 38]); await c.wait(1600);
  await c.spot([49, 244, 462, 112], 4, 20); await c.wait(3200);
  await c.tap([270, 300]); await c.wait(1800);
  await c.spot([16, 100, 508, 106], 4, 22); await c.wait(2600);
  await c.spot([16, 249, 508, 182], 4, 20); await c.wait(3400);
  await c.spot([16, 433, 508, 182], 4, 20); await c.wait(3200);
  await c.spot([16, 646, 508, 117], 4, 20); await c.wait(3600);
  await c.spot([16, 794, 508, 59], 4, 20); await c.wait(3000);
  await c.unspot(); await c.wait(1200);
} };
