# Loop recorder – house standard

**Phone = Samsung S26 Ultra proportions, bezel B (metal frame, thin black bezel, punch-hole).**
- Recording viewport 540×1168 CSS px (≈19.5:9), DPR 2. mp4 720×1558, poster webp 360×780 (frame at 0.3 s).
- Site CSS: `.ezf-phone:not(.ezf-tab),.ezh-phone{aspect-ratio:540/1168}` plus the bezel B rules and `--u` scaling (base 340 px).
- Article animations: `article_frame.py phone <mp4> <out.webp>` → 584×1263 transparent WebP with bezel B; tablets use `tl` / `tp` (dark bezel, 960×600 / 600×960 screen).
- Tablets stay 1280×800 and 800×1280 with the dark tablet border.
- In loops, y coordinates ≥ 720 are bottom-anchored (nav bar, sheets, player) and are shifted by +208 automatically; content coordinates above that stay as written.
- Run: `OUT=out node run.mjs <loop> <en|zh>` (phones), `node runt.mjs <loop> <en|zh>` (tablets and Detections). Serve the repo root on :8765 first.
