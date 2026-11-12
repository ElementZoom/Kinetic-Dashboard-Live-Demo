# Loop recorder – house standard

**Phone = Samsung S26 Ultra proportions, bezel B (metal frame, thin black bezel, punch-hole).**
- Recording viewport 540×1168 CSS px (≈19.5:9), DPR 2. mp4 720×1558, poster webp 360×780 (frame at 0.3 s).
- Site CSS: `.ezf-phone:not(.ezf-tab),.ezh-phone{aspect-ratio:540/1168}` plus the bezel B rules and `--u` scaling (base 340 px).
- Article animations: `article_frame.py phone <mp4> <out.webp>` → 584×1263 transparent WebP with bezel B; tablets use `tl` / `tp` (dark bezel, 960×600 / 600×960 screen).
- Tablets stay 1280×800 and 800×1280 with the dark tablet border.
- In loops, y coordinates ≥ 720 are bottom-anchored (nav bar, sheets, player) and are shifted by +208 automatically; content coordinates above that stay as written.
- Run: `OUT=out node run.mjs <loop> <en|zh>` (phones), `node runt.mjs <loop> <en|zh>` (tablets and Detections). Serve the repo root on :8765 first.

## Re-recording everything (60 fps, focus blur + border) – the full routine

1. **Engine first.** Build `dash.html` in the Kinetic-Dashboard repo (`node build.mjs`), then make the demo copy: take that `dash.html` and replace the two lines `config.js?v=1` / `brand-logo.js?v=1` with the demo loader (`config.js?v=2.8.0`, `brand-logo.js?v=1`, `mock.js?v=2.8.1` and the `?lang=zh` dict/zh loader – copy them from the current `app/dash.html`). Save as `app/dash.html` here. Loops record whatever is in `app/`, so an old engine means old screens.
2. **Serve and record.** `python3 -m http.server 8765` in the repo root, then in `tools/recorder`:
   - phones (incl. Detections): `OUT=out node run60.mjs <loop> <en|zh>`
   - tablets (`t_land`, `t_port`): `OUT=out node runt60.mjs <loop> <en|zh>`
   - `lib60.mjs` / `lib60t.mjs` are the current libraries: 60 fps mp4 (720×1558 phones, 1280×800 / 800×1280 tablets) plus a 0.3 s poster webp, and the focus effect (outside blurred and dimmed, white border + purple glow around the spot). `lib.mjs` / `libt.mjs` / `run.mjs` / `runt.mjs` are the old 30 fps versions.
   - Run 2–3 jobs at a time at most; more starves the screencast and drops frames. `AUDIT=1` writes a screenshot per spotlight to `/tmp/audit` for checking boxes.
3. **Check every loop.** Layout changes break hard-coded coordinates. Prefer CSS selectors in `c.spot()`/`c.tap()`; header pill is at about x 360–474, y 14–64 (the lock is on the left, tap the cloud chip at x≈416 to open only weather warnings, x≈430 for everything). Tag elements with `data-rec` via `p.evaluate` when no selector fits (see `garage.mjs`; its regex also matches 车库 for zh).
4. **Version names.** Bump the `vN` in each loop's `file:` when re-recording; keep old files in `media/` so old links still work. Copy mp4 + webp (en and `_zh`) into `media/`, commit, push to main (GitHub Pages serves it).
5. **Website (elementzoom.co.nz, WordPress.com).** It does NOT use the repo's files directly in the page markup: the pages (Home, Features, Chinese Home/Features) hold `<img data-src=".../EZ_Loop_<name>_vN-1.webp">` placeholders, and one script block turns each into a `<video>` loading `https://elementzoom.github.io/Kinetic-Dashboard-Live-Demo/media/<name>.mp4?v=4`. To roll out new loops, edit only that script block (second `core/html` block, index 1, on pages 123, 1684, 1838, 1839) with the section-replace tools: update the version map `V={EZ_Loop_...:N}` and bump the `?v=` cache tag. No uploads to WordPress are needed. Articles do not embed these loops. Check pages/IDs with the WordPress tools first, as they may change.
