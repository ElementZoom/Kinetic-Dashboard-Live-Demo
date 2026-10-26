// ElementZoom live demo: a pretend Home Assistant that runs inside the visitor's browser.
// Loaded after config.js and before the dashboard engine. It replaces WebSocket (HA's API) and fetch (calendars, lyrics)
// so the real Kinetic dashboard works unchanged, with every tap changing pretend devices only. Nothing leaves the page.
(function () {
  var CFG = window.DASH_CONFIG; CFG.url = "."; CFG.token = "demo";
  try { localStorage.dashLogo = "off"; localStorage.dashSeen = Date.now(); localStorage.dashUser = "Alex"; } catch (e) {}
  var now = function () { return new Date().toISOString(); };
  var DOM = /^(light|switch|sensor|binary_sensor|climate|cover|fan|camera|media_player|input_boolean|select|timer|alarm_control_panel|weather|calendar|input_text|automation|person|script|group|input_number|button|lock|vacuum|number)$/;
  var ids = {};
  (JSON.stringify(CFG).match(/\b[a-z_]+\.[a-z0-9_]+\b/g) || []).forEach(function (s) { if (DOM.test(s.split(".")[0])) ids[s] = 1; });
  ["person.alex", "person.sam", "zone.home", "sun.sun", "sensor.demo_grid_import", "sensor.demo_heat_pump_energy", "sensor.demo_heater_energy", "sensor.demo_towel_rail_energy",
   "sensor.demo_washer_energy", "sensor.demo_dishwasher_energy", "sensor.demo_hot_water_energy", "binary_sensor.demo_driveway_person", "binary_sensor.demo_driveway_vehicle",
   "media_player.spotify_alex"].forEach(function (i) { ids[i] = 1; });
  var S = {};
  var nm = function (id) { return id.split(".")[1].replace(/^demo_/, "").replace(/_/g, " ").replace(/\b\w/g, function (c) { return c.toUpperCase(); }); };
  var TEMPS = { living: 21.6, master: 19.8, kids: 20.4, office: 22.1, laundry: 17.9, garage: 15.3, outdoor: 14.6 };
  var HUMS = { living: 52, master: 55, kids: 50, office: 47, garage: 61 };
  var ON = { "light.demo_living_lights": 1, "light.demo_kitchen_lights": 1, "light.demo_office_lights": 1, "light.demo_entrance_lights": 1, "light.demo_desk_lamp": 1,
    "switch.demo_kitchen_led": 1, "switch.demo_table_light": 1, "binary_sensor.demo_living_presence": 1, "binary_sensor.demo_office_presence": 1,
    "input_boolean.demo_master_auto_climate": 1, "input_boolean.demo_kids_auto_climate": 1, "input_boolean.demo_office_auto_climate": 1, "media_player.spotify_alex": 0 };
  var key = function (o, M) { for (var k in M) if (o.indexOf(k) > -1) return k; return null; };
  function mk(id) {
    var p = id.split("."), d = p[0], o = p[1], st = "off", a = { friendly_name: nm(id) };
    if (d === "sensor") {
      if (/temperature/.test(o)) { var k = key(o, TEMPS); st = String(/soil/.test(o) ? (o.indexOf("bky") > -1 ? 14.2 : 13.6) : (k ? TEMPS[k] : 20)); a.unit_of_measurement = "°C"; a.device_class = "temperature"; a.state_class = "measurement"; }
      else if (/humidity/.test(o)) { var h = key(o, HUMS); st = String(h ? HUMS[h] : 54); a.unit_of_measurement = "%"; a.device_class = "humidity"; }
      else if (/moisture/.test(o)) { st = o.indexOf("drw") > -1 ? (o.indexOf("_1_") > -1 ? "17" : "19") : (o.indexOf("_1_") > -1 ? "37" : "41"); a.unit_of_measurement = "%"; a.device_class = "moisture"; }
      else if (/flow/.test(o)) { st = "0"; a.unit_of_measurement = "L/min"; }
      else if (/low_battery_count/.test(o)) st = "3";
      else if (/battery/.test(o)) { st = "86"; a.unit_of_measurement = "%"; a.device_class = "battery"; }
      else if (/air_quality/.test(o)) { st = "14"; a.device_class = "aqi"; }
      else if (/weather_warnings/.test(o)) { st = "0"; a.warnings = []; }
      else if (/washer_state/.test(o)) st = "Running";
      else if (/time_remaining/.test(o)) { st = "34"; a.unit_of_measurement = "min"; }
      else if (/delay_time/.test(o)) { st = "0"; a.unit_of_measurement = "min"; }
      else if (/energy|grid_import/.test(o)) { st = "1234.5"; a.unit_of_measurement = "kWh"; a.device_class = "energy"; a.state_class = "total_increasing";
        a.friendly_name = { heat_pump: "Heat pump", heater: "Portable heater", towel_rail: "Heated towel rail", washer: "Washing machine", dishwasher: "Dishwasher", hot_water: "Hot water cylinder", grid_import: "Grid" }[o.replace(/^demo_/, "").replace(/_energy$/, "")] || a.friendly_name; }
      else st = "0";
    } else if (d === "binary_sensor") { st = ON[id] ? "on" : "off"; a.device_class = /window/.test(o) ? "window" : /door/.test(o) ? "door" : /presence|motion/.test(o) ? "occupancy" : /leak/.test(o) ? "moisture" : undefined; }
    else if (d === "light") { st = ON[id] ? "on" : "off"; a.supported_color_modes = ["color_temp", "hs"]; a.color_mode = "color_temp"; a.brightness = st === "on" ? 190 : null; a.color_temp_kelvin = 2900; a.min_color_temp_kelvin = 2200; a.max_color_temp_kelvin = 6500; }
    else if (d === "switch" || d === "input_boolean" || d === "automation") st = d === "automation" ? "on" : (ON[id] ? "on" : "off");
    else if (d === "climate") {
      var t = key(o, TEMPS), main = /heat_pump/.test(o); st = main || /living|office/.test(o) ? "heat" : "off";
      a = Object.assign(a, { current_temperature: main ? 21.6 : (t ? TEMPS[t] : 20), temperature: main ? 22 : 21, min_temp: 16, max_temp: 30, target_temp_step: 0.5,
        hvac_modes: main ? ["off", "heat", "cool", "dry", "fan_only", "heat_cool"] : ["off", "heat"], fan_modes: ["auto", "low", "medium", "high"], fan_mode: "auto", hvac_action: st === "heat" ? "heating" : "off" });
    }
    else if (d === "cover") { st = "open"; a.current_position = 100; a.device_class = "curtain"; a.supported_features = 15; }
    else if (d === "fan") st = "off";
    else if (d === "camera") { st = "idle"; a.entity_picture = "/cams/" + id + ".jpg"; a.access_token = "demo"; }
    else if (d === "media_player") {
      if (id === "media_player.demo_living_speaker") { st = "playing"; Object.assign(a, { friendly_name: "Living speaker", media_title: "Golden Hour", media_artist: "Coastline", media_album_name: "Evenings", media_content_type: "music",
        entity_picture: "/cams/album.jpg", media_duration: 214, media_position: 61, media_position_updated_at: now(), volume_level: 0.32, is_volume_muted: false, group_members: [id], supported_features: 152463 }); }
      else { st = id.indexOf("master") > -1 ? "idle" : "off"; Object.assign(a, { friendly_name: id.indexOf("master") > -1 ? "Master speaker" : "Spotify", volume_level: 0.25, group_members: [id], supported_features: 152463 }); }
    }
    else if (d === "select") { st = "Off"; a.options = ["Off", "Low", "Medium", "High"]; }
    else if (d === "timer") { st = "idle"; a.duration = "0:15:00"; }
    else if (d === "alarm_control_panel") { st = "armed_home"; a.code_arm_required = false; a.supported_features = 63; }
    else if (d === "weather") { st = "partlycloudy"; Object.assign(a, { temperature: 14.6, apparent_temperature: 13.4, humidity: 64, pressure: 1018, wind_speed: 12, wind_bearing: 240, uv_index: 2, temperature_unit: "°C", wind_speed_unit: "km/h", pressure_unit: "hPa", visibility_unit: "km", precipitation_unit: "mm", friendly_name: "Home" }); }
    else if (d === "input_text") { st = ""; a.max = 255; }
    else if (d === "person") { st = "home"; a.user_id = o === "alex" ? "u1" : "u2"; a.friendly_name = o === "alex" ? "Alex" : "Sam"; }
    else if (d === "zone") { st = "2"; Object.assign(a, { latitude: -37.787, longitude: 175.279, radius: 100, friendly_name: "Home" }); }
    else if (d === "sun") { var hr = new Date().getHours(), up = hr >= 7 && hr < 19; st = up ? "above_horizon" : "below_horizon"; a.next_rising = new Date(Date.now() + 9 * 3600e3).toISOString(); a.next_setting = new Date(Date.now() + 5 * 3600e3).toISOString(); }
    Object.keys(a).forEach(function (k) { if (a[k] === undefined) delete a[k]; });
    return { entity_id: id, state: st, attributes: a, last_changed: now(), last_updated: now(), context: { id: "c" + Math.random().toString(36).slice(2) } };
  }
  // Battery Notes style "Battery+" sensors: a few are low so the Batteries tab has something to show
  var BAT = { front_door_sensor: 14, garage_remote: 9, bathroom_motion: 22, patio_door_sensor: 78, kitchen_leak_sensor: 91, hallway_motion: 64 };
  Object.keys(BAT).forEach(function (k) { ids["sensor.demo_" + k + "_battery_plus"] = 1; });
  Object.keys(ids).forEach(function (id) { S[id] = mk(id); });
  Object.keys(BAT).forEach(function (k) { var s = S["sensor.demo_" + k + "_battery_plus"]; s.state = String(BAT[k]); s.attributes.friendly_name = nm("sensor.demo_" + k) + " Battery+"; });
  // whole-house groups that are real entities in the demo (e.g. light.all_lights): list their members so the Active tab can see what is on
  var DG = (CFG.derived && CFG.derived.groups) || {};
  Object.keys(DG).forEach(function (g) { if (!S[g]) return; var L = [].concat(DG[g]); S[g].attributes.entity_id = L; S[g].state = L.some(function (x) { return S[x] && S[x].state === "on"; }) ? "on" : "off"; });

  // camera pictures: the dashboard asks for one fixed picture per camera; the demo swaps in the right still (person on the driveway, garage door position)
  var IMG = { person: false, garage: 0 };
  function camUrl(v) { v = String(v);
    if (/camera\.demo_garage\.jpg/.test(v)) return v.replace("camera.demo_garage.jpg", "camera.demo_garage_g" + IMG.garage + ".jpg");
    if (IMG.person && /camera\.demo_driveway\.jpg/.test(v)) return v.replace("camera.demo_driveway.jpg", "camera.demo_driveway_person.jpg");
    return v; }
  var SRC = Object.getOwnPropertyDescriptor(HTMLImageElement.prototype, "src");
  Object.defineProperty(HTMLImageElement.prototype, "src", { get: SRC.get, set: function (v) { SRC.set.call(this, camUrl(v)); }, configurable: true });
  function refreshCam(cam) {   // show the new still straight away instead of waiting for the next camera refresh
    Array.prototype.forEach.call(document.images, function (im) { var u = SRC.get.call(im); if (u.indexOf(cam) < 0) return;
      im.src = u.replace(/camera\.demo_[a-z_]*?(_person|_g\d)?\.jpg(\?.*)?$/, cam + ".jpg?t=" + Date.now()); }); }
  var SA = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) { return SA.call(this, n, this instanceof HTMLImageElement && n === "src" ? camUrl(v) : v); };

  // ---------- forecasts, energy, history ----------
  function daily() { var c = ["partlycloudy", "sunny", "sunny", "cloudy", "rainy", "partlycloudy", "sunny", "sunny", "cloudy", "partlycloudy"], out = [];
    for (var i = 0; i < 10; i++) { var d = new Date(); d.setHours(12, 0, 0, 0); d.setDate(d.getDate() + i); out.push({ datetime: d.toISOString(), condition: c[i], temperature: [18, 21, 22, 19, 16, 18, 21, 23, 20, 19][i], templow: [9, 10, 11, 11, 10, 8, 9, 11, 12, 10][i], precipitation: c[i] === "rainy" ? 6.2 : 0, precipitation_probability: c[i] === "rainy" ? 80 : c[i] === "cloudy" ? 30 : 5, wind_speed: 12 + i % 4 * 3, humidity: 60 }); } return out; }
  function hourly() { var out = [], b = new Date(); b.setMinutes(0, 0, 0);
    for (var i = 0; i < 48; i++) { var d = new Date(+b + i * 3600e3), h = d.getHours(); out.push({ datetime: d.toISOString(), condition: h > 6 && h < 19 ? (i > 30 ? "cloudy" : "partlycloudy") : "clear-night", temperature: Math.round((13 + 6 * Math.sin((h - 9) / 24 * Math.PI * 2)) * 10) / 10, precipitation: 0, precipitation_probability: i > 26 && i < 32 ? 40 : 5, wind_speed: 10 + (i % 6), humidity: 62 }); } return out; }
  var DEV = ["sensor.demo_heat_pump_energy", "sensor.demo_heater_energy", "sensor.demo_towel_rail_energy", "sensor.demo_hot_water_energy", "sensor.demo_washer_energy", "sensor.demo_dishwasher_energy"];
  function hourUse(id, t) { var h = new Date(t).getHours(), r = (Math.sin(t / 3.7e6) + 1) / 2;
    switch (id) {
      case "sensor.demo_heat_pump_energy": return (h >= 6 && h < 9) || (h >= 17 && h < 22) ? 0.9 + 0.3 * r : 0.15;
      case "sensor.demo_heater_energy": return h >= 19 && h < 23 ? 1.4 : 0;
      case "sensor.demo_towel_rail_energy": return h >= 6 && h < 9 ? 0.12 : 0.01;
      case "sensor.demo_hot_water_energy": return h >= 1 && h < 5 ? 0.9 : 0.05;
      case "sensor.demo_washer_energy": return h === 9 || h === 10 ? 0.45 : 0;
      case "sensor.demo_dishwasher_energy": return h === 20 ? 0.9 : 0;
      case "sensor.demo_gas_use": return h >= 6 && h < 9 ? 0.9 : h >= 17 && h < 22 ? 1.2 : 0.15;
      case "sensor.demo_gas_cost": return hourUse("sensor.demo_gas_use", t) * 0.128;
      case "sensor.demo_grid_cost": return hourUse("sensor.demo_grid_import", t) * (h >= 7 && h < 21 ? 0.34 : 0.18) + 2.1 / 24;   // like a power company's statistic: the daily charge is inside
      default: return 0.35 + 0.5 * r + (h >= 17 && h < 22 ? 1.2 : 0);
    } }
  function stats(m) { var s = Date.parse(m.start_time), e = Math.min(Date.parse(m.end_time || now()), Date.now()), out = {}, step = { "5minute": 3600e3, hour: 3600e3, day: 864e5, week: 7 * 864e5, month: 0 }[m.period] || 3600e3;
    (m.statistic_ids || []).forEach(function (id) { var L = [];
      if (m.period === "month") { var d = new Date(s); while (+d < e) { var n = new Date(d); n.setMonth(n.getMonth() + 1); var sum = 0; for (var t = +d; t < Math.min(+n, e); t += 3600e3) sum += hourUse(id, t); L.push({ start: +d, end: +n, change: sum }); d.setMonth(d.getMonth() + 1); } }
      else for (var t2 = s; t2 < e; t2 += step) { var sm = 0; for (var u = t2; u < t2 + step && u < e; u += 3600e3) sm += hourUse(id, u); L.push({ start: t2, end: t2 + step, change: Math.round(sm * 1000) / 1000 }); }
      out[id] = L; }); return out; }
  function history(m) { var s = Date.parse(m.start_time), e = Date.parse(m.end_time || now()), out = {};
    (m.entity_ids || []).forEach(function (id) { var base = parseFloat((S[id] || {}).state) || 30, L = [];
      for (var t = s; t < e; t += 1800e3) L.push({ s: String(Math.round((base + 6 * Math.sin((t - s) / 864e5 * Math.PI * 2) - 3 * (t - s) / (e - s)) * 10) / 10), lu: t / 1000 });
      out[id] = L; }); return out; }

  // ---------- state changes ----------
  var socks = [], listeners = [];
  function push(id, st, attrs) {
    var old = S[id] || mk(id), ns = JSON.parse(JSON.stringify(old));
    if (st != null) ns.state = st; if (attrs) Object.assign(ns.attributes, attrs);
    ns.last_changed = now(); ns.last_updated = now(); S[id] = ns;
    socks.forEach(function (w) { w._subs.forEach(function (sid) { w._emit({ id: sid, type: "event", event: { event_type: "state_changed", time_fired: now(), data: { entity_id: id, old_state: old, new_state: ns } } }); }); });
    listeners.forEach(function (f) { try { f({ kind: "state", id: id, state: ns.state, attrs: ns.attributes, old: old }); } catch (e) {} });
  }
  var MOVE = {};
  function moveCover(id, target) {
    clearInterval(MOVE[id]); var s = S[id]; if (!s) return; var pos = s.attributes.current_position == null ? 100 : s.attributes.current_position;
    var dir = target > pos ? 1 : -1; push(id, dir > 0 ? "opening" : "closing");
    MOVE[id] = setInterval(function () { pos = Math.max(0, Math.min(100, pos + dir * 10)); var done = dir > 0 ? pos >= target : pos <= target;
      push(id, done ? (pos > 0 ? "open" : "closed") : (dir > 0 ? "opening" : "closing"), { current_position: pos }); if (done) clearInterval(MOVE[id]); }, 450);
  }
  // garage door: the opener switch starts the door moving; the camera picture follows it (g0 closed ... g4 open)
  var GAR = { open: false, f: 0, to: null, t: null };   // f = picture 0 (closed) .. 4 (open)
  function garage(open) {
    var end = open ? 4 : 0; if (GAR.t && GAR.to === end) return; if (!GAR.t && GAR.f === end) return;
    clearInterval(GAR.t); GAR.to = end; push("switch.demo_garage_opener", "on");
    if (open) setTimeout(function () { push("binary_sensor.demo_garage_door_contact", "on"); }, 400);
    GAR.t = setInterval(function () { GAR.f += open ? 1 : -1; IMG.garage = GAR.f; push("camera.demo_garage", null, { frame: GAR.f }); refreshCam("camera.demo_garage");
      if (GAR.f === end) { clearInterval(GAR.t); GAR.t = null; GAR.open = open; push("switch.demo_garage_opener", "off"); if (!open) push("binary_sensor.demo_garage_door_contact", "off"); } }, 1150);
  }
  var IRR = { driveway: ["switch.demo_driveway_tap", "sensor.demo_driveway_tap_flow", "timer.demo_driveway_timer"], walkway: ["switch.demo_walkway_tap", "sensor.demo_walkway_tap_flow", "timer.demo_walkway_timer"], backyard: ["switch.demo_backyard_tap", "sensor.demo_backyard_tap_flow", "timer.demo_backyard_timer"] };
  function mins(v) { if (v == null) return 15; if (typeof v === "number") return v; var p = String(v).split(":").map(Number); return p.length === 3 ? p[0] * 60 + p[1] + Math.round(p[2] / 60) : p.length === 2 ? p[0] * 60 + p[1] : (+v || 15); }
  function zoneOf(id) { for (var z in IRR) if (IRR[z][0] === id) return z; return null; }
  function tapOn(z, dmin) { var Z = IRR[z]; if (!Z) return; dmin = dmin || 15; var fin = new Date(Date.now() + dmin * 60e3).toISOString(), dur = "0:" + String(dmin).padStart(2, "0") + ":00";
    push(Z[0], "on"); push(Z[1], (12 + Math.random() * 4).toFixed(1), { unit_of_measurement: "L/min" }); push(Z[2], "active", { duration: dur, remaining: dur, finishes_at: fin }); }
  function tapOff(z) { var Z = IRR[z]; if (!Z) return; push(Z[0], "off"); push(Z[1], "0"); push(Z[2], "idle", { remaining: null, finishes_at: null }); }

  function service(m) {
    var sd = m.service_data || {}, d = m.domain, sv = m.service;
    listeners.forEach(function (f) { try { f({ kind: "service", domain: d, service: sv, data: sd, target: m.target }); } catch (e) {} });
    if (d === "script" && sv === "start_sprinkler_timer") { tapOn(sd.zone, mins(sd.duration)); return; }
    if (d === "script" && sv === "turn_on" && /siren/.test(JSON.stringify(m))) return;
    if (sv === "join") { var mem = [].concat((m.target && m.target.entity_id) || [], sd.group_members || []); mem.forEach(function (id) { if (S[id]) push(id, null, { group_members: mem }); }); return; }
    if (sv === "unjoin") { [].concat((m.target && m.target.entity_id) || sd.entity_id || []).forEach(function (id) { if (S[id]) push(id, null, { group_members: [id] }); }); return; }
    var tg = (m.target && m.target.entity_id) || sd.entity_id, L = [].concat(tg || []);
    L.forEach(function (id) { var s = S[id]; if (!s) s = S[id] = mk(id);
      if (id === "switch.demo_garage_opener" && /turn_on|toggle/.test(sv)) { garage(GAR.t ? GAR.to === 0 : !GAR.open); return; }
      var z = zoneOf(id); if (z) { if (sv === "turn_off" || (sv === "toggle" && s.state === "on")) tapOff(z); else tapOn(z, 15); return; }
      if (d === "alarm_control_panel") { push(id, { alarm_disarm: "disarmed", alarm_arm_home: "armed_home", alarm_arm_away: "armed_away", alarm_arm_night: "armed_night" }[sv] || s.state); return; }
      if (sv === "toggle") push(id, s.state === "on" ? "off" : "on", id.indexOf("light.") === 0 ? { brightness: s.state === "on" ? null : 200 } : null);
      else if (sv === "turn_on") { var at = {};
        if (id.indexOf("light.") === 0) { at.brightness = s.attributes.brightness || 200;
          if (sd.brightness_pct != null) at.brightness = Math.round(sd.brightness_pct * 2.55); if (sd.brightness != null) at.brightness = sd.brightness;
          if (sd.rgb_color) { at.rgb_color = sd.rgb_color; at.color_mode = "hs"; } if (sd.hs_color) { at.hs_color = sd.hs_color; at.color_mode = "hs"; }
          if (sd.color_temp_kelvin) { at.color_temp_kelvin = sd.color_temp_kelvin; at.color_mode = "color_temp"; } }
        if (id.indexOf("media_player.") === 0) { push(id, "idle"); return; }
        push(id, "on", at); }
      else if (sv === "turn_off") push(id, "off", id.indexOf("light.") === 0 ? { brightness: null } : null);
      else if (sv === "set_temperature") push(id, null, { temperature: sd.temperature });
      else if (sv === "set_hvac_mode") push(id, sd.hvac_mode, { hvac_action: sd.hvac_mode === "off" ? "off" : sd.hvac_mode === "cool" ? "cooling" : "heating" });
      else if (sv === "set_fan_mode") push(id, null, { fan_mode: sd.fan_mode });
      else if (sv === "open_cover") moveCover(id, 100);
      else if (sv === "close_cover") moveCover(id, 0);
      else if (sv === "stop_cover") clearInterval(MOVE[id]), push(id, (s.attributes.current_position || 0) > 0 ? "open" : "closed");
      else if (sv === "set_cover_position") moveCover(id, sd.position);
      else if (sv === "media_play_pause") push(id, s.state === "playing" ? "paused" : "playing", { media_position_updated_at: now() });
      else if (sv === "media_play") push(id, "playing", { media_position_updated_at: now() });
      else if (sv === "media_pause") push(id, "paused", { media_position_updated_at: now() });
      else if (sv === "volume_set") push(id, null, { volume_level: sd.volume_level });
      else if (sv === "volume_mute") push(id, null, { is_volume_muted: !!sd.is_volume_muted });
      else if (sv === "media_next_track" || sv === "media_previous_track") { var T = [["Golden Hour", "Coastline"], ["Low Tide", "Harbour Lights"], ["Northbound", "The Kauri"], ["Late Bloom", "Paper Moons"]], i = (s._ti || 0) + (sv === "media_next_track" ? 1 : 3); i %= T.length; s._ti = i;
        push(id, "playing", { media_title: T[i][0], media_artist: T[i][1], media_position: 0, media_position_updated_at: now() }); }
      else if (sv === "select_option") push(id, sd.option);
      else if (sv === "set_value") push(id, String(sd.value));
      else if (sv === "start" && d === "timer") push(id, "active");
      else if (sv === "cancel" && d === "timer") push(id, "idle");
      else if (sv === "press") push(id, now());
    });
  }

  setInterval(function () { Object.keys(S).forEach(function (id) { if (id.indexOf("climate.") !== 0) return; var a = S[id].attributes, st = S[id].state;
    if (st === "off" || a.temperature == null) return; var cur = +a.current_temperature, tg = +a.temperature, heat = st === "heat" || (st === "heat_cool" && tg > cur), cool = st === "cool" || (st === "heat_cool" && tg < cur);
    var n = heat && cur < tg ? cur + 0.1 : cool && cur > tg ? cur - 0.1 : null; n = n == null ? null : Math.round(n * 10) / 10;
    if (n != null) push(id, null, { current_temperature: n, hvac_action: heat ? "heating" : "cooling" }); else if (a.hvac_action !== "idle" && Math.abs(cur - tg) < 0.05) push(id, null, { hvac_action: "idle" }); }); }, 1500);

  // ---------- fake WebSocket speaking HA's protocol ----------
  function FakeWS(url) { var w = this; w.url = url; w.readyState = 0; w._subs = []; w.onopen = w.onmessage = w.onclose = w.onerror = null; w._l = {};
    socks.push(w); setTimeout(function () { w.readyState = 1; w._fire("open", {}); w._emit({ type: "auth_required", ha_version: "2026.10.1" }); }, 30); }
  FakeWS.CONNECTING = 0; FakeWS.OPEN = 1; FakeWS.CLOSING = 2; FakeWS.CLOSED = 3;
  FakeWS.prototype.addEventListener = function (t, f) { (this._l[t] = this._l[t] || []).push(f); };
  FakeWS.prototype.removeEventListener = function (t, f) { this._l[t] = (this._l[t] || []).filter(function (g) { return g !== f; }); };
  FakeWS.prototype._fire = function (t, ev) { if (typeof this["on" + t] === "function") this["on" + t](ev); (this._l[t] || []).forEach(function (f) { f(ev); }); };
  FakeWS.prototype._emit = function (o) { var w = this; if (w.readyState !== 1) return; var s = JSON.stringify(o); setTimeout(function () { w._fire("message", { data: s }); }, 4); };
  FakeWS.prototype.close = function () { this.readyState = 3; var i = socks.indexOf(this); if (i > -1) socks.splice(i, 1); this._fire("close", { code: 1000 }); };
  FakeWS.prototype.send = function (raw) { var w = this, m; try { m = JSON.parse(raw); } catch (e) { return; }
    var ok = function (r) { w._emit({ id: m.id, type: "result", success: true, result: r }); };
    if (m.type === "auth") return w._emit({ type: "auth_ok", ha_version: "2026.10.1" });
    switch (m.type) {
      case "ping": return w._emit({ id: m.id, type: "pong" });
      case "supported_features": return ok(null);
      case "get_states": return ok(Object.keys(S).map(function (k) { return S[k]; }));
      case "subscribe_events": case "subscribe_trigger": case "subscribe_entities": w._subs.push(m.id); return ok(null);
      case "unsubscribe_events": return ok(null);
      case "auth/current_user": return ok({ id: "u1", name: "Alex", is_owner: true, is_admin: true, credentials: [], mfa_modules: [] });
      case "call_service":
        if (m.domain === "weather") { var r = {}; [].concat(m.target.entity_id).forEach(function (e) { r[e] = { forecast: m.service_data.type === "hourly" ? hourly() : daily() }; }); return ok({ response: r }); }
        service(m); return ok({ context: { id: "c" + Date.now() } });
      case "recorder/statistics_during_period": return ok(stats(m));
      case "history/history_during_period": return ok(history(m));
      case "energy/get_prefs": return ok({ energy_sources: [{ type: "grid", flow_from: [{ stat_energy_from: "sensor.demo_grid_import", stat_cost: "sensor.demo_grid_cost" }], flow_to: [] }, { type: "gas", stat_energy_from: "sensor.demo_gas_use", stat_cost: "sensor.demo_gas_cost" }], device_consumption: DEV.map(function (s) { return { stat_consumption: s }; }) });
      case "recorder/get_statistics_metadata": return ok((m.statistic_ids || []).map(function (id) { return { statistic_id: id, unit_of_measurement: "kWh" }; }));
      case "frontend/get_user_data": return ok({ value: null });
      case "frontend/set_user_data": return ok(null);
      case "config/auth/list": return ok([{ id: "u1", name: "Alex", is_admin: true, is_active: true, system_generated: false }, { id: "u2", name: "Sam", is_admin: false, is_active: true, system_generated: false }]);
      case "media_source/browse_media": return ok({ title: "Recordings", media_content_id: m.media_content_id, children: [] });
      case "logbook/get_events": return ok([]);
      default: (window.__unk = window.__unk || []).push(m.type); return w._emit({ id: m.id, type: "result", success: false, error: { code: "not_supported", message: "Not available in the demo" } });
    }
  };
  window.WebSocket = FakeWS;

  // ---------- fetch: calendars and lyrics answered here; nothing goes to the network ----------
  var realFetch = window.fetch.bind(window);
  var J = function (o) { return Promise.resolve(new Response(JSON.stringify(o), { status: 200, headers: { "content-type": "application/json" } })); };
  window.fetch = function (u, o) { var s = String(u && u.url || u);
    if (/\/api\/calendars/.test(s)) {
      if (/\/api\/calendars(\?|$)/.test(s)) return J(Object.keys(S).filter(function (i) { return i.indexOf("calendar.") === 0; }).map(function (i) { return { entity_id: i, name: nm(i) }; }));
      var cal = s.split("/api/calendars/")[1].split("?")[0], d0 = new Date(); d0.setHours(0, 0, 0, 0);
      var ev = function (dd, h, len, t) { var st = new Date(+d0 + dd * 864e5 + h * 3600e3); return { summary: t, start: { dateTime: st.toISOString() }, end: { dateTime: new Date(+st + len * 3600e3).toISOString() } }; };
      var E = { "calendar.alex": [ev(0, 9, 1, "Dentist"), ev(2, 18, 2, "Soccer training")], "calendar.sam": [ev(1, 10, 1, "Yoga"), ev(3, 13, 1, "Lunch with Mia")], "calendar.household": [ev(1, 7, 1, "Bins out"), ev(4, 9, 2, "Lawn mowing")], "calendar.public_holidays": [] };
      return J(E[cal] || []);
    }
    if (/lrclib/.test(s)) return J({ id: 1, trackName: "Golden Hour", artistName: "Coastline", duration: 214, syncedLyrics:
      "[00:52.00] Porch light humming, the evening's on slow\n[00:57.00] Shadows get longer wherever we go\n[01:02.00] Turn the dial down, let the day fall away\n[01:07.00] Golden hour, stay a little, stay\n[01:12.00] Kettle's still warm and the windows are wide\n[01:17.00] Sun on the hills on the Waikato side\n[01:22.00] Nothing to fix and nowhere to be\n[01:27.00] Golden hour, just you and me\n[01:32.00] Ooh, golden hour\n[01:37.00] Ooh, stay a while" });
    if (/geonet|\/auth\//.test(s)) return J({ features: [] });
    if (/^https?:/.test(s) && s.indexOf(location.origin) !== 0) return J({});
    return realFetch(u, o);
  };

  // the demo lives inside a web page: keep camera "full screen" inside the dashboard instead of taking over the visitor's screen
  ["requestFullscreen", "webkitRequestFullscreen"].forEach(function (k) { if (Element.prototype[k]) Element.prototype[k] = function () { return Promise.resolve(); }; });
  try { if (screen.orientation && screen.orientation.lock) screen.orientation.lock = function () { return Promise.resolve(); }; } catch (e) {}

  // ---------- controls for the guided tour (parent page) ----------
  window.DEMO = {
    states: S, push: push, on: function (f) { listeners.push(f); },
    person: function (on) { IMG.person = !!on; push("camera.demo_driveway", null, { det: !!on }); refreshCam("camera.demo_driveway");
      push("binary_sensor.demo_driveway_person", on ? "on" : "off"); push("binary_sensor.demo_outdoor_presence", on ? "on" : "off"); },
    garage: garage, garageOpen: function () { return GAR.open; },
    rain: function (on) { push("binary_sensor.demo_master_window", on ? "on" : "off"); push("binary_sensor.demo_rain_detected", on ? "on" : "off");
      push("weather.home", on ? "rainy" : "partlycloudy"); },
    alerts: function (on) {   // the notification pop-up showcase: doors, garage, tap, leak, bins and a weather warning, all at once (off = all clear)
      push("binary_sensor.demo_front_door_contact", on ? "on" : "off"); push("binary_sensor.demo_patio_door_contact", on ? "on" : "off");
      push("switch.demo_backyard_tap", on ? "on" : "off"); push("input_boolean.demo_rubbish_day", on ? "on" : "off");
      push("binary_sensor.demo_washing_machine_leak", on ? "on" : "off");
      push("sensor.demo_weather_warnings", on ? "1" : "0", { warnings: on ? "Heavy rain watch for tonight" : [] });
      garage(!!on); },
    dryGarden: function () { ["sensor.demo_soil_drw_1_moisture", "sensor.demo_soil_drw_2_moisture"].forEach(function (id, i) { push(id, String(17 + i * 2)); }); }
  };
})();
