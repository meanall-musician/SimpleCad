(() => {
'use strict';
const $ = id => document.getElementById(id);
const cv = $('cv'); let ctx = cv.getContext('2d');
const C = { man: '#e8590c', tool: '#1971c2', sel: '#12b886', grey: '#98a2b3' };
const OFF_PX = 36, GAP_PX = 4, EXT_PX = 6, KEY = 'simplecad_v2', PXMM = 25.4 / 96;
const PAL = ['#000000','#343a40','#868e96','#ced4da','#c92a2a','#e64980','#be4bdb','#7048e8','#4263eb','#1971c2','#1098ad','#0ca678',
             '#2f9e44','#74b816','#f59f00','#e8590c','#5f3dc4','#364fc7','#0b7285','#087f5b','#5c940d','#e67700','#8d5524','#a61e4d'];
const PAPER = { A0: [841, 1189], A1: [594, 841], A2: [420, 594], A3: [297, 420], A4: [210, 297] };
const SCALES = [1, 2, 5, 10, 20, 25, 50, 100, 150, 200, 250, 500, 1000, 2000, 5000];

const defaultTB = () => [
  { l: 'Inwestor', v: '' }, { l: 'Adres inwestycji', v: '' }, { l: 'Tytuł rysunku', v: '' }, { l: 'Projektant', v: '' },
  { l: 'Uprawnienia', v: '' }, { l: 'Branża', v: 'Architektura' }, { l: 'Skala', v: '{skala}' }, { l: 'Data', v: '{data}' },
  { l: 'Nr rysunku', v: '1' }, { l: 'Rewizja', v: 'A' }];
const newDoc = () => ({ segs: [], dims: [], texts: [], areas: [], objs: [], custom: [], id: 1,
  proj: { name: 'Nowy projekt', desc: '', tb: defaultTB() },
  sheet: { fmt: 'free', orient: 'auto', scale: 'auto', tb: false, tbs: 1, frame: false, frameW: 1, off: { x: 0, y: 0 }, m: { t: 15, r: 15, b: 15, l: 15 }, fx: 0, fy: 0, N: 1, pw: 0, ph: 0 } });
function migrate(d) {
  const b = newDoc(); d = d || {};
  const o = Object.assign(b, d);
  o.proj = Object.assign(b.proj, d.proj || {}); if (!Array.isArray(o.proj.tb)) o.proj.tb = defaultTB();
  o.sheet = Object.assign(b.sheet, d.sheet || {}); o.sheet.m = Object.assign({ t: 15, r: 15, b: 15, l: 15 }, (d.sheet && d.sheet.m) || {}); if (!(o.sheet.tbs > 0)) o.sheet.tbs = 1; o.sheet.off = Object.assign({ x: 0, y: 0 }, (d.sheet && d.sheet.off) || {});
  for (const k of ['segs', 'dims', 'texts', 'areas', 'objs', 'custom']) if (!Array.isArray(o[k])) o[k] = [];
  for (const s of o.segs) { if (s.dm === undefined) s.dm = s.manual ? 1 : 0; if (!s.col) s.col = '#000000'; if (!s.side) s.side = 1; }
  return o;
}

let S = newDoc();
let view = { s: 0.1, ox: 80, oy: 80 };
const ui = { tool: 'line', ortho: true, snapL: true, snapG: true, step: 100, grid: true, showDims: true, dimMode: 'auto', color: '#000000', pinned: false, snapO: true };
const st = { start: null, chainStart: null, buf: '', mouse: { x: 0, y: 0 }, w: { x: 0, y: 0 }, shift: false, space: false,
             pan: null, dimP1: null, dimP2: null, dimEff: 'a', sel: null, drag: null, hoverFace: null, snap: null, place: null };
let W = 800, H = 600, dpr = 1, raf = 0, hist = [], redo = [];

/* ---------- pomocnicze ---------- */
const X = x => x * view.s + view.ox, Y = y => y * view.s + view.oy;
const S2 = p => ({ x: X(p.x), y: Y(p.y) });
const toW = (px, py) => ({ x: (px - view.ox) / view.s, y: (py - view.oy) / view.s });
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const fmt = v => (Math.round(v * 10) / 10).toLocaleString('pl-PL', { maximumFractionDigits: 1, useGrouping: false });
const line = (x1, y1, x2, y2) => { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
const redraw = () => { if (!raf) raf = requestAnimationFrame(() => { raf = 0; drawScene({}); }); };
const same = (a, b) => Math.abs(a.x - b.x) < 0.01 && Math.abs(a.y - b.y) < 0.01;
const slen = s => Math.hypot(s.b.x - s.a.x, s.b.y - s.a.y);
const gridSnap = v => Math.round(v / ui.step) * ui.step;
const getSeg = id => S.segs.find(s => s.id === id);

function pts(ignore) {
  const m = new Map();
  for (const s of S.segs) { if (ignore && ignore.has(s.id)) continue;
    for (const p of [s.a, s.b]) { const k = p.x.toFixed(2) + '|' + p.y.toFixed(2); if (!m.has(k)) m.set(k, p); } }
  return [...m.values()];
}
function closestOn(s, p) {
  const dx = s.b.x - s.a.x, dy = s.b.y - s.a.y, l2 = dx * dx + dy * dy;
  const t = l2 ? clamp(((p.x - s.a.x) * dx + (p.y - s.a.y) * dy) / l2, 0, 1) : 0;
  return { x: s.a.x + t * dx, y: s.a.y + t * dy };
}
// przecięcie odcinka z prostą poziomą (y=c) lub pionową (x=c)
function crossAxis(s, axis, c) {
  const a = s.a, b = s.b, k = axis === 'h' ? 'y' : 'x', o = axis === 'h' ? 'x' : 'y';
  if (Math.abs(b[k] - a[k]) < 1e-9) return null;
  const t = (c - a[k]) / (b[k] - a[k]); if (t < -1e-9 || t > 1 + 1e-9) return null;
  const r = {}; r[k] = c; r[o] = a[o] + t * (b[o] - a[o]); return r;
}

/* ---------- przyciąganie: punkt > linia > osie punktów > siatka ---------- */
function snapPt(o) {
  o = o || {}; const ig = o.ignore, from = o.from, m = st.mouse, w = st.w, guides = [];
  let best = null, bd = 12;
  for (const p of snapPts(ig)) { if (from && same(p, from)) continue; const d = Math.hypot(X(p.x) - m.x, Y(p.y) - m.y); if (d < bd) { bd = d; best = p; } }
  if (best) return { x: best.x, y: best.y, kind: 'point', guides };
  let x = w.x, y = w.y, axis = null;
  if (from && o.ortho) { const dx = w.x - from.x, dy = w.y - from.y; if (Math.abs(dx) >= Math.abs(dy)) { axis = 'x'; y = from.y; } else { axis = 'y'; x = from.x; } }
  if (ui.snapL) {
    if (axis) {
      let bi = null, bdd = 12;
      for (const s of snapSegs(ig)) { if (ig && ig.has(s.id)) continue;
        const I = axis === 'x' ? crossAxis(s, 'h', from.y) : crossAxis(s, 'v', from.x);
        if (!I || same(I, from)) continue;
        if (axis === 'x' ? (I.x - from.x) * (x - from.x) < 0 : (I.y - from.y) * (y - from.y) < 0) continue;
        const d = Math.hypot(X(I.x) - X(x), Y(I.y) - Y(y)); if (d < bdd) { bdd = d; bi = I; } }
      if (bi) return { x: bi.x, y: bi.y, kind: 'line', guides };
    } else {
      let bp = null, bdd = 10;
      for (const s of snapSegs(ig)) { if (ig && ig.has(s.id)) continue; const q = closestOn(s, w);
        const d = Math.hypot(X(q.x) - m.x, Y(q.y) - m.y); if (d < bdd) { bdd = d; bp = q; } }
      if (bp) return { x: bp.x, y: bp.y, kind: 'line', guides };
    }
  }
  let ax = false, ay = false;
  if (ui.snapL) for (const p of snapPts(ig)) {
    if (from && same(p, from)) continue;
    if (!ax && axis !== 'y' && Math.abs(X(p.x) - X(x)) < 8) { x = p.x; ax = true; guides.push({ axis: 'x', v: p.x }); }
    if (!ay && axis !== 'x' && Math.abs(Y(p.y) - Y(y)) < 8) { y = p.y; ay = true; guides.push({ axis: 'y', v: p.y }); }
  }
  if (ui.snapG) { if (!ax && axis !== 'y') x = gridSnap(x); if (!ay && axis !== 'x') y = gridSnap(y); }
  return { x, y, kind: (ax || ay) ? 'align' : ui.snapG ? 'grid' : 'free', guides };
}

/* ---------- graf płaski i zamknięte obszary ---------- */
function segInter(a, b) {
  const rx = a.b.x - a.a.x, ry = a.b.y - a.a.y, sx = b.b.x - b.a.x, sy = b.b.y - b.a.y, den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-9) return null;
  const qx = b.a.x - a.a.x, qy = b.a.y - a.a.y, t = (qx * sy - qy * sx) / den, u = (qx * ry - qy * rx) / den, e = 1e-9;
  if (t < -e || t > 1 + e || u < -e || u > 1 + e) return null;
  return { x: a.a.x + t * rx, y: a.a.y + t * ry };
}
function pointInPoly(p, poly) {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const a = poly[i], b = poly[j];
    if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) c = !c;
  }
  return c;
}
function interiorPt(poly) {
  let cy = 0, y0 = Infinity, y1 = -Infinity; for (const p of poly) { cy += p.y; y0 = Math.min(y0, p.y); y1 = Math.max(y1, p.y); } cy /= poly.length;
  for (const f of [0, .13, -.13, .27, -.27, .4, -.4]) {
    const yy = cy + f * (y1 - y0), xs = [];
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y <= yy) !== (b.y <= yy)) xs.push(a.x + (yy - a.y) / (b.y - a.y) * (b.x - a.x));
    }
    xs.sort((p, q) => p - q); let bw = 0, bx = null;
    for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > bw) { bw = xs[i + 1] - xs[i]; bx = (xs[i] + xs[i + 1]) / 2; }
    if (bx !== null && bw > 1) return { x: bx, y: yy };
  }
  return { x: poly[0].x, y: poly[0].y };
}
let faceCache = { key: '', faces: [] };
function faces() {
  const key = S.segs.map(s => s.a.x + ',' + s.a.y + ',' + s.b.x + ',' + s.b.y).join(';');
  if (key === faceCache.key) return faceCache.faces;
  faceCache = { key, faces: buildFaces() }; return faceCache.faces;
}
function buildFaces() {
  const sg = S.segs.filter(s => slen(s) > 0.5);
  if (sg.length < 3) return [];
  const nodes = [], map = new Map();
  const nid = p => { const k = Math.round(p.x * 100) + '|' + Math.round(p.y * 100); let i = map.get(k); if (i === undefined) { i = nodes.length; nodes.push({ x: p.x, y: p.y }); map.set(k, i); } return i; };
  const on = sg.map(s => [{ t: 0, p: s.a }, { t: 1, p: s.b }]);
  for (let i = 0; i < sg.length; i++) for (let j = i + 1; j < sg.length; j++) {
    const I = segInter(sg[i], sg[j]); if (!I) continue;
    for (const [k, s] of [[i, sg[i]], [j, sg[j]]]) { const L2 = (s.b.x - s.a.x) ** 2 + (s.b.y - s.a.y) ** 2; on[k].push({ t: ((I.x - s.a.x) * (s.b.x - s.a.x) + (I.y - s.a.y) * (s.b.y - s.a.y)) / L2, p: I }); }
  }
  const edges = [], seen = new Set();
  on.forEach(list => { list.sort((a, b) => a.t - b.t);
    for (let k = 0; k + 1 < list.length; k++) { const u = nid(list[k].p), v = nid(list[k + 1].p); if (u === v) continue;
      const key = Math.min(u, v) + '_' + Math.max(u, v); if (!seen.has(key)) { seen.add(key); edges.push([u, v]); } } });
  const par = nodes.map((_, i) => i); const fd = i => par[i] === i ? i : (par[i] = fd(par[i]));
  for (const [u, v] of edges) par[fd(u)] = fd(v);
  const from = [], to = [], outs = nodes.map(() => []);
  edges.forEach(([u, v], e) => { from[2 * e] = u; to[2 * e] = v; from[2 * e + 1] = v; to[2 * e + 1] = u; outs[u].push(2 * e); outs[v].push(2 * e + 1); });
  const ang = h => Math.atan2(nodes[to[h]].y - nodes[from[h]].y, nodes[to[h]].x - nodes[from[h]].x), pos = [];
  outs.forEach(a => { a.sort((p, q) => ang(p) - ang(q)); a.forEach((h, i) => pos[h] = i); });
  const vis = new Array(from.length).fill(false), out = [];
  for (let h0 = 0; h0 < from.length; h0++) {
    if (vis[h0]) continue; const poly = []; let h = h0, g = 0;
    while (!vis[h] && g++ < 5000) { vis[h] = true; poly.push(nodes[from[h]]); const tw = h ^ 1, arr = outs[to[h]]; h = arr[(pos[tw] - 1 + arr.length) % arr.length]; }
    let a = 0; for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length]; a += p.x * q.y - q.x * p.y; } a /= 2;
    if (a > 100) out.push({ poly: poly.map(p => ({ x: p.x, y: p.y })), area: a, comp: fd(from[h0]) });
  }
  for (const f of out) f.ip = interiorPt(f.poly);
  for (const f of out) f.holes = out.filter(g => g !== f && g.comp !== f.comp && g.area < f.area && pointInPoly(g.poly[0], f.poly));
  return out;
}
function faceAt(p) {
  let b = null; for (const f of faces()) if (pointInPoly(p, f.poly) && (!b || f.area < b.area)) b = f; return b;
}
function areaFaces() { // dopasowanie oznaczeń do aktualnych ścian
  const used = new Set(), res = [];
  for (const a of S.areas) { const f = faceAt(a.pt); if (f && !used.has(f)) { used.add(f); res.push({ a, f }); } }
  return res;
}

