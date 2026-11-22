
/* ---------- ikony ---------- */
const ICONS = {
  snapo: '<rect x="3" y="8" width="11" height="8" rx="1"/><path d="M14 12h7M17 9v6"/><circle cx="21" cy="12" r="1.4"/>', rot: '<path d="M20 12a8 8 0 1 1-3-6.2"/><path d="M20 4v5h-5"/>',
  cat: '<rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><path d="M13 17h8M17 13v8"/>',
  all: '<rect x="4" y="4" width="16" height="16" rx="1" stroke-dasharray="3 2.5"/><path d="M9 9l6 2-2.5 1L11 15z"/>', max: '<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>', frame: '<rect x="3" y="3" width="18" height="18"/><rect x="7" y="7" width="10" height="10" stroke-width="1"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>', pin: '<path d="M9 3h6l-1 6 4 3v2H6v-2l4-3z"/><path d="M12 14v7"/>', down: '<path d="M6 9l6 6 6-6"/>',
  marg: '<rect x="3" y="3" width="18" height="18" rx="1"/><rect x="7" y="7" width="10" height="10" stroke-dasharray="2.5 2.5"/>', pdf: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 14h6M9 17h4"/>',
  logo: '<path d="M3 20V8l9-5 9 5v12z"/><path d="M9 20v-6h6v6"/>', proj: '<path d="M9 4h6v3H9z"/><path d="M7 5H5a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2"/><path d="M8 12h8M8 16h5"/>',
  new: '<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4"/>', open: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  save: '<path d="M5 3h12l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h9v7"/>', export: '<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 19h16"/>',
  cad: '<path d="M4 20L20 4"/><path d="M4 20h6M4 20v-6"/><path d="M14 4h6v6"/>', vec: '<path d="M4 18c4-12 12-12 16 0"/><circle cx="4" cy="18" r="1.6"/><circle cx="20" cy="18" r="1.6"/><circle cx="12" cy="7" r="1.6"/>',
  img: '<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="1.5"/><path d="M3 17l5-5 4 4 3-3 6 6"/>', print: '<path d="M7 9V3h10v6"/><rect x="4" y="9" width="16" height="8" rx="2"/><path d="M7 14h10v7H7z"/>',
  help: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 1-1 1.7M12 17h.01"/>', sel: '<path d="M5 3l14 8-6 2-2 6z"/>',
  line: '<path d="M4 20L20 4"/><circle cx="4" cy="20" r="1.8"/><circle cx="20" cy="4" r="1.8"/>', dim: '<path d="M3 17h18M3 13v8M21 13v8"/><path d="M8 8h8M10 6l-2 2 2 2M14 6l2 2-2 2"/>',
  text: '<path d="M5 6V4h14v2M12 4v16M9 20h6"/>', area: '<path d="M4 7l8-4 8 4v10l-8 4-8-4z"/><path d="M8 15l8-8M8 11l4-4M12 19l8-8"/>',
  ortho: '<path d="M5 19V5M5 19h14"/><path d="M5 13h6v6"/>', magnet: '<path d="M6 3v8a6 6 0 0 0 12 0V3h-4v8a2 2 0 0 1-4 0V3z"/><path d="M6 7h4M14 7h4"/>',
  grid: '<path d="M4 4h16v16H4zM4 12h16M12 4v16"/>', eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  dimv: '<path d="M3 12h18M3 7v10M21 7v10"/><path d="M10 9l4 6"/>', undo: '<path d="M9 7L4 12l5 5M4 12h9a6 6 0 0 1 0 8h-3"/>', redo: '<path d="M15 7l5 5-5 5M20 12h-9a6 6 0 0 0 0 8h3"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/>', out: '<rect x="8" y="8" width="8" height="8"/><path d="M3 3h18v18H3z" stroke-dasharray="3 3"/>',
  fit: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>', table: '<rect x="3" y="4" width="18" height="16" rx="1"/><path d="M3 9h18M3 14h18M10 9v11"/>', center: '<circle cx="12" cy="12" r="3"/><path d="M12 3v4M12 17v4M3 12h4M17 12h4"/>'
};
document.querySelectorAll('i[data-i]').forEach(e => { e.innerHTML = '<svg viewBox="0 0 24 24">' + (ICONS[e.dataset.i] || '') + '</svg>'; });

/* ---------- rysowanie linii ---------- */
function computeEnd() {
  const a = st.start, m = st.w, isO = ui.ortho !== st.shift, dx = m.x - a.x, dy = m.y - a.y;
  const typed = st.buf !== '' ? parseFloat(st.buf.replace(',', '.')) : NaN;
  if (!isNaN(typed) && typed > 0) {
    let ux, uy;
    if (isO) { if (Math.abs(dx) >= Math.abs(dy)) { ux = dx < 0 ? -1 : 1; uy = 0; } else { ux = 0; uy = dy < 0 ? -1 : 1; } }
    else { const l = Math.hypot(dx, dy); if (l < 1e-9) { ux = 1; uy = 0; } else { ux = dx / l; uy = dy / l; } }
    return { x: a.x + ux * typed, y: a.y + uy * typed, kind: 'typed', manual: true, guides: [] };
  }
  return snapPt({ from: a, ortho: isO });
}
function commitSeg(e) {
  const a = st.start;
  for (const p of pts()) if (Math.hypot(p.x - e.x, p.y - e.y) < 0.5) { e = Object.assign({}, e, { x: p.x, y: p.y }); break; }
  if (Math.hypot(e.x - a.x, e.y - a.y) < 0.5) return;
  push();
  const seg = { id: S.id++, a: { x: a.x, y: a.y }, b: { x: e.x, y: e.y }, dm: e.manual ? 1 : 0, col: ui.color, side: 1, userSide: false };
  seg.side = outwardSide(seg); S.segs.push(seg);
  const closes = st.chainStart && same(e, st.chainStart);
  st.start = { x: e.x, y: e.y }; st.buf = ''; if (closes) finishChain();
}
function finishChain() { st.start = null; st.chainStart = null; st.buf = ''; recalcSides(false); }

