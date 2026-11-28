const tag = (p, sel, i, n) => p.evaluate(([sel, i, n]) => { const e = [...document.querySelectorAll(sel)].filter(x => x.getBoundingClientRect().width > 0)[i]; if (e) e.dataset.rec = n; return !!e; }, [sel, i, n]);
export default { file: 'EZ_Loop_Warning_Light_v14', hash: '#home', async run(p, c) {
  await p.evaluate(() => { const D = window.DEMO; D.alerts(true); ["binary_sensor.demo_front_door_contact","binary_sensor.demo_patio_door_contact","switch.demo_backyard_tap","input_boolean.demo_rubbish_day","binary_sensor.demo_washing_machine_leak"].forEach(i => D.push(i, "off")); D.push("binary_sensor.demo_master_window", "on"); });
  await c.wait(1500);
  await c.spot('#hc', 6, 24); await c.wait(1800);
  await c.tap('#nacc .nai[data-k="warn"]'); await c.wait(1600);
  await c.spot('#npc .ww', 4, 20); await c.wait(3200);
  await c.tap('#npc .ww'); await c.wait(1800);
  await c.spot('#cmtsh .tk-h', 4, 22); await c.wait(2600);
  await tag(p, '#cmtsh .tk-wwc', 0, 'c0'); await tag(p, '#cmtsh .tk-wwc', 1, 'c1');
  await c.spot('[data-rec=c0]', 4, 20); await c.wait(3400);
  await c.spot('[data-rec=c1]', 4, 20); await c.wait(3200);
  await c.spot('#cmtsh .tk-wwr:not(.go)', 4, 20); await c.wait(3600);
  await c.spot('#cmtsh .tk-wwn', 4, 20); await c.wait(3000);
  await c.spot('#cmtsh .tk-f', 4, 20); await c.wait(3000);
  await c.unspot(); await c.wait(1200);
} };
