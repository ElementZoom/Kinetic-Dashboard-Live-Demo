# ElementZoom live demo

A guided, clickable demo of the [Kinetic dashboard](https://github.com/ElementZoom/Kinetic-Dashboard) running on a pretend house.
Everything runs in the visitor's browser; it never connects to a real Home Assistant.

- `index.html` — the guided tour page (steps, tablet/phone frame)
- `app/dash.html` — the unmodified Kinetic engine plus one extra script line that loads `mock.js`
- `app/mock.js` — the pretend Home Assistant (states, services, cameras)
- `app/config.js` — the showcase config from the Kinetic repo

Embedding on the website: see `embed-snippet.html`.

Live: https://elementzoom.github.io/Kinetic-Dashboard-Live-Demo/