/* ---------- zaznaczanie i edycja ---------- */
function distSeg(px, py, a, b) {
  const dx = b.x - a.x, dy = b.y - a.y, l2 = dx * dx + dy * dy; let t = l2 ? ((px - a.x) * dx + (py - a.y) * dy) / l2 : 0; t = clamp(t, 0, 1);
  return Math.hypot(px - (a.x + t * dx), py - (a.y + t * dy));
}
function hit(px, py) {
  if (st.sel && st.sel.t === 'all') { const r = allRect(); if (r) { if (S.sheet.fmt !== 'free' && Math.abs(px - r.x1) < 10 && Math.abs(py - r.y1) < 10) return { t: 'allh' }; if (px >= r.x0 && px <= r.x1 && py >= r.y0 && py <= r.y1) return { t: 'all' }; } }
  if (S.sheet.fmt !== 'free' && S.sheet.tb && S.sheet.pw && st.sel && st.sel.t === 'tb') { const d = tbDims(), sh = S.sheet, k = sh.N * view.s; if (Math.abs(px - (X(sh.fx) + d.x * k)) < 10 && Math.abs(py - (Y(sh.fy) + d.y * k)) < 10) return { t: 'tbh' }; }
  for (const p of pts()) if (Math.hypot(X(p.x) - px, Y(p.y) - py) < 9) return { t: 'vtx', x: p.x, y: p.y };
  const w = toW(px, py), pad = 40;
  { const ho = hitObj(w); if (ho) return ho; }
  for (let i = S.texts.length - 1; i >= 0; i--) { const t = S.texts[i], b = textBox(t); if (w.x >= t.x - pad && w.x <= t.x + b.w + pad && w.y >= t.y - pad && w.y <= t.y + b.h + pad) return { t: 'text', id: t.id }; }
  if (S.sheet.fmt !== 'free' && S.sheet.tb && S.sheet.pw) { const r = tbRectW(); if (w.x >= r.x0 && w.x <= r.x1 && w.y >= r.y0 && w.y <= r.y1) return { t: 'tb' }; }
  for (let i = S.segs.length - 1; i >= 0; i--) { const s = S.segs[i]; if (distSeg(px, py, S2(s.a), S2(s.b)) < 7) return { t: 'seg', id: s.id }; }
  for (let i = S.dims.length - 1; i >= 0; i--) { const d = S.dims[i], g = dimGeom(d.p1, d.p2, dimU(d.mode, d.p1, d.p2), d.c); if (distSeg(px, py, S2(g.q1), S2(g.q2)) < 7) return { t: 'dim', id: d.id }; }
  for (const s of S.segs) if (s.dm) { const q = segDimParams(s), g = dimGeom(s.a, s.b, q.u, q.c); if (distSeg(px, py, S2(g.q1), S2(g.q2)) < 7) return { t: 'seg', id: s.id }; }
  const f = faceAt(w); if (f) { const ar = areaFaces().find(x => x.f === f); if (ar) return { t: 'area', id: ar.a.id }; }
  return null;
}
const lensMap = () => new Map(S.segs.map(s => [s.id, slen(s)]));
function updDm(ids, lens, manualId) { for (const s of S.segs) if (ids.has(s.id)) { if (s.id === manualId) s.dm = 1; else if (Math.abs(slen(s) - lens.get(s.id)) > 0.01) s.dm = 2; } }
function refsAt(p) {
  const refs = [], ids = new Set();
  for (const s of S.segs) for (const e of ['a', 'b']) if (same(s[e], p)) { refs.push(s[e]); ids.add(s.id); }
  for (const d of S.dims) for (const k of ['p1', 'p2']) if (same(d[k], p)) refs.push(d[k]);
  return { refs, ids };
}
function moveVertex(old, nw, manualId) { // zmiana współrzędnych wierzchołka z przeliczeniem wymiarów
  const lens = lensMap(), r = refsAt(old); for (const p of r.refs) { p.x = nw.x; p.y = nw.y; } updDm(r.ids, lens, manualId); recalcSides(false);
}
function startDrag(h, px, py) {
  const d = { sn: snapshot(), moved: false, sx: px, sy: py, w0: { x: st.w.x, y: st.w.y } };
  if (h.t === 'vtx') { const r = refsAt(h); Object.assign(d, { kind: 'vtx', refs: r.refs, ids: r.ids, lens: lensMap() }); }
  else if (h.t === 'seg') {
    const s = getSeg(h.id), A = refsAt(s.a), B = refsAt(s.b), ids = new Set([...A.ids, ...B.ids]);
    Object.assign(d, { kind: 'seg', A: A.refs, B: B.refs, a0: { x: s.a.x, y: s.a.y }, b0: { x: s.b.x, y: s.b.y }, ids, lens: lensMap() });
  } else if (h.t === 'obj') { const o = S.objs.find(o => o.id === h.id); Object.assign(d, { kind: 'obj', o, x0: o.x, y0: o.y }); }
  else if (h.t === 'text') { const t = S.texts.find(t => t.id === h.id); Object.assign(d, { kind: 'text', t, x0: t.x, y0: t.y }); }
  else if (h.t === 'dim') { const t = S.dims.find(t => t.id === h.id); Object.assign(d, { kind: 'dim', t, c0: t.c }); }
  else if (h.t === 'tbh') { Object.assign(d, { kind: 'tbs', rx: tbRectW().x1 }); }
  else if (h.t === 'all') { Object.assign(d, { kind: 'allm', lx: px, ly: py }); }
  else if (h.t === 'allh') { const sh = S.sheet, bb = bbox(); if (!bb || sh.fmt === 'free') return;
    Object.assign(d, { kind: 'alls', kp: sh.N * view.s, X0: X(sh.fx), Y0: Y(sh.fy), p0x: (bb.x0 - sh.fx) / sh.N, p0y: (bb.y0 - sh.fy) / sh.N, bx0: bb.x0, by0: bb.y0, bw: Math.max(bb.x1 - bb.x0, 1), ax: X(bb.x0) }); }
  else return; st.drag = d;
}
function doDrag() {
  const d = st.drag; if (!d) return;
  if (!d.moved) { if (Math.hypot(st.mouse.x - d.sx, st.mouse.y - d.sy) < 3) return; d.moved = true; }
  const dx = st.w.x - d.w0.x, dy = st.w.y - d.w0.y, isO = ui.ortho !== st.shift;
  if (d.kind === 'vtx') { const p = snapPt({ ignore: d.ids, ortho: false }); st.snap = p; for (const r of d.refs) { r.x = p.x; r.y = p.y; } updDm(d.ids, d.lens); }
  else if (d.kind === 'seg') {
    let mx = dx, my = dy; const L = Math.hypot(d.b0.x - d.a0.x, d.b0.y - d.a0.y) || 1, n = { x: -(d.b0.y - d.a0.y) / L, y: (d.b0.x - d.a0.x) / L };
    if (isO) { const k = dx * n.x + dy * n.y; mx = n.x * k; my = n.y * k; }
    if (ui.snapG) { if (Math.abs(n.x) > .999) mx = gridSnap(d.a0.x + mx) - d.a0.x; else if (Math.abs(n.y) > .999) my = gridSnap(d.a0.y + my) - d.a0.y; else if (!isO) { mx = gridSnap(d.a0.x + mx) - d.a0.x; my = gridSnap(d.a0.y + my) - d.a0.y; } }
    for (const r of d.A) { r.x = d.a0.x + mx; r.y = d.a0.y + my; } for (const r of d.B) { r.x = d.b0.x + mx; r.y = d.b0.y + my; } updDm(d.ids, d.lens);
  } else if (d.kind === 'obj') { const o = d.o; o.x = d.x0 + dx; o.y = d.y0 + dy; if (ui.snapG && !ui.snapL) { o.x = gridSnap(o.x); o.y = gridSnap(o.y); } const sh = objSnapShift(o, new Set(['o' + o.id])); if (sh) { o.x += sh.dx; o.y += sh.dy; } else if (ui.snapG) { o.x = gridSnap(o.x); o.y = gridSnap(o.y); } }
  else if (d.kind === 'text') { let x = d.x0 + dx, y = d.y0 + dy; if (ui.snapG) { x = gridSnap(x); y = gridSnap(y); } d.t.x = x; d.t.y = y; }
  else if (d.kind === 'dim') { const u = dimU(d.t.mode, d.t.p1, d.t.p2), n = { x: -u.y, y: u.x }; d.t.c = d.c0 + dx * n.x + dy * n.y; }
  else if (d.kind === 'allm') { const sh = S.sheet; if (sh.fmt === 'free' || !sh.pw) return; const dxs = st.mouse.x - d.lx, dys = st.mouse.y - d.ly; d.lx = st.mouse.x; d.ly = st.mouse.y;
    sh.fx -= dxs / view.s; sh.fy -= dys / view.s; view.ox += dxs; view.oy += dys; }
  else if (d.kind === 'alls') { const sh = S.sheet, Nn = clamp(Math.round(d.bw * d.kp / Math.max(40, st.mouse.x - d.ax) * 100) / 100, 0.05, 5000);
    sh.N = Nn; sh.scale = String(Nn); sh.fx = d.bx0 - d.p0x * Nn; sh.fy = d.by0 - d.p0y * Nn; view.s = d.kp / Nn; view.ox = d.X0 - sh.fx * view.s; view.oy = d.Y0 - sh.fy * view.s; }
  else if (d.kind === 'tbs') { const sh = S.sheet; sh.tbs = clamp(((d.rx - st.w.x) / sh.N) / tbDims().W0, 0.3, 1.6); }
  redraw();
}
function endDrag() { const d = st.drag; st.drag = null; if (d && d.moved) { pushSnap(d.sn); recalcSides(false); if (d.kind === 'allm' || d.kind === 'alls') { syncOff(); syncUI(); } } redraw(); }
function deleteSel() {
  const s = st.sel; if (!s) return;
  if (s.t === 'seg') { push(); S.segs = S.segs.filter(x => x.id !== s.id); }
  else if (s.t === 'dim') { push(); S.dims = S.dims.filter(x => x.id !== s.id); }
  else if (s.t === 'text') { push(); S.texts = S.texts.filter(x => x.id !== s.id); }
  else if (s.t === 'obj') { push(); S.objs = S.objs.filter(x => x.id !== s.id); }
  else if (s.t === 'area') { push(); S.areas = S.areas.filter(x => x.id !== s.id); }
  else if (s.t === 'tb') { push(); S.sheet.tb = false; if (S.sheet.fmt !== 'free') layoutSheet(); }
  else if (s.t === 'vtx') { const r = refsAt(s); if (!r.ids.size) return; push(); S.segs = S.segs.filter(x => !r.ids.has(x.id)); }
  st.sel = null; redraw();
}

