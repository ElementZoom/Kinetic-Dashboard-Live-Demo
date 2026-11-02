# ElementZoom live demo

A guided, clickable demo of the [Kinetic dashboard](https://github.com/ElementZoom/Kinetic-Dashboard) running on a pretend house.
Everything runs in the visitor's browser; it never connects to a real Home Assistant.

- `index.html` — the guided tour page (steps, tablet/phone frame)
- `app/dash.html` — the unmodified Kinetic engine plus one extra script line that loads `mock.js`
- `app/mock.js` — the pretend Home Assistant (states, services, cameras)
- `app/config.js` — the showcase config from the Kinetic repo

Two ways to explore: **Guided tour** (default) and **Free play** (no steps, hint dots, season chips). Open straight into Free play with `?mode=free`, or from a parent page with `postMessage({ ezMode: "free" })` (`"tour"` switches back).

Embedding on the website: see `embed-snippet.html`.

Live: https://elementzoom.github.io/Kinetic-Dashboard-Live-Demo/

## Chinese version (简体中文)

Add `?lang=zh` to any demo URL (e.g. `.../Kinetic-Dashboard-Live-Demo/?lang=zh`, or `?lang=zh&mode=free`). English stays the default and is untouched.

- `app/zh.js` translates visible text at runtime; `app/zh-dict.js` holds the dashboard dictionary and `app/zh-tour.js` the guided-tour strings.
- `app/dash.html` has one extra line after the `mock.js` script that loads the two files when `lang=zh`. **Keep it when updating the dashboard engine.**
- New dashboard text that is not in the dictionary stays English; open the page with `?lang=zh`, then run `Object.keys(window.__MISS)` in the console to list what is missing.
- WordPress embed: `embed-snippet-zh.html`.