/* ---------- historia ---------- */
function snapshot() { return JSON.stringify(S); }
function pushSnap(str) { hist.push(str); if (hist.length > 200) hist.shift(); redo.length = 0; }
function push() { pushSnap(snapshot()); }
function resetDraw() { st.start = null; st.chainStart = null; st.buf = ''; st.dimP1 = null; st.dimP2 = null; }
function loadState(str) { S = migrate(JSON.parse(str)); st.sel = null; resetDraw(); syncUI(); redraw(); }
function undo() { if (!hist.length) return; redo.push(snapshot()); loadState(hist.pop()); }
function redoDo() { if (!redo.length) return; hist.push(snapshot()); loadState(redo.pop()); }

/* ---------- strona zewnętrzna odcinka ---------- */
function outwardSide(seg) {
  const P = pts().concat([seg.a, seg.b]); let cx = 0, cy = 0; for (const p of P) { cx += p.x; cy += p.y; } cx /= P.length; cy /= P.length;
  const L = Math.hypot(seg.b.x - seg.a.x, seg.b.y - seg.a.y) || 1, nx = -(seg.b.y - seg.a.y) / L, ny = (seg.b.x - seg.a.x) / L;
  return (((seg.a.x + seg.b.x) / 2 - cx) * nx + ((seg.a.y + seg.b.y) / 2 - cy) * ny) >= 0 ? 1 : -1;
}
function recalcSides(force) { for (const s of S.segs) if (force || !s.userSide) { s.side = outwardSide(s); if (force) s.userSide = false; } }