/* ---------- okna dialogowe ---------- */
function h(tag, props, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props || {})) { if (k === 'class') e.className = v; else if (k === 'text') e.textContent = v; else if (k.startsWith('on')) e[k] = v; else e.setAttribute(k, v); }
  for (const c of kids.flat()) e.append(c); return e;
}
const fld = (label, el, cls) => h('label', { class: 'f' + (cls ? ' ' + cls : '') }, h('span', { text: label }), el);
function modal(title, build, onOk, keep) {
  const d = $('dlg'), body = $('db'); $('dt').textContent = title; body.innerHTML = ''; const get = build(body);
  body.onkeydown = e => { if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') { e.preventDefault(); $('dok').click(); } };
  const done = () => { d.removeEventListener('close', done); if (d.returnValue === 'ok' || (keep && d.returnValue !== 'cancel')) onOk(get()); };
  d.addEventListener('close', done); d.returnValue = ''; d.showModal();
  const f = body.querySelector('input:not([type=checkbox]),textarea'); if (f) setTimeout(() => f.focus(), 30);
}
const dialogOpen = () => $('dlg').open || $('hlp').open;
function areaDialog(face, existing, pt) {
  modal(existing ? 'Obszar – edycja' : 'Oznacz zamknięty obszar', body => {
    const kind = h('select', {}, ...AREA_KINDS.map(([v, n]) => h('option', { value: v, text: n })));
    kind.value = existing ? existing.kind : 'space'; const name = h('input', { type: 'text', placeholder: 'np. Salon, Łazienka' }); name.value = existing ? existing.name || '' : '';
    body.append(h('div', { text: 'Powierzchnia obszaru: ' + (face.area / 1e6).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²', style: 'font-weight:600' }), fld('Rodzaj', kind), fld('Nazwa / opis (np. Salon; dla materiałów – opcjonalny podpis)', name));
    return () => ({ kind: kind.value, name: name.value.trim() });
  }, v => {
    push();
    if (existing) { if (v.kind === 'none') S.areas = S.areas.filter(a => a !== existing); else { existing.kind = v.kind; existing.name = v.name; } }
    else if (v.kind !== 'none') S.areas.push({ id: S.id++, pt: { x: pt.x, y: pt.y }, kind: v.kind, name: v.name });
    redraw();
  });
}
function textDialog(t, p) {
  modal(t ? 'Pole tekstowe – edycja' : 'Nowe pole tekstowe', body => {
    const tx = h('textarea', {}); tx.value = t ? t.txt : ''; const sz = h('input', { type: 'number', min: 10, step: 10 }); sz.value = t ? t.h : Math.max(10, Math.round(16 / view.s / 10) * 10);
    const bd = h('input', { type: 'checkbox' }); bd.checked = t ? !!t.bold : false; const bx = h('input', { type: 'checkbox' }); bx.checked = t ? !!t.box : false;
    body.append(fld('Treść (Enter = nowa linia)', tx), fld('Wysokość liter [mm w skali rysunku]', sz), fld('Pogrubienie', bd, 'chk'), fld('Obramowanie', bx, 'chk'));
    return () => ({ txt: tx.value, h: Math.max(10, parseFloat(sz.value) || 150), bold: bd.checked, box: bx.checked });
  }, v => {
    if (!v.txt.trim()) return; push();
    if (t) Object.assign(t, v); else S.texts.push(Object.assign({ id: S.id++, x: p.x, y: p.y, col: ui.color }, v)); redraw();
  });
}
function lengthDialog(s) {
  modal('Długość odcinka [mm]', body => {
    const inp = h('input', { type: 'number', step: 'any', min: 1 }); inp.value = Math.round(slen(s) * 10) / 10;
    body.append(fld('Nowa długość – koniec B przesunie się wzdłuż odcinka, sąsiednie wymiary przeliczą się automatycznie', inp)); setTimeout(() => inp.select(), 40); return () => parseFloat(inp.value);
  }, L => {
    if (!(L > 0)) return; push(); const l0 = slen(s) || 1, u = { x: (s.b.x - s.a.x) / l0, y: (s.b.y - s.a.y) / l0 };
    moveVertex({ x: s.b.x, y: s.b.y }, { x: s.a.x + u.x * L, y: s.a.y + u.y * L }, s.id); redraw();
  });
}
function selectAll() { if (ui.tool !== 'sel') setTool('sel'); st.sel = { t: 'all' }; redraw(); }
function posDialog() {
  const sh = S.sheet; if (sh.fmt === 'free' || !sh.pw) return alert('Wybierz format arkusza (A4–A0), aby ustawić położenie i skalę rysunku.');
  modal('Rysunek na arkuszu', body => {
    const sc = h('input', { type: 'number', min: 0.01, step: 'any' }), ox = h('input', { type: 'number', step: 0.5 }), oy = h('input', { type: 'number', step: 0.5 });
    sc.value = sh.N; ox.value = Math.round(sh.off.x * 10) / 10; oy.value = Math.round(sh.off.y * 10) / 10;
    body.append(fld('Skala rysunku 1 :', sc), h('div', { class: 'g2' }, fld('Przesunięcie w poziomie [mm na kartce]', ox), fld('Przesunięcie w pionie [mm na kartce]', oy)),
      h('div', { class: 'note', text: 'Przesunięcie 0 / 0 = rysunek wyśrodkowany w polu roboczym. Wartości dodatnie przesuwają rysunek w prawo i w dół.' }));
    return () => ({ N: parseFloat(String(sc.value).replace(',', '.')), x: parseFloat(ox.value) || 0, y: parseFloat(oy.value) || 0 });
  }, v => { push(); if (v.N > 0) S.sheet.scale = String(v.N); S.sheet.off = { x: v.x, y: v.y }; st.customScale = true; afterSheetChange(); fit(); });
}
function projDialog() {
  modal('Projekt – opis i tabelka rysunkowa', body => {
    const name = h('input', { type: 'text' }); name.value = S.proj.name; const desc = h('textarea', {}); desc.value = S.proj.desc;
    const list = h('div', { style: 'display:flex;flex-direction:column;gap:6px' });
    const row = (l, v) => { const r = h('div', { class: 'tbrow' }), a = h('input', { type: 'text', placeholder: 'Nazwa pola' }), b = h('input', { type: 'text', placeholder: 'Wartość' }); a.value = l; b.value = v;
      r.append(a, b, h('button', { type: 'button', class: 'xb', text: '×', onclick: () => r.remove() })); list.append(r); };
    S.proj.tb.forEach(f => row(f.l, f.v));
    const showTb = h('input', { type: 'checkbox' }); showTb.checked = true;
    body.append(fld('Nazwa projektu', name), fld('Opis projektu', desc), h('div', { class: 'f' }, h('span', { text: 'Tabelka rysunkowa – pola (nazwa / wartość)' }), list),
      h('button', { type: 'button', class: 'mini', text: '+ Dodaj pole', onclick: () => row('', '') }),
      fld('Wstaw tabelkę na arkusz (jako obiekt – można ją zaznaczyć i zmniejszyć)', showTb, 'chk'),
      h('div', { class: 'note', text: 'Tabelka jest widoczna po wybraniu formatu arkusza (A4–A0). W wartościach działają znaczniki: {skala}, {data}, {format}.' }));
    return () => ({ showTb: showTb.checked, proj: { name: name.value.trim() || 'Bez nazwy', desc: desc.value, tb: [...list.children].map(r => ({ l: r.children[0].value, v: r.children[1].value })).filter(f => f.l || f.v) } });
  }, v => { push(); S.proj = v.proj; S.sheet.tb = v.showTb; afterSheetChange(); if (S.sheet.tb && S.sheet.fmt !== 'free') st.sel = { t: 'tb' }; redraw(); }, true);
}
function marginDialog() {
  modal('Marginesy druku [mm]', body => {
    const m = S.sheet.m, ins = {}, grid = h('div', { class: 'g2' });
    for (const [k, l] of [['t', 'Górny'], ['b', 'Dolny'], ['l', 'Lewy'], ['r', 'Prawy']]) { const i = h('input', { type: 'number', min: 0, max: 100, step: 0.5 }); i.value = m[k]; ins[k] = i; grid.append(fld(l, i)); }
    const pre = (txt, a) => h('button', { type: 'button', class: 'mini', text: txt, onclick: () => { for (const k of ['t', 'r', 'b', 'l']) ins[k].value = a[k]; } });
    body.append(grid, h('div', { style: 'display:flex;gap:6px;flex-wrap:wrap' }, pre('Brak (0)', { t: 0, r: 0, b: 0, l: 0 }), pre('5 mm', { t: 5, r: 5, b: 5, l: 5 }), pre('10 mm', { t: 10, r: 10, b: 10, l: 10 }),
      pre('15 mm (domyślne)', { t: 15, r: 15, b: 15, l: 15 }), pre('Do segregatora (lewy 25, reszta 10)', { t: 10, r: 10, b: 10, l: 25 })),
      h('div', { class: 'note', text: 'Przeglądarka nie udostępnia marginesów wybranej drukarki, więc nie da się ich pobrać automatycznie – wpisz je ręcznie (nieobjęty obszar druku to zwykle 3–6 mm). W oknie druku wybierz „Marginesy: brak” i skalę 100%; ramkę rysuje SimpleCAD.' }));
    const fr = h('input', { type: 'checkbox' }); fr.checked = !!S.sheet.frame; const fw = h('input', { type: 'number', min: 0.5, max: 10, step: 0.5 }); fw.value = S.sheet.frameW || 1;
    body.append(fld('Rysuj ramkę na wydruku (linia na krawędzi pola rysunku; marginesy bez ramki są niewidoczne)', fr, 'chk'), fld('Grubość ramki [px] (1 px ≈ 0,26 mm)', fw));
    return () => { const o = {}; for (const k of ['t', 'r', 'b', 'l']) o[k] = clamp(parseFloat(ins[k].value) || 0, 0, 100); return { m: o, frame: fr.checked, frameW: clamp(parseFloat(fw.value) || 1, 0.5, 10) }; };
  }, v => { push(); S.sheet.m = v.m; S.sheet.frame = v.frame; S.sheet.frameW = v.frameW; afterSheetChange(); fit(); });
}

/* ---------- widok i arkusz ---------- */
function fit() {
  const sh = S.sheet;
  if (sh.fmt !== 'free' && sh.pw) { const k = Math.min((W - 80) / (sh.pw * sh.N), (H - 80) / (sh.ph * sh.N)); view.s = k; view.ox = (W - sh.pw * sh.N * k) / 2 - sh.fx * k; view.oy = (H - sh.ph * sh.N * k) / 2 - sh.fy * k; redraw(); return; }
  const bb = bbox(); if (!bb) { view = { s: 0.1, ox: 80, oy: 80 }; redraw(); return; }
  const bw = Math.max(bb.x1 - bb.x0, 500), bh = Math.max(bb.y1 - bb.y0, 500), m = 90, s = clamp(Math.min((W - 2 * m) / bw, (H - 2 * m) / bh), 0.003, 3);
  view.s = s; view.ox = (W - (bb.x1 - bb.x0) * s) / 2 - bb.x0 * s; view.oy = (H - (bb.y1 - bb.y0) * s) / 2 - bb.y0 * s; redraw();
}
function afterSheetChange() { $('pn').textContent = S.proj.name; if (S.sheet.fmt !== 'free') layoutSheet(); syncUI(); redraw(); }
function resize() { const r = $('wrap').getBoundingClientRect(); dpr = window.devicePixelRatio || 1; W = r.width; H = r.height; cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); redraw(); }
function syncUI() {
  for (const [id, k] of [['cOrtho', 'ortho'], ['cSnapL', 'snapL'], ['cSnapG', 'snapG'], ['cSnapO', 'snapO'], ['cGrid', 'grid'], ['cDims', 'showDims']]) $(id).classList.toggle('on', ui[k]);
  $('cTb').classList.toggle('on', !!S.sheet.tb); $('snapStep').value = String(ui.step); $('dimMode').value = ui.dimMode;
  $('fFmt').value = S.sheet.fmt; $('fOri').value = S.sheet.orient; { const sc = String(S.sheet.scale), sel = $('fScl'), listed = [...sel.options].some(o => o.value === sc && o.value !== 'custom'), cu = !!st.customScale || !listed;
    sel.value = cu ? 'custom' : sc; $('fSclV').style.display = cu ? '' : 'none'; if (cu && document.activeElement !== $('fSclV')) $('fSclV').value = /^[\d.]+$/.test(sc) ? sc : S.sheet.N; }
  $('cFrame').classList.toggle('on', !!S.sheet.frame); $('pn').textContent = S.proj.name; $('colSw').style.background = ui.color;
  for (const [id, t] of [['tSel', 'sel'], ['tLine', 'line'], ['tDim', 'dim'], ['tText', 'text'], ['tArea', 'area']]) $(id).classList.toggle('on', ui.tool === t);
  $('toolName').textContent = { sel: 'Zaznacz', line: 'Linia', dim: 'Wymiar', text: 'Tekst', area: 'Obszar', place: 'Wstaw obiekt' }[ui.tool]; $('bPin').classList.toggle('on', !!ui.pinned); $('cat').classList.toggle('dim', ui.tool === 'place');
}
function setTool(t) { ui.tool = t; resetDraw(); st.sel = null; st.hoverFace = null; syncUI(); redraw(); }
function updateStatus() {
  const sk = { point: 'koniec odcinka', line: 'na linii', align: 'oś punktu', grid: 'siatka', free: 'swobodnie', typed: 'wpisana długość' };
  $('coords').textContent = 'X ' + fmt(st.w.x) + '   Y ' + fmt(-st.w.y) + ' mm' + (st.snap ? '  [' + (sk[st.snap.kind] || '') + ']' : '');
  let t = '';
  if (st.pan) t = 'Przesuwanie widoku…';
  else if (ui.tool === 'line') t = !st.start ? 'Kliknij, aby ustawić punkt początkowy (przyciąga do końców i linii, potem do siatki). Kółko – zoom, Spacja+przeciąganie – przesuwanie.'
    : st.buf !== '' ? 'Długość: ' + st.buf + ' mm – Enter lub klik zatwierdza, Backspace kasuje' : 'Klik = punkt końcowy • wpisz długość w mm + Enter • Shift – tryb 90°/swobodny • Esc/PPM – koniec ciągu';
  else if (ui.tool === 'dim') t = !st.dimP1 ? 'Wymiarowanie: kliknij pierwszy punkt.' : !st.dimP2 ? 'Kliknij drugi punkt (domyślnie pod kątem 90°, Shift – swobodnie).' : 'Kliknij, aby ustawić położenie linii wymiarowej. Tab – rodzaj wymiaru.';
  else if (ui.tool === 'text') t = 'Kliknij miejsce, w którym ma się pojawić pole tekstowe.';
  else if (ui.tool === 'place') t = 'Wstawianie obiektu: klik – wstaw • R – obróć o 90° • okna/drzwi przyciągają się do linii ściany (F/X – zawiasy/kierunek) • narożniki przyciągają się do punktów • Esc – koniec.';
  else if (ui.tool === 'area') t = 'Kliknij wewnątrz zamkniętego konturu, aby oznaczyć go jako przestrzeń lub ścianę (kontur musi być domknięty).';
  else t = 'Przeciągnij wierzchołek (kwadracik) lub odcinek. Enter/dwuklik – długość ręczna. M – rodzaj wymiaru, F – strona, Del – usuń.';
  if (ui.tool === 'sel' && st.sel && st.sel.t === 'all') t = S.sheet.fmt === 'free' ? 'Cały rysunek zaznaczony. Wybierz format arkusza (A4–A0), aby go skalować i pozycjonować na kartce.' : 'Cały rysunek: przeciągnij – przesuń na kartce, uchwyt w prawym dolnym rogu – skala, strzałki – precyzyjnie (Shift = 5 mm), Enter – wartości liczbowe.';
  if (ui.tool === 'sel' && st.sel && st.sel.t === 'tb') t = 'Tabelka: przeciągnij uchwyt w lewym górnym rogu, aby zmienić rozmiar (lub + / −). Dwuklik – edycja pól, Del – ukryj.';
  if (S.sheet.fmt !== 'free' && S.sheet.fits === false) t = '⚠ Rysunek nie mieści się w obszarze druku przy tej skali – zmień skalę lub format. ' + t;
  $('hint').textContent = t;
}

/* ---------- zdarzenia ---------- */
function updateMouse(e) { const r = cv.getBoundingClientRect(); st.mouse = { x: e.clientX - r.left, y: e.clientY - r.top }; st.w = toW(st.mouse.x, st.mouse.y); }
cv.addEventListener('pointerdown', e => {
  updateMouse(e); $('pal').classList.remove('open'); $('hmenu').classList.remove('open'); ribSched();
  if (e.button === 1 || (e.button === 0 && st.space)) { e.preventDefault(); cv.setPointerCapture(e.pointerId); st.pan = { x: e.clientX, y: e.clientY, ox: view.ox, oy: view.oy }; cv.style.cursor = 'grabbing'; return; }
  if (e.button !== 0) return;
  if (ui.tool === 'line') {
    if (!st.start) { const p = snapPt({}); st.start = { x: p.x, y: p.y }; st.chainStart = { x: p.x, y: p.y }; } else commitSeg(computeEnd());
  } else if (ui.tool === 'dim') {
    if (!st.dimP1) { const p = snapPt({}); st.dimP1 = { x: p.x, y: p.y }; }
    else if (!st.dimP2) { const { p, mode } = dimPick(); if (measure(mode, st.dimP1, p) >= 1) { st.dimP2 = { x: p.x, y: p.y }; st.dimEff = mode; } }
    else { const u = dimU(st.dimEff, st.dimP1, st.dimP2); if (measure(st.dimEff, st.dimP1, st.dimP2) >= 1) { push(); S.dims.push({ id: S.id++, p1: st.dimP1, p2: st.dimP2, mode: st.dimEff, c: cFromMouse(u, st.dimEff) }); } st.dimP1 = null; st.dimP2 = null; }
  } else if (ui.tool === 'text') { const p = snapPt({}); textDialog(null, p); }
  else if (ui.tool === 'place') { commitPlace(); }
  else if (ui.tool === 'area') { const f = faceAt(st.w); if (f) { const ar = areaFaces().find(x => x.f === f); areaDialog(f, ar ? ar.a : null, st.w); } }
  else { const hh = hit(st.mouse.x, st.mouse.y); st.sel = hh && hh.t === 'tbh' ? { t: 'tb' } : hh && hh.t === 'allh' ? { t: 'all' } : hh; if (hh) { try { cv.setPointerCapture(e.pointerId); } catch (_) {} startDrag(hh, st.mouse.x, st.mouse.y); } }
  redraw();
});
cv.addEventListener('pointermove', e => {
  updateMouse(e);
  if (st.pan) { view.ox = st.pan.ox + e.clientX - st.pan.x; view.oy = st.pan.oy + e.clientY - st.pan.y; }
  else if (st.drag) doDrag();
  else if (ui.tool === 'area') st.hoverFace = faceAt(st.w);
  else if (ui.tool === 'sel') { const hh = hit(st.mouse.x, st.mouse.y); cv.style.cursor = hh ? (hh.t === 'vtx' ? 'move' : hh.t === 'tbh' || hh.t === 'allh' ? 'nwse-resize' : hh.t === 'all' ? 'move' : 'pointer') : 'default'; }
  redraw();
});
cv.addEventListener('pointerup', () => { if (st.pan) { st.pan = null; cv.style.cursor = st.space ? 'grab' : 'crosshair'; } if (st.drag) endDrag(); redraw(); });
cv.addEventListener('wheel', e => { e.preventDefault(); updateMouse(e); const ns = clamp(view.s * Math.exp(-e.deltaY * 0.0015), 0.002, 5), w = st.w; view.s = ns; view.ox = st.mouse.x - w.x * ns; view.oy = st.mouse.y - w.y * ns; updateMouse(e); redraw(); }, { passive: false });
cv.addEventListener('contextmenu', e => { e.preventDefault(); if (ui.tool !== 'sel') { if (st.start) finishChain(); st.dimP1 = null; st.dimP2 = null; st.place = null; setTool('sel'); } redraw(); });
cv.addEventListener('dblclick', () => {
  if (ui.tool === 'line' && st.start) { finishChain(); redraw(); return; }
  if (ui.tool !== 'sel') return;
  const s = st.sel; if (!s) { const f = faceAt(st.w); if (f) areaDialog(f, null, st.w); return; }
  if (s.t === 'all') posDialog(); else if (s.t === 'tb') projDialog(); else if (s.t === 'text') textDialog(S.texts.find(t => t.id === s.id)); else if (s.t === 'seg') lengthDialog(getSeg(s.id)); else if (s.t === 'obj') objDialog(S.objs.find(o => o.id === s.id));
  else if (s.t === 'area') { const ar = areaFaces().find(x => x.a.id === s.id); if (ar) areaDialog(ar.f, ar.a, ar.a.pt); }
});
window.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') { if (!dialogOpen()) { e.preventDefault(); printSheet(); } return; }
  if (dialogOpen()) return; const tg = e.target && e.target.tagName; if (tg === 'INPUT' || tg === 'TEXTAREA' || tg === 'SELECT') return;
  if (e.key === 'Shift') { st.shift = true; redraw(); return; }
  const k = e.key.toLowerCase();
  if (e.ctrlKey || e.metaKey) { if (k === 'z') { e.preventDefault(); e.shiftKey ? redoDo() : undo(); } else if (k === 'y') { e.preventDefault(); redoDo(); } else if (k === 'a') { e.preventDefault(); selectAll(); } return; }
  if (e.key === ' ') { e.preventDefault(); st.space = true; if (!st.pan) cv.style.cursor = 'grab'; return; }
  const typing = ui.tool === 'line' && st.start;
  if (typing && /^[0-9]$/.test(e.key)) { if (st.buf.length < 9) st.buf += e.key; e.preventDefault(); redraw(); return; }
  if (typing && (e.key === ',' || e.key === '.')) { if (!/[.,]/.test(st.buf) && st.buf !== '') st.buf += ','; e.preventDefault(); redraw(); return; }
  if (typing && e.key === 'Backspace' && st.buf !== '') { st.buf = st.buf.slice(0, -1); e.preventDefault(); redraw(); return; }
  if (typing && e.key === 'Enter') { if (st.buf !== '') { commitSeg(computeEnd()); redraw(); } e.preventDefault(); return; }
  if (ui.tool === 'place' && st.place) { const pl = st.place;
    if (e.key === 'Escape') { st.place = null; setTool('sel'); return; }
    if (k === 'r') { pl.rot = ((pl.rot || 0) + 90) % 360; redraw(); return; }
    if (k === 'f' && pl.proto.k === 'op') { pl.proto.sw = -(pl.proto.sw || 1); if (cp.p && cp.sel === pl.proto.ref) { cp.p.sw = pl.proto.sw; cpDetail(); } redraw(); return; }
    if (k === 'x' && pl.proto.k === 'op') { pl.proto.op = -(pl.proto.op || 1); if (cp.p && cp.sel === pl.proto.ref) { cp.p.op = pl.proto.op; cpDetail(); } redraw(); return; } }
  if (st.sel && st.sel.t === 'obj' && k === 'r') { const o = S.objs.find(o => o.id === st.sel.id); if (o) { push(); rotateObjAround(o, e.shiftKey ? -90 : 90); redraw(); } return; }
  if (e.key === 'Escape') { if (st.buf !== '') st.buf = ''; else if (st.start) finishChain(); else if (st.dimP1) { st.dimP1 = null; st.dimP2 = null; } else st.sel = null; redraw(); return; }
  if (st.sel && st.sel.t === 'all' && e.key.startsWith('Arrow') && S.sheet.fmt !== 'free' && S.sheet.pw) { e.preventDefault(); const sh = S.sheet, stp = e.shiftKey ? 5 : 1;
    const dx = e.key === 'ArrowLeft' ? -stp : e.key === 'ArrowRight' ? stp : 0, dy = e.key === 'ArrowUp' ? -stp : e.key === 'ArrowDown' ? stp : 0;
    push(); sh.fx -= dx * sh.N; sh.fy -= dy * sh.N; view.ox += dx * sh.N * view.s; view.oy += dy * sh.N * view.s; syncOff(); redraw(); return; }
  if (e.key === 'Delete' || e.key === 'Backspace') { deleteSel(); return; }
  if (e.key === 'Enter' && ui.tool === 'sel' && st.sel) { const s = st.sel; if (s.t === 'seg') lengthDialog(getSeg(s.id)); else if (s.t === 'text') textDialog(S.texts.find(t => t.id === s.id)); else if (s.t === 'obj') objDialog(S.objs.find(o => o.id === s.id)); else if (s.t === 'tb') projDialog(); else if (s.t === 'all') posDialog(); e.preventDefault(); return; }
  if (e.key === 'Tab' && ui.tool === 'dim') { e.preventDefault(); const o = ['auto', 'a', 'h', 'v']; ui.dimMode = o[(o.indexOf(ui.dimMode) + 1) % 3]; syncUI(); redraw(); return; }
  if (st.sel && st.sel.t === 'tb' && '+=-_'.includes(e.key) && e.key.length === 1) { push(); S.sheet.tbs = clamp((S.sheet.tbs || 1) * ('+='.includes(e.key) ? 1.1 : 1 / 1.1), 0.3, 1.6); redraw(); return; }
  if (e.key === 'Home') { fit(); return; }
  if (k === 'l') setTool('line'); else if (k === 'd') setTool('dim'); else if (k === 'v') setTool('sel'); else if (k === 't') setTool('text'); else if (k === 'a') setTool('area'); else if (k === 'k') $('bCat').click();
  else if (k === 'o') { ui.ortho = !ui.ortho; syncUI(); redraw(); } else if (k === 'g') { ui.snapG = !ui.snapG; syncUI(); redraw(); } else if (k === 'e') { ui.snapO = !ui.snapO; syncUI(); redraw(); }
  else if (k === 'f' && st.sel && st.sel.t === 'seg') { const s = getSeg(st.sel.id); if (s) { push(); s.side = -s.side; s.userSide = true; redraw(); } }
  else if (k === 'm' && st.sel && st.sel.t === 'seg') { const s = getSeg(st.sel.id); if (s) { push(); s.dm = (s.dm + 1) % 3; redraw(); } }
  else if (e.key === '?') $('hlp').showModal();
});
window.addEventListener('keyup', e => { if (e.key === 'Shift') { st.shift = false; redraw(); } if (e.key === ' ') { st.space = false; cv.style.cursor = 'crosshair'; } });

/* ---------- wstęga ---------- */
$('tLine').onclick = () => setTool('line'); $('tDim').onclick = () => setTool('dim'); $('tSel').onclick = () => setTool('sel'); $('tText').onclick = () => setTool('text'); $('tArea').onclick = () => setTool('area');
const tgl = (id, k) => { $(id).onclick = () => { ui[k] = !ui[k]; syncUI(); redraw(); }; };
tgl('cOrtho', 'ortho'); tgl('cSnapL', 'snapL'); tgl('cSnapG', 'snapG'); tgl('cSnapO', 'snapO'); tgl('cGrid', 'grid'); tgl('cDims', 'showDims');
$('snapStep').onchange = e => { ui.step = +e.target.value; redraw(); }; $('dimMode').onchange = e => { ui.dimMode = e.target.value; redraw(); };
$('bUndo').onclick = undo; $('bRedo').onclick = redoDo; $('bDel').onclick = deleteSel; $('bFit').onclick = fit;
$('bOut').onclick = () => { push(); recalcSides(true); redraw(); };
$('bRot').onclick = () => { const s = st.sel, o = s && s.t === 'obj' && S.objs.find(o => o.id === s.id); if (o) { push(); rotateObjAround(o, st.shift ? -90 : 90); redraw(); } else if (ui.tool === 'place' && st.place) { st.place.rot = ((st.place.rot || 0) + 90) % 360; redraw(); } };
$('bHelp').onclick = () => $('hlp').showModal(); $('hclose').onclick = () => $('hlp').close(); $('dok').onclick = () => $('dlg').close('ok'); $('dcancel').onclick = () => $('dlg').close('cancel'); $('bProj').onclick = projDialog; $('bMarg').onclick = marginDialog; $('bMarg2').onclick = marginDialog; $('projName').onclick = projDialog;
$('fFmt').onchange = e => { S.sheet.fmt = e.target.value; afterSheetChange(); fit(); };
$('fOri').onchange = e => { S.sheet.orient = e.target.value; afterSheetChange(); fit(); }; $('fScl').onchange = e => { const v = e.target.value;
  if (v === 'custom') { st.customScale = true; S.sheet.scale = String(S.sheet.N || 50); syncUI(); $('fSclV').focus(); $('fSclV').select(); return; }
  st.customScale = false; S.sheet.scale = v; afterSheetChange(); fit(); };
const applyCustom = () => { const v = parseFloat(String($('fSclV').value).replace(',', '.')); if (!(v > 0)) return; st.customScale = true; S.sheet.scale = String(v); afterSheetChange(); fit(); };
$('fSclV').onchange = applyCustom; $('fSclV').onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); applyCustom(); $('fSclV').blur(); } };
$('bAll').onclick = selectAll; $('cFrame').onclick = () => { S.sheet.frame = !S.sheet.frame; syncUI(); redraw(); };
$('bMax').onclick = () => { ensureSheet(); st.customScale = false; S.sheet.scale = 'max'; S.sheet.off = { x: 0, y: 0 }; afterSheetChange(); fit(); };
$('cTb').onclick = () => { S.sheet.tb = !S.sheet.tb; afterSheetChange(); }; $('bLay').onclick = () => { if (S.sheet.fmt === 'free') return alert('Najpierw wybierz format arkusza.'); S.sheet.off = { x: 0, y: 0 }; layoutSheet(); fit(); };
$('bNew').onclick = () => { if (confirm('Wyczyścić cały rysunek i ustawienia projektu?')) { push(); S = newDoc(); st.sel = null; resetDraw(); syncUI(); fit(); } };
$('bSave').onclick = () => download(fname('json'), JSON.stringify({ app: 'simplecad', version: 2, data: S }, null, 1), 'application/json');
$('bLoad').onchange = e => {
  const f = e.target.files[0]; if (!f) return; const r = new FileReader();
  r.onload = () => { try { const j = JSON.parse(r.result), d = j.data || j; if (!Array.isArray(d.segs)) throw 0; push(); S = migrate(d); st.sel = null; resetDraw(); syncUI(); fit(); } catch (_) { alert('Nie udało się wczytać pliku.'); } };
  r.readAsText(f); e.target.value = '';
};
$('bMenu').onclick = e => { e.stopPropagation(); $('hmenu').classList.toggle('open'); };
for (const [id, fn] of [['xDxf', exportDxf], ['xSvg', exportSvg], ['xPng', exportPng], ['xPrint', printSheet], ['xPdf', exportPdf]]) $(id).onclick = () => { $('hmenu').classList.remove('open'); fn(); };
$('hmenu').addEventListener('click', e => { if (e.target.closest('button,label')) setTimeout(() => $('hmenu').classList.remove('open'), 0); });
document.addEventListener('click', e => { if (!e.target.closest('#hmenu') && !e.target.closest('#bMenu')) $('hmenu').classList.remove('open'); if (!e.target.closest('#pal') && !e.target.closest('#bColor')) { $('pal').classList.remove('open'); ribSched(); } });
/* ---------- wysuwany pasek narzędzi (nie przesuwa płótna) ---------- */
const rib = $('rib'), rtab = $('rtab'); let hideT = 0;
function ribShow() { clearTimeout(hideT); rib.classList.add('show'); rtab.classList.add('gone'); }
function ribHide() { if (ui.pinned) return; const a = document.activeElement; if (a && rib.contains(a) && a.tagName === 'SELECT') return; if ($('pal').classList.contains('open')) return; rib.classList.remove('show'); rtab.classList.remove('gone'); }
function ribSched() { clearTimeout(hideT); hideT = setTimeout(ribHide, 650); }
rtab.addEventListener('mouseenter', ribShow); rtab.addEventListener('click', ribShow);
rib.addEventListener('mouseenter', () => clearTimeout(hideT)); rib.addEventListener('mouseleave', ribSched); rib.addEventListener('focusout', ribSched);
rib.addEventListener('click', e => { const b = e.target.closest('button'); if (b) b.blur(); });
function setPin(on, comp) { // przypięcie = pasek w układzie strony; rysunek zostaje w tym samym miejscu ekranu
  const hr = rib.offsetHeight;
  if (on && !ui.pinned) { ui.pinned = true; rib.classList.add('dock', 'show'); rtab.classList.add('gone'); if (comp) view.oy -= hr; }
  else if (!on && ui.pinned) { ui.pinned = false; if (comp) view.oy += hr; rib.classList.remove('dock'); ribSched(); }
  syncUI(); redraw();
}
$('bPin').onclick = () => setPin(!ui.pinned, true);
// paleta 24 kolorów
PAL.forEach(c => { const b = h('button', { type: 'button', title: c, style: 'background:' + c }); b.onclick = () => { ribSched();
  ui.color = c; const s = st.sel;
  if (s && s.t === 'seg') { const sg = getSeg(s.id); if (sg) { push(); sg.col = c; } } else if (s && s.t === 'text') { const t = S.texts.find(t => t.id === s.id); if (t) { push(); t.col = c; } }
  $('pal').classList.remove('open'); syncUI(); redraw(); };
  $('palg').append(b); });
