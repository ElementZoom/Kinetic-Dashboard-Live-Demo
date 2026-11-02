/* ElementZoom demo: Simplified Chinese layer.
   Translates visible text at runtime using app/zh-dict.js (window.__ZHD = {D:{exact lowercase english: chinese}, P:[[regex, template]]}).
   Template: $1 = raw group, {1} = group translated through the dictionary.
   Loaded only when the page is opened with ?lang=zh, so the English demo is untouched. */
(function () {
  var Z = window.__ZHD || { D: {}, P: [] }, D = Z.D, P = Z.P.map(function (p) { return [new RegExp(p[0], "i"), p[1]]; });
  var miss = window.__MISS = window.__MISS || {};
  function norm(t) { return t.trim().replace(/\s+/g, " ").toLowerCase(); }
  function tr(t) { var r = tr0(t); return r === null ? t : r; }
  function tr0(t) {
    var k = norm(t); if (!k) return null;
    if (Object.prototype.hasOwnProperty.call(D, k)) return D[k];
    for (var i = 0; i < P.length; i++) {
      var m = P[i][0].exec(t.trim().replace(/\s+/g, " "));
      if (m) return P[i][1].replace(/\{(\d)\}/g, function (_, n) { return m[n] === undefined ? "" : tr(m[n]); }).replace(/\$(\d)/g, function (_, n) { return m[n] === undefined ? "" : m[n]; });
    }
    return null;
  }
  function node(n) {
    var raw = n.nodeValue, v = tr0(raw);
    if (v !== null) { var lead = raw.match(/^\s*/)[0], trail = raw.match(/\s*$/)[0]; n.nodeValue = lead + v + trail; }
    else if (/[A-Za-z]{2,}/.test(raw) && n.parentElement && !/^(SCRIPT|STYLE|NOSCRIPT)$/.test(n.parentElement.tagName)) miss[raw.trim()] = 1;
  }
  var ATTR = ["aria-label", "title", "placeholder", "alt"];
  function walk(r) {
    if (r.nodeType === 3) { node(r); return; }
    if (r.nodeType !== 1 || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(r.tagName)) return;
    ATTR.forEach(function (a) { var v = r.getAttribute && r.getAttribute(a); if (v) { var t = tr0(v); if (t !== null && t !== v) r.setAttribute(a, t); } });
    for (var c = r.firstChild; c; c = c.nextSibling) walk(c);
  }
  var busy = false;
  function run() { if (busy) return; busy = true; try { walk(document.body || document.documentElement); } catch (e) {} busy = false; }
  document.documentElement.lang = "zh-CN";
  var pend = false;
  new MutationObserver(function () { if (pend) return; pend = true; requestAnimationFrame(function () { pend = false; run(); }); }).observe(document, { subtree: true, childList: true, characterData: true });
  setInterval(run, 400); document.addEventListener("DOMContentLoaded", run);
  window.__zhTr = tr;
})();