$('bColor').onclick = e => { e.stopPropagation(); ribShow(); const p = $('pal'), r = $('bColor').getBoundingClientRect(), w = $('wrap').getBoundingClientRect();
  p.style.left = Math.max(6, Math.min(r.left - w.left, w.width - 226)) + 'px'; p.style.top = Math.max(6, $('rib').getBoundingClientRect().bottom - w.top + 6) + 'px'; [...$('palg').children].forEach(b => b.classList.toggle('cur', b.title === ui.color)); p.classList.toggle('open'); };

/* ---------- autozapis i start ---------- */
function save() { try { localStorage.setItem(KEY, JSON.stringify({ S, view, ui })); } catch (_) {} }
function restore() {
  try { const j = JSON.parse(localStorage.getItem(KEY) || localStorage.getItem('plan2d_v2') || 'null');
    if (j && j.S) { S = migrate(j.S); if (j.view) view = j.view; if (j.ui) for (const k of ['ortho', 'snapL', 'snapG', 'step', 'grid', 'showDims', 'dimMode', 'color', 'pinned', 'snapO']) if (k in j.ui) ui[k] = j.ui[k]; } } catch (_) {}
}
setInterval(save, 2000); window.addEventListener('beforeunload', save);
restore(); if (ui.pinned) { ui.pinned = false; setPin(true, false); } syncUI(); new ResizeObserver(resize).observe($('wrap')); resize();
window.__p2d = { get S() { return S; }, set S(v) { S = migrate(v); }, ui, st, get view() { return view; }, layoutSheet, faces, areaFaces, fit, sheetSvg, snapPt, bbox, redraw, drawScene, moveVertex, getSeg, setTool, tbRectW, tbDims };
})();
</script>
</body>
</html>
