
/* =====================================================================
   BAZA OBIEKTÓW: katalog elementów (cegły, klinkier, okładziny, bloczki, kostka, okna, drzwi),
   geometria wstawionych obiektów (rzut / elewacja, zaprawa, wiązanie), kalkulator spoin, panel pływający
   ===================================================================== */
const D2R = Math.PI / 180, MORTAR = '#d4cfc2';
const CAT_GROUPS = [
  { id: 'cegly', n: 'CEGŁY' }, { id: 'klinkier', n: 'KLINKIER' }, { id: 'okladziny', n: 'OKŁADZINY' }, { id: 'bloczki', n: 'BLOCZKI / PUSTAKI' },
  { id: 'kostka', n: 'KOSTKA' }, { id: 'okna', n: 'OKNA' }, { id: 'drzwi', n: 'DRZWI' }];
const SRC = {
  kb: 'kb.pl – „Wymiary cegły…” i „Beton komórkowy H+H…”', mur: 'muratordom.pl – „Cegły LDF. Klinkierowe cegły dużego formatu”',
  typ: 'wartość typowa (nie z powyższych źródeł) – sprawdź kartę producenta', par: 'wymiar parametryczny – edytowalny po wstawieniu'
};
const FILL = { cer: ['#d98860', '#7a3417'], kli: ['#a8442b', '#5c1f10'], okl: ['#b9573c', '#5c1f10'], kom: ['#f1efe7', '#7b786c'], bet: ['#c4c8ce', '#4b5563'], sil: ['#ebe6d9', '#6b6657'], por: ['#e1b27c', '#7a4a17'], kos: ['#a9adb3', '#374151'] };
const E = (id, g, n, l, w, h, f, src, o) => Object.assign({ id, g, n, l, w, h, kind: 'el', fill: FILL[f][0], st: FILL[f][1], src, note: '' }, o || {});
const OPN = (id, g, n, w, t, leaves, src, o) => Object.assign({ id, g, n, w, t, leaves, kind: 'op', src: src || 'par', note: '' }, o || {});
const CATALOG = [
  E('cegla-pelna', 'cegly', 'Cegła pełna', 250, 120, 65, 'cer', 'kb', { note: 'Format klasyczny (dł. × szer. × wys.). Tolerancja wg producenta ok. 3–6 mm.' }),
  E('cegla-dziurawka', 'cegly', 'Cegła dziurawka', 250, 120, 65, 'cer', 'kb', { cores: [6, 2], note: 'Te same wymiary co cegła pełna, z otworami.' }),
  E('kratowka-k1', 'cegly', 'Kratówka K1', 250, 120, 65, 'cer', 'kb', { cores: [6, 2] }),
  E('kratowka-k2', 'cegly', 'Kratówka K2', 250, 120, 140, 'cer', 'kb', { cores: [6, 2] }),
  E('kratowka-k3', 'cegly', 'Kratówka K3', 250, 120, 188, 'cer', 'kb', { cores: [6, 2] }),
  E('kratowka-k4', 'cegly', 'Kratówka K4', 250, 120, 220, 'cer', 'kb', { cores: [6, 2] }),
  E('silikat-pelny', 'cegly', 'Cegła silikatowa pełna', 250, 120, 65, 'sil', 'typ'),
  E('kli-rf', 'klinkier', 'Klinkier RF', 250, 120, 65, 'kli', 'kb', { note: 'Wg kb.pl 250×120×65; muratordom.pl podaje szerokość 112 mm – producenci się różnią.' }),
  E('kli-nf', 'klinkier', 'Klinkier NF', 240, 115, 71, 'kli', 'kb', { note: 'Format normalny niemiecki. Potwierdzony w dwóch źródłach.' }),
  E('kli-wdf', 'klinkier', 'Klinkier WDF', 215, 98, 65, 'kli', 'kb', { note: 'Format holenderski.' }),
  E('kli-wf', 'klinkier', 'Klinkier WF', 207, 98, 50, 'kli', 'kb', { note: 'Format holenderski (waalformaat).' }),
  E('kli-ldf', 'klinkier', 'Klinkier LDF', 290, 115, 52, 'kli', 'mur', { note: 'Cegła dużego formatu; bywa też w szerokości 90 mm.' }),
  E('kli-xldf', 'klinkier', 'Klinkier XLDF', 356, 115, 52, 'kli', 'mur'),
  E('kli-2df', 'klinkier', 'Klinkier 2DF', 240, 115, 113, 'kli', 'mur'),
  E('kli-nfsp', 'klinkier', 'Klinkier NF-SP (cienka)', 240, 65, 71, 'kli', 'mur'),
  E('okl-ldf', 'okladziny', 'Płytka elewacyjna LDF 14', 290, 14, 52, 'okl', 'mur', { view: 'elev', note: 'Format jak cegła LDF, grubość płytki 14 mm (muratordom.pl).' }),
  E('okl-nf', 'okladziny', 'Płytka elewacyjna NF 14', 240, 14, 71, 'okl', 'typ', { view: 'elev', note: 'Format NF; grubość płytki zwykle 12–16 mm (przyjęto 14).' }),
  E('okl-wdf', 'okladziny', 'Płytka elewacyjna WDF 14', 215, 14, 65, 'okl', 'typ', { view: 'elev', note: 'Format WDF; grubość przyjęto 14 mm.' }),
  E('kom-590-240', 'bloczki', 'Beton komórkowy 590×240×240', 590, 240, 240, 'kom', 'kb', { note: 'H+H (wg cennika). Ytong i inni mają własne wymiary – zob. niżej.' }),
  E('kom-590-120', 'bloczki', 'Beton komórkowy 590×120×240', 590, 120, 240, 'kom', 'kb'),
  E('kom-590-60', 'bloczki', 'Beton komórkowy 590×60×240', 590, 60, 240, 'kom', 'kb'),
  E('ytong-599', 'bloczki', 'Ytong 599×240×199', 599, 240, 199, 'kom', 'kb'),
  E('solbet-490-240', 'bloczki', 'Solbet Max 490×240×240', 490, 240, 240, 'kom', 'kb'),
  E('solbet-490-300', 'bloczki', 'Solbet Max 490×300×240', 490, 300, 240, 'kom', 'kb'),
  E('pust-390-190', 'bloczki', 'Pustak betonowy 390×190×190', 390, 190, 190, 'bet', 'kb', { cores: [3, 2], note: 'Dł. 390 przyjęto jako długość elementu.' }),
  E('pust-390-240', 'bloczki', 'Pustak betonowy 390×240×190', 390, 240, 190, 'bet', 'kb', { cores: [3, 2] }),
  E('pust-390-120', 'bloczki', 'Pustak betonowy 390×120×190', 390, 120, 190, 'bet', 'kb', { cores: [3, 1] }),
  E('pust-390-90', 'bloczki', 'Pustak betonowy 390×90×190', 390, 90, 190, 'bet', 'kb', { cores: [3, 1] }),
  E('blok-250-120-140', 'bloczki', 'Bloczek betonowy 250×120×140', 250, 120, 140, 'bet', 'kb'),
  E('blok-380-250-140', 'bloczki', 'Bloczek betonowy 380×250×140', 380, 250, 140, 'bet', 'kb'),
  E('blok-fund', 'bloczki', 'Bloczek fundamentowy 380×240×120', 380, 240, 120, 'bet', 'kb'),
  E('porotherm-25', 'bloczki', 'Pustak ceramiczny 25 (P+W) 375×250×238', 375, 250, 238, 'por', 'typ', { cores: [4, 3], note: 'Przykład typowego pustaka; wymiary różnią się między producentami i seriami.' }),
  E('kostka-60', 'kostka', 'Kostka brukowa 200×100×60', 200, 100, 60, 'kos', 'typ'),
  E('kostka-80', 'kostka', 'Kostka brukowa 200×100×80', 200, 100, 80, 'kos', 'typ'),
  OPN('okno-600', 'okna', 'Okno 1-skrz. 600', 600, 250, 1), OPN('okno-900', 'okna', 'Okno 1-skrz. 900', 900, 250, 1),
  OPN('okno-1200', 'okna', 'Okno 2-skrz. 1200', 1200, 250, 2), OPN('okno-1500', 'okna', 'Okno 2-skrz. 1500', 1500, 250, 2),
  OPN('okno-1800', 'okna', 'Okno 3-skrz. 1800', 1800, 250, 3), OPN('okno-2400', 'okna', 'Okno 3-skrz. 2400', 2400, 250, 3),
  OPN('drzwi-800', 'drzwi', 'Drzwi wewnętrzne – otwór 800', 800, 120, 1), OPN('drzwi-900', 'drzwi', 'Drzwi wewnętrzne – otwór 900', 900, 120, 1),
  OPN('drzwi-1000', 'drzwi', 'Drzwi 1-skrz. – otwór 1000', 1000, 250, 1), OPN('drzwi-1400', 'drzwi', 'Drzwi 2-skrz. – otwór 1400', 1400, 250, 2),
  OPN('drzwi-1600', 'drzwi', 'Drzwi 2-skrz. – otwór 1600', 1600, 250, 2)
];
const allItems = () => CATALOG.concat((S.custom || []).map(c => Object.assign({ kind: 'el', src: 'par', note: 'Element własny.', custom: true }, c)));
const catItem = id => allItems().find(i => i.id === id);

/* ---------- geometria obiektu (jedno źródło: ekran, druk/SVG/PNG, DXF, podgląd w panelu) ---------- */
function objBox(o) {
  if (o.k === 'op') return { bw: o.w, bh: o.t };
  const je = o.je || {}, cw = o.l * (o.part || 1), ch = o.view === 'elev' ? o.h : o.w;
  return { cw, ch, bw: o.nx * cw + (o.nx - 1) * o.jx + (je.l || 0) + (je.r || 0), bh: o.ny * ch + (o.ny - 1) * o.jy + (je.t || 0) + (je.b || 0) };
}
function objXf(o) { const c = Math.cos((o.rot || 0) * D2R), s = Math.sin((o.rot || 0) * D2R); return (lx, ly) => [o.x + lx * c - ly * s, o.y + lx * s + ly * c]; }
function objInv(o, p) { const c = Math.cos((o.rot || 0) * D2R), s = Math.sin((o.rot || 0) * D2R), dx = p.x - o.x, dy = p.y - o.y; return { x: dx * c + dy * s, y: -dx * s + dy * c }; }
function objCorners(o) {
  const B = objBox(o), T = objXf(o), q = T, r = [[0, 0], [B.bw, 0], [B.bw, B.bh], [0, B.bh]].map(p => q(p[0], p[1]));
  const je = o.je;
  if (o.k === 'el' && je && (je.l || je.r || je.t || je.b)) for (const p of [[je.l, je.t], [B.bw - je.r, je.t], [B.bw - je.r, B.bh - je.b], [je.l, B.bh - je.b]]) r.push(q(p[0], p[1]));
  return r.map(p => ({ x: p[0], y: p[1] }));
}
const objCount = o => o.k === 'el' ? o.nx * o.ny : 0;
function objGeom(o) {
  const T = objXf(o), B = objBox(o), g = [], poly = a => a.map(p => T(p[0], p[1])), rect = (x, y, w, h) => poly([[x, y], [x + w, y], [x + w, y + h], [x, y + h]]);
  if (o.k === 'el') {
    const je = o.je || { l: 0, r: 0, t: 0, b: 0 }, nx = o.nx, ny = o.ny, cw = B.cw, ch = B.ch, jx = o.jx, jy = o.jy, many = nx * ny > 6000, elev = o.view === 'elev';
    if (jx > 0 || jy > 0 || je.l || je.r || je.t || je.b) g.push({ t: 'poly', polys: [rect(0, 0, B.bw, B.bh)], fill: MORTAR, stroke: null });
    const cells = [], hl = Math.max((cw - jx) / 2, 1), inner = B.bw - je.l - je.r;
    if (!many) for (let j = 0; j < ny; j++) {
      const y = (je.t || 0) + j * (ch + jy), odd = o.bond && j % 2 === 1 && nx > 1;
      if (!odd) for (let i = 0; i < nx; i++) cells.push(rect((je.l || 0) + i * (cw + jx), y, cw, ch));
      else { cells.push(rect(je.l || 0, y, hl, ch)); for (let i = 0; i < nx - 1; i++) cells.push(rect((je.l || 0) + hl + jx + i * (cw + jx), y, cw, ch)); cells.push(rect((je.l || 0) + inner - hl, y, hl, ch)); }
    }
    else cells.push(rect(je.l || 0, je.t || 0, inner, B.bh - (je.t || 0) - (je.b || 0)));
    g.push({ t: 'poly', polys: cells, fill: o.fill, stroke: o.st, w: 1, min: Math.min(cw, ch) });
    if (o.cores && !elev && cells.length <= 1200 && !many) {
      const cx = Math.max(1, Math.round(o.cores[0] * (o.part || 1))), cy = o.cores[1], holes = [], gap = 0.035 * Math.min(cw, ch * 2);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const x0 = (je.l || 0) + i * (cw + jx), y0 = (je.t || 0) + j * (ch + jy), hw = (0.78 * cw - (cx - 1) * gap) / cx, hh = (0.7 * ch - (cy - 1) * gap) / cy;
        if (o.bond && j % 2 === 1) continue;
        for (let a = 0; a < cx; a++) for (let b = 0; b < cy; b++) holes.push(rect(x0 + 0.11 * cw + a * (hw + gap), y0 + 0.15 * ch + b * (hh + gap), hw, hh));
      }
      g.push({ t: 'poly', polys: holes, fill: '#fffdf7', stroke: o.st, w: 0.8, min: Math.min(cw, ch) * 0.2 });
    }
    g.push({ t: 'line', pts: poly([[0, 0], [B.bw, 0], [B.bw, B.bh], [0, B.bh]]), closed: true, c: '#222', w: 1.2 });
  } else {
    const w = o.w, t = o.t, win = o.type === 'okno';
    g.push({ t: 'mask', poly: rect(0, 0, w, t) });
    g.push({ t: 'line', pts: poly([[0, 0], [0, t]]), c: '#111', w: 1.8 }, { t: 'line', pts: poly([[w, 0], [w, t]]), c: '#111', w: 1.8 });
    if (win) {
      g.push({ t: 'line', pts: poly([[0, 0], [w, 0]]), c: '#111', w: 1 }, { t: 'line', pts: poly([[0, t], [w, t]]), c: '#111', w: 1 },
        { t: 'line', pts: poly([[0, t * 0.4], [w, t * 0.4]]), c: '#111', w: 1 }, { t: 'line', pts: poly([[0, t * 0.6], [w, t * 0.6]]), c: '#111', w: 1 });
      for (let i = 1; i < (o.leaves || 1); i++) g.push({ t: 'line', pts: poly([[w * i / o.leaves, t * 0.4], [w * i / o.leaves, t * 0.6]]), c: '#111', w: 1 });
    } else {
      const lv = o.leaves || 1, lw = w / lv, fy = (o.op || 1) > 0 ? t : 0, dy = (o.op || 1) > 0 ? 1 : -1;
      for (let li = 0; li < lv; li++) {
        const left = lv === 2 ? li === 0 : (o.sw || 1) > 0, hx = left ? 0 : w, dx = left ? 1 : -1, arc = [];
        for (let k = 0; k <= 14; k++) { const ph = k / 14 * Math.PI / 2; arc.push([hx + dx * lw * Math.cos(ph), fy + dy * lw * Math.sin(ph)]); }
        g.push({ t: 'line', pts: poly([[hx, fy], [hx, fy + dy * lw]]), c: '#111', w: 2.2 }, { t: 'line', pts: poly(arc), c: '#444', w: 0.9 });
      }
    }
  }
  return g;
}
function drawObj(o, opt) {
  opt = opt || {}; ctx.save(); if (opt.alpha) ctx.globalAlpha = opt.alpha; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt'; ctx.setLineDash([]);
  const tr = (arr, close) => { arr.forEach((p, i) => i ? ctx.lineTo(X(p[0]), Y(p[1])) : ctx.moveTo(X(p[0]), Y(p[1]))); if (close) ctx.closePath(); };
  for (const it of objGeom(o)) {
    if (it.t === 'mask') { ctx.beginPath(); tr(it.poly, true); ctx.fillStyle = '#fff'; ctx.fill(); }
    else if (it.t === 'poly') {
      ctx.beginPath(); for (const p of it.polys) tr(p, true); if (it.fill) { ctx.fillStyle = it.fill; ctx.fill(); }
      if (it.stroke && it.min * view.s >= 4) { ctx.strokeStyle = it.stroke; ctx.lineWidth = it.w || 1; ctx.stroke(); }
    } else { ctx.beginPath(); tr(it.pts, it.closed); ctx.strokeStyle = it.c; ctx.lineWidth = it.w; ctx.stroke(); }
  }
  if (opt.sel) { const B = objBox(o), T = objXf(o); ctx.beginPath(); tr([[0, 0], [B.bw, 0], [B.bw, B.bh], [0, B.bh]].map(p => T(p[0], p[1])), true); ctx.strokeStyle = C.sel; ctx.lineWidth = 2.5; ctx.stroke(); }
  ctx.restore();
}
function drawObjs(clean) { for (const o of S.objs) drawObj(o, { sel: !clean && st.sel && st.sel.t === 'obj' && st.sel.id === o.id }); }
function hitObj(w) {
  for (let i = S.objs.length - 1; i >= 0; i--) { const o = S.objs[i], B = objBox(o), q = objInv(o, w), pad = 3 / view.s; if (q.x >= -pad && q.x <= B.bw + pad && q.y >= -pad && q.y <= B.bh + pad) return { t: 'obj', id: o.id }; }
  return null;
}
let _se = { key: '', segs: [], pts: [] };
function objSnapData() { // krawędzie i narożniki obiektów (także pojedynczych elementów w układach) – cache wg stanu obiektów
  if (!ui.snapO || !S.objs.length) return { segs: [], pts: [] };
  const key = JSON.stringify(S.objs.map(o => [o.id, o.x, o.y, o.rot, o.nx, o.ny, o.jx, o.jy, o.part, o.view, o.bond, o.je, o.w, o.t, o.l, o.h, o.leaves])); if (key === _se.key) return _se;
  const segs = [], pm = new Map(); let budget = 12000;
  const addP = (o, p) => { const k = Math.round(p[0] * 10) + '|' + Math.round(p[1] * 10); if (!pm.has(k)) pm.set(k, { x: p[0], y: p[1], oid: o.id }); };
  const edge = (o, a, b) => { if (budget-- > 0) segs.push({ id: 'e' + o.id + '_' + segs.length, oid: o.id, a: { x: a[0], y: a[1] }, b: { x: b[0], y: b[1] } }); };
  for (const o of S.objs) for (const it of objGeom(o)) {
    if (it.t === 'mask' || (it.t === 'poly' && (it.fill === MORTAR || it.fill === '#fffdf7'))) continue;
    const arrs = it.t === 'poly' ? it.polys : [it.pts], cl = it.t === 'poly' || it.closed;
    for (const P of arrs) { for (let i = 0; i + 1 < P.length; i++) edge(o, P[i], P[i + 1]); if (cl && P.length > 2) edge(o, P[P.length - 1], P[0]); for (const p of P) addP(o, p); }
  }
  return (_se = { key, segs, pts: [...pm.values()] });
}
function snapPts(ig) { const r = pts(ig); for (const p of objSnapData().pts) if (!(ig && ig.has('o' + p.oid))) r.push(p); return r; }
function snapSegs(ig) { const e = objSnapData().segs; return e.length ? S.segs.concat(ig ? e.filter(s => !ig.has('o' + s.oid)) : e) : S.segs; }
function objSnapShift(o, ig) { // przyciąganie narożników obiektu do punktów rysunku (px)
  let best = null, bd = 10; if (!ui.snapO) return null; const P = snapPts(ig);
  for (const c of objCorners(o)) for (const p of P) { const d = Math.hypot(X(p.x) - X(c.x), Y(p.y) - Y(c.y)); if (d < bd) { bd = d; best = { dx: p.x - c.x, dy: p.y - c.y }; } }
  return best;
}
function rotateObjAround(o, deg) { // obrót wokół środka obiektu
  const B = objBox(o), T = objXf(o), c0 = T(B.bw / 2, B.bh / 2); o.rot = (((o.rot || 0) + deg) % 360 + 360) % 360; const c1 = objXf(o)(B.bw / 2, B.bh / 2); o.x += c0[0] - c1[0]; o.y += c0[1] - c1[1];
}

/* ---------- wstawianie ---------- */
function placeObj() {
  const pl = st.place; if (!pl) return null; const o = JSON.parse(JSON.stringify(pl.proto)); const p = snapPt({}), B = objBox(o);
  if (o.k === 'op') {
    const m = st.mouse; let best = null, bd = 24;
    for (const s of S.segs) { const q = closestOn(s, st.w), d = Math.hypot(X(q.x) - m.x, Y(q.y) - m.y); if (d < bd) { bd = d; best = { s, q }; } }
    let rot = pl.rot || 0, c = p;
    if (best) { c = best.q; let a = Math.atan2(best.s.b.y - best.s.a.y, best.s.b.x - best.s.a.x) / D2R; a = ((a % 180) + 180) % 180; if (Math.abs(a - 90) < 0.5) a = 90; if (a < 0.5 || a > 179.5) a = 0; rot = a + (pl.rot || 0); }
    o.rot = rot; const cs = Math.cos(rot * D2R), sn = Math.sin(rot * D2R); o.x = c.x - (B.bw / 2 * cs - B.bh / 2 * sn); o.y = c.y - (B.bw / 2 * sn + B.bh / 2 * cs); o.onWall = !!best;
  } else {
    o.rot = pl.rot || 0; o.x = p.x; o.y = p.y; const sh = objSnapShift(o); if (sh) { o.x += sh.dx; o.y += sh.dy; }
  }
  return o;
}
function startPlace(proto) { st.place = { proto, rot: 0 }; setTool('place'); }
function commitPlace() { const o = placeObj(); if (!o) return; push(); o.id = S.id++; delete o.onWall; S.objs.push(o); }

/* ---------- kalkulator spoin ---------- */
function calcOpts(L, e, j, ends, jmin, jmax) { // ends: 0 = spoiny tylko między elementami, 1 = także na obu końcach (n+1 spoin)
  const E2 = ends ? 1 : 0, frac = (L + (1 - E2) * j) / (e + j), nf = Math.max(1, Math.floor(frac)), rows = [];
  for (const n of [nf - 1, nf, nf + 1]) { if (n < 1) continue; const cnt = n - 1 + 2 * E2 * 0.5 + E2 * 0.5 * 0; const joints = n - 1 + (ends ? 2 : 0); if (joints <= 0) { rows.push({ n, j: null }); continue; }
    const jr = (L - n * e) / joints; rows.push({ n, j: jr, ok: jr >= jmin && jr <= jmax, neg: jr < 0 }); }
  const whole = Math.floor(frac + 1e-9), used = whole * e + (whole - 1 + (ends ? 2 : 0)) * j, rest = L - used;
  return { frac, rows, whole, rest };
}
const partName = v => ({ 0.5: 'połówka (½)', 0.75: '¾ elementu', 0.25: '¼ elementu' }[v] || Math.round(v * 100) + '% elementu');
const nf1 = v => (Math.round(v * 100) / 100).toLocaleString('pl-PL', { maximumFractionDigits: 2, useGrouping: false });

/* ---------- SVG: rysunek techniczny i podgląd układu ---------- */
function svgOfGeom(g, bb, W, Hh, M) {
  const sc = Math.min((W - 2 * M) / Math.max(bb.x1 - bb.x0, 1), (Hh - 2 * M) / Math.max(bb.y1 - bb.y0, 1)), ox = (W - (bb.x1 - bb.x0) * sc) / 2 - bb.x0 * sc, oy = (Hh - (bb.y1 - bb.y0) * sc) / 2 - bb.y0 * sc;
  const mp = p => (ox + p[0] * sc).toFixed(1) + ',' + (oy + p[1] * sc).toFixed(1), pd = (a, c) => 'M' + a.map(mp).join('L') + (c ? 'Z' : ''); let s = '';
  for (const it of g) {
    if (it.t === 'mask') s += '<path d="' + pd(it.poly, 1) + '" fill="#fff"/>';
    else if (it.t === 'poly') s += '<path d="' + it.polys.map(p => pd(p, 1)).join('') + '" fill="' + (it.fill || 'none') + '"' + (it.stroke && it.min * sc >= 3 ? ' stroke="' + it.stroke + '" stroke-width="' + (it.w || 1) + '"' : '') + '/>';
    else s += '<path d="' + pd(it.pts, it.closed) + '" fill="none" stroke="' + it.c + '" stroke-width="' + Math.max(0.8, it.w * 0.8) + '"/>';
  }
  return { s, sc, ox, oy, X: x => ox + x * sc, Y: y => oy + y * sc };
}
function svgDim(x1, y1, x2, y2, off, txt) { // wymiar poziomy (y1==y2) lub pionowy (x1==x2); off – odsunięcie linii wymiarowej w px (znak = strona)
  const hz = Math.abs(y2 - y1) < 0.01, col = '#e8590c'; let s = '';
  const tick = (x, y) => '<path d="M' + (x - 3.5) + ',' + (y + 3.5) + 'L' + (x + 3.5) + ',' + (y - 3.5) + '" stroke="' + col + '" stroke-width="1.6"/>';
  if (hz) { const y = y1 + off; s += '<path d="M' + x1 + ',' + (y1 + Math.sign(off) * 3) + 'L' + x1 + ',' + (y + Math.sign(off) * 4) + 'M' + x2 + ',' + (y1 + Math.sign(off) * 3) + 'L' + x2 + ',' + (y + Math.sign(off) * 4) + 'M' + x1 + ',' + y + 'L' + x2 + ',' + y + '" stroke="' + col + '" stroke-width=".9" fill="none"/>' + tick(x1, y) + tick(x2, y)
    + '<text x="' + (x1 + x2) / 2 + '" y="' + (y - 3) + '" text-anchor="middle" font-size="11" font-weight="700" fill="' + col + '" font-family="Arial">' + txt + '</text>'; }
  else { const x = x1 + off; s += '<path d="M' + (x1 + Math.sign(off) * 3) + ',' + y1 + 'L' + (x + Math.sign(off) * 4) + ',' + y1 + 'M' + (x1 + Math.sign(off) * 3) + ',' + y2 + 'L' + (x + Math.sign(off) * 4) + ',' + y2 + 'M' + x + ',' + y1 + 'L' + x + ',' + y2 + '" stroke="' + col + '" stroke-width=".9" fill="none"/>' + tick(x, y1) + tick(x, y2)
    + '<text transform="translate(' + (x + 4 + 7) + ',' + (y1 + y2) / 2 + ') rotate(-90)" text-anchor="middle" font-size="11" font-weight="700" fill="' + col + '" font-family="Arial">' + txt + '</text>'; }
  return s;
}
function protoOf(it, p) {
  if (it.kind === 'op') return { k: 'op', ref: it.id, name: it.n, type: it.g === 'okna' ? 'okno' : 'drzwi', w: p.w, t: p.t, leaves: p.leaves, sw: p.sw, op: p.op, x: 0, y: 0, rot: 0 };
  return { k: 'el', ref: it.id, name: it.n, l: it.l, part: p.part || 1, w: it.w, h: it.h, fill: it.fill, st: it.st, cores: it.cores || null, view: p.view, nx: p.nx, ny: p.ny, jx: p.jx, jy: p.jy,
    je: { t: p.eT ? p.jeT : 0, r: p.eR ? p.jeT : 0, b: p.eB ? p.jeT : 0, l: p.eL ? p.jeT : 0 }, bond: !!p.bond, x: 0, y: 0, rot: 0 };
}
function drawingSvg(it, mode, W, Hh, dims, pp) { // rysunek techniczny jednego elementu (rzut lub elewacja) / symbolu otworu
  let o, bb; const M = dims ? 36 : 7;
  if (it.kind === 'op') {
    const dsw = pp && pp.sw || 1, dop = pp && pp.op || 1, ow = pp && pp.w || it.w, ot = pp && pp.t || it.t, olv = pp && pp.leaves || it.leaves; o = protoOf(it, { w: ow, t: ot, leaves: olv, sw: dsw, op: dop }); const stub = ow * 0.55;
    const g = [{ t: 'poly', polys: [[[-stub, 0], [0, 0], [0, ot], [-stub, ot]], [[ow, 0], [ow + stub, 0], [ow + stub, ot], [ow, ot]]], fill: '#e5e7eb', stroke: '#111', w: 1, min: 99999 }].concat(objGeom(o));
    bb = { x0: -stub, y0: it.g === 'drzwi' && dop < 0 ? -ow / (olv === 2 ? 2 : 1) : 0, x1: ow + stub, y1: it.g === 'drzwi' && dop > 0 ? ot + ow / (olv === 2 ? 2 : 1) : ot };
    const r = svgOfGeom(g, bb, W, Hh, M); let s = r.s; if (dims) { const dy0 = bb.y0 < 0 ? bb.y0 : 0; s += svgDim(r.X(0), r.Y(dy0), r.X(ow), r.Y(dy0), -14, ow); s += svgDim(r.X(ow + stub), r.Y(0), r.X(ow + stub), r.Y(ot), 14, ot); }
    return '<svg viewBox="0 0 ' + W + ' ' + Hh + '" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
  }
  o = protoOf(it, { view: mode, nx: 1, ny: 1, jx: 0, jy: 0, eT: 0, eR: 0, eB: 0, eL: 0, jeT: 0 }); const B = objBox(o); bb = { x0: 0, y0: 0, x1: B.bw, y1: B.bh };
  const r = svgOfGeom(objGeom(o), bb, W, Hh, M); let s = r.s;
  if (dims) { s += svgDim(r.X(0), r.Y(0), r.X(B.bw), r.Y(0), -16, nf1(B.bw)); s += svgDim(r.X(B.bw), r.Y(0), r.X(B.bw), r.Y(B.bh), 18, mode === 'elev' ? it.h : it.w); }
  return '<svg viewBox="0 0 ' + W + ' ' + Hh + '" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
}
function arrangementSvg(o, W, Hh) {
  const B = objBox(o), M = 38, r = svgOfGeom(objGeom(o), { x0: 0, y0: 0, x1: B.bw, y1: B.bh }, W, Hh, M);
  let s = r.s + svgDim(r.X(0), r.Y(0), r.X(B.bw), r.Y(0), -14, nf1(B.bw)) + svgDim(r.X(B.bw), r.Y(0), r.X(B.bw), r.Y(B.bh), 16, nf1(B.bh));
  return '<svg viewBox="0 0 ' + W + ' ' + Hh + '" xmlns="http://www.w3.org/2000/svg">' + s + '</svg>';
}

/* ---------- okna dialogowe obiektu ---------- */
function numIn(v, o) { const i = h('input', Object.assign({ type: 'number', step: 'any' }, o || {})); i.value = v; return i; }
function objDialog(o) {
  modal('Obiekt: ' + o.name, body => {
    const rot = numIn(Math.round((o.rot || 0) * 100) / 100, { step: 1 });
    if (o.k === 'op') {
      const w = numIn(o.w, { min: 100 }), t = numIn(o.t, { min: 20 }), lv = h('select', {}, ...[1, 2, 3].map(n => h('option', { value: n, text: n }))), sw = h('select', {}, h('option', { value: 1, text: 'lewa' }), h('option', { value: -1, text: 'prawa' })), op = h('select', {}, h('option', { value: 1, text: 'na stronę +' }), h('option', { value: -1, text: 'na stronę −' }));
      lv.value = o.leaves || 1; sw.value = o.sw || 1; op.value = o.op || 1;
      body.append(fld('Szerokość otworu [mm]', w), fld('Grubość muru [mm]', t), fld('Liczba skrzydeł', lv), ...(o.type === 'drzwi' ? [fld('Zawiasy', sw), fld('Kierunek otwierania', op)] : []), fld('Obrót [°]', rot));
      return () => ({ w: Math.max(100, +w.value || o.w), t: Math.max(20, +t.value || o.t), leaves: +lv.value, sw: +sw.value, op: +op.value, rot: +rot.value || 0 });
    }
    const view = h('select', {}, h('option', { value: 'plan', text: 'Rzut (dł. × szer.)' }), h('option', { value: 'elev', text: 'Elewacja (dł. × wys.)' })); view.value = o.view;
    const part = h('select', {}, ...[[1, 'cały element'], [0.75, '¾ elementu'], [0.5, 'połówka (½)'], [0.25, '¼ elementu']].map(([v, n]) => h('option', { value: v, text: n }))); part.value = o.part || 1;
    const nx = numIn(o.nx, { min: 1, step: 1 }), ny = numIn(o.ny, { min: 1, step: 1 }), jx = numIn(o.jx, { min: 0 }), jy = numIn(o.jy, { min: 0 }), je = o.je || {};
    const eT = numIn(je.t || 0, { min: 0 }), eR = numIn(je.r || 0, { min: 0 }), eB = numIn(je.b || 0, { min: 0 }), eL = numIn(je.l || 0, { min: 0 });
    const bond = h('input', { type: 'checkbox' }); bond.checked = !!o.bond;
    const info = h('div', { style: 'font-size:12px;color:#475467;margin-top:4px' }), upd = () => { const t = Object.assign({}, o, { part: +part.value, view: view.value, nx: Math.max(1, Math.round(+nx.value) || 1), ny: Math.max(1, Math.round(+ny.value) || 1), jx: +jx.value || 0, jy: +jy.value || 0, je: { t: +eT.value || 0, r: +eR.value || 0, b: +eB.value || 0, l: +eL.value || 0 } }), B = objBox(t); info.textContent = 'Wymiar całkowity: ' + nf1(B.bw) + ' × ' + nf1(B.bh) + ' mm   •   elementów: ' + t.nx * t.ny; };
    for (const i of [part, view, nx, ny, jx, jy, eT, eR, eB, eL]) i.oninput = i.onchange = upd; upd();
    body.append(h('div', { text: o.l + ' × ' + o.w + ' × ' + o.h + ' mm (dł. × szer. × wys.)', style: 'font-weight:600' }), fld('Widok', view), fld('Część elementu (np. połówka do układania na zakładkę)', part), fld('Elementów wzdłuż długości (nx)', nx), fld('Rzędów (ny)', ny),
      fld('Spoina między elementami w rzędzie [mm]', jx), fld('Spoina między rzędami [mm]', jy), fld('Wiązanie – co drugi rząd przesunięty o ½', bond, 'chk'),
      h('div', { text: 'Zaprawa na krawędziach zewnętrznych [mm] (0 = brak):', style: 'margin-top:6px;font-weight:600' }), fld('Góra', eT), fld('Prawa', eR), fld('Dół', eB), fld('Lewa', eL), fld('Obrót [°]', rot), info);
    return () => ({ part: +part.value, view: view.value, nx: clamp(Math.round(+nx.value) || 1, 1, 400), ny: clamp(Math.round(+ny.value) || 1, 1, 400), jx: Math.max(0, +jx.value || 0), jy: Math.max(0, +jy.value || 0), bond: bond.checked, je: { t: Math.max(0, +eT.value || 0), r: Math.max(0, +eR.value || 0), b: Math.max(0, +eB.value || 0), l: Math.max(0, +eL.value || 0) }, rot: +rot.value || 0 });
  }, v => { push(); Object.assign(o, v); redraw(); });
}
function bomDialog() {
  const m = new Map(); let mort = 0;
  for (const o of S.objs) if (o.k === 'el') { const k = o.name + (o.part && o.part < 1 ? ' – ' + partName(o.part) : '') + ' [' + o.l + '×' + o.w + '×' + o.h + '] – ' + (o.view === 'elev' ? 'elewacja' : 'rzut'), r = m.get(k) || { n: 0, cut: 0 };
    r.n += o.nx * o.ny; if (o.bond) r.cut += Math.floor(o.ny / 2); m.set(k, r); const B = objBox(o), depth = o.view === 'elev' ? o.w : o.h; mort += Math.max(0, B.bw * B.bh * depth - o.nx * o.ny * o.l * (o.part || 1) * (o.view === 'elev' ? o.h : o.w) * depth); }
  const ops = new Map(); for (const o of S.objs) if (o.k === 'op') { const k = o.name + ' (' + o.w + ' mm)'; ops.set(k, (ops.get(k) || 0) + 1); }
  modal('Zestawienie elementów', body => {
    if (!m.size && !ops.size) { body.append(h('div', { text: 'Na rysunku nie ma jeszcze obiektów z katalogu.' })); return () => 0; }
    const tb = h('table', { style: 'width:100%;border-collapse:collapse;font-size:13px' }); tb.append(h('tr', {}, ...['Element', 'Szt.', 'w tym ciętych', '+5% zapasu'].map(t => h('th', { text: t, style: 'text-align:left;border-bottom:2px solid #cbd5e1;padding:3px 6px' }))));
    for (const [k, r] of m) tb.append(h('tr', {}, h('td', { text: k, style: 'padding:3px 6px' }), h('td', { text: r.n, style: 'padding:3px 6px;font-weight:700' }), h('td', { text: r.cut || '–', style: 'padding:3px 6px' }), h('td', { text: Math.ceil(r.n * 1.05), style: 'padding:3px 6px' })));
    for (const [k, n] of ops) tb.append(h('tr', {}, h('td', { text: k, style: 'padding:3px 6px' }), h('td', { text: n, style: 'padding:3px 6px;font-weight:700' }), h('td', { text: '–', style: 'padding:3px 6px' }), h('td', { text: '–', style: 'padding:3px 6px' })));
    body.append(tb); if (mort > 0) body.append(h('div', { text: 'Objętość zaprawy (spoiny): ok. ' + nf1(mort / 1e6) + ' litra  (' + nf1(mort / 1e9) + ' m³), bez zapasu.', style: 'margin-top:8px' }), h('div', { text: 'Wartości orientacyjne – wymiary elementów są nominalne.', style: 'font-size:12px;color:#667085;margin-top:4px' }));
    return () => 0;
  }, () => { });
}
function customDialog() {
  modal('Własny element', body => {
    const n = h('input', { type: 'text', placeholder: 'np. Cegła rozbiórkowa' }), l = numIn(250, { min: 5 }), w = numIn(120, { min: 5 }), hh = numIn(65, { min: 5 }),
      g = h('select', {}, ...CAT_GROUPS.filter(x => !['okna', 'drzwi'].includes(x.id)).map(x => h('option', { value: x.id, text: x.n })));
    body.append(fld('Nazwa', n), fld('Kategoria', g), fld('Długość [mm]', l), fld('Szerokość / grubość [mm]', w), fld('Wysokość [mm]', hh));
    return () => ({ n: n.value.trim(), g: g.value, l: +l.value, w: +w.value, h: +hh.value });
  }, v => {
    if (!v.n || !(v.l > 0 && v.w > 0 && v.h > 0)) return; push(); const f = FILL[v.g === 'klinkier' || v.g === 'okladziny' ? 'kli' : v.g === 'bloczki' ? 'bet' : 'cer'];
    S.custom.push({ id: 'c' + (S.id++), g: v.g, n: v.n, l: v.l, w: v.w, h: v.h, fill: f[0], st: f[1] }); cpRender();
  });
}

/* ---------- panel katalogu (pływający) ---------- */
const cp = { q: '', g: 'all', sel: null, p: null, calc: { L: 6000, H: 2500, axis: 'x', ends: 0, jmin: 8, jmax: 12 } };
(function () {
  const css = document.createElement('style'); css.textContent = `
#cat{position:fixed;left:64px;top:54px;width:780px;height:610px;min-width:580px;min-height:440px;max-width:97vw;max-height:94vh;resize:both;overflow:hidden;display:none;flex-direction:column;background:#fff;border:1px solid #cbd5e1;border-radius:12px;box-shadow:0 18px 50px rgba(15,23,42,.30);z-index:90;font:13px Inter,Arial,sans-serif;color:#1f2937}
#cat.open{display:flex}#cat.dim{opacity:.3}#cat.dim:hover{opacity:1}#cat .ch{display:flex;align-items:center;gap:8px;padding:8px 10px;background:linear-gradient(90deg,#1e1b4b,#4338ca);color:#fff;cursor:move;user-select:none;flex:none}#cat .ch b{font-size:14px;flex:1}
#cat .ch button{background:rgba(255,255,255,.16);border:0;color:#fff;border-radius:7px;padding:4px 9px;cursor:pointer;font:inherit}#cat .ch button:hover{background:rgba(255,255,255,.3)}
#cat .cs{padding:8px 10px 4px;flex:none;border-bottom:1px solid #e5e7eb}#cat .cs input[type=search]{width:100%;box-sizing:border-box;padding:7px 10px;border:1px solid #cbd5e1;border-radius:8px;font:inherit}
#cat .chips{display:flex;gap:5px;flex-wrap:wrap;margin:7px 0 5px}#cat .chips button{border:1px solid #cbd5e1;background:#f8fafc;border-radius:999px;padding:3px 10px;cursor:pointer;font:600 11px Inter,Arial,sans-serif;color:#475467}#cat .chips button.on{background:#4338ca;border-color:#4338ca;color:#fff}
#cat .cb{display:flex;flex:1;min-height:0}#cat .cl{width:250px;flex:none;overflow:auto;border-right:1px solid #e5e7eb;background:#fafbfc}#cat .cd{flex:1;overflow:auto;padding:10px 12px;min-width:0}
#cat .gh{font:700 10.5px Inter,Arial,sans-serif;letter-spacing:.06em;color:#6b7280;padding:8px 10px 3px}#cat .it{display:flex;gap:8px;align-items:center;padding:5px 10px;cursor:pointer;border-left:3px solid transparent}#cat .it:hover{background:#eef2ff}#cat .it.on{background:#e0e7ff;border-left-color:#4338ca}
#cat .it svg{width:58px;height:40px;flex:none;background:#fff;border:1px solid #e5e7eb;border-radius:5px}#cat .it .t{font-weight:600;font-size:12px;line-height:1.2}#cat .it .s{font-size:11px;color:#6b7280}
#cat .cd h4{margin:0 0 2px;font-size:15px}#cat .src{font-size:11px;color:#6b7280;margin-bottom:6px}#cat .tabs{display:flex;gap:4px;margin:6px 0}#cat .tabs button{border:1px solid #cbd5e1;background:#f8fafc;border-radius:7px;padding:3px 10px;cursor:pointer;font:600 12px Inter,Arial,sans-serif}#cat .tabs button.on{background:#e0e7ff;border-color:#4338ca;color:#312e81}
#cat .dr{border:1px solid #e5e7eb;border-radius:8px;background:#fff;margin-bottom:6px}#cat .dr svg{display:block;width:100%;height:auto}#cat .pg{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin:8px 0}#cat .pg label{display:flex;flex-direction:column;font-size:11px;color:#475467;gap:2px}
#cat .pg input,#cat .pg select,#cat .cc input,#cat .cc select{padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px;font:inherit;width:100%;box-sizing:border-box}#cat .pg label.k{flex-direction:row;align-items:center;gap:6px;grid-column:span 2}#cat .pg label.k input{width:auto}
#cat .go{background:linear-gradient(90deg,#4338ca,#6366f1);color:#fff;border:0;border-radius:9px;padding:9px 14px;font:700 13px Inter,Arial,sans-serif;cursor:pointer;width:100%;margin:4px 0 8px}#cat .go:hover{filter:brightness(1.1)}
#cat details{border:1px solid #e5e7eb;border-radius:9px;padding:6px 9px;background:#f8fafc}#cat summary{cursor:pointer;font-weight:700;font-size:12.5px}#cat .cc{display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;margin-top:8px}#cat .cc label{display:flex;flex-direction:column;font-size:11px;color:#475467;gap:2px}
#cat table{border-collapse:collapse;width:100%;margin-top:6px;font-size:12px}#cat td,#cat th{border-bottom:1px solid #e5e7eb;padding:3px 5px;text-align:left}#cat .ok{color:#047857;font-weight:700}#cat .bad{color:#b42318}#cat .mini{font-size:11px;padding:2px 8px;border:1px solid #4338ca;background:#fff;color:#4338ca;border-radius:6px;cursor:pointer}
#cat .res{font-size:12px;margin-top:6px;line-height:1.45}#cat .ft{padding:6px 10px;border-top:1px solid #e5e7eb;font-size:11px;color:#667085;flex:none;display:flex;gap:8px;align-items:center}#cat .ft span{flex:1}
`; document.head.append(css);
  const el = h('div', { id: 'cat' }); document.body.append(el);
  const head = h('div', { class: 'ch' }, h('b', { text: 'Katalog obiektów' }), h('button', { type: 'button', id: 'cBom', text: 'Zestawienie' }), h('button', { type: 'button', id: 'cX', text: '✕', title: 'Zamknij' }));
  const search = h('input', { type: 'search', placeholder: 'Szukaj: cegła, klinkier, 250, okno, drzwi…', id: 'cQ' }), chips = h('div', { class: 'chips', id: 'cChips' });
  el.append(head, h('div', { class: 'cs' }, search, chips), h('div', { class: 'cb' }, h('div', { class: 'cl', id: 'cList' }), h('div', { class: 'cd', id: 'cDet' })),
    h('div', { class: 'ft' }, h('span', { text: 'Wymiary nominalne (dł. × szer. × wys.) – przed zakupem sprawdź kartę producenta.' }), h('button', { type: 'button', class: 'mini', id: 'cCust', text: '+ własny element' })));
  let drag = null; head.addEventListener('pointerdown', e => { if (e.target.closest('button')) return; const r = el.getBoundingClientRect(); drag = { dx: e.clientX - r.left, dy: e.clientY - r.top }; head.setPointerCapture(e.pointerId); });
  head.addEventListener('pointermove', e => { if (!drag) return; el.style.left = clamp(e.clientX - drag.dx, 0, Math.max(0, innerWidth - el.offsetWidth)) + 'px'; el.style.top = clamp(e.clientY - drag.dy, 0, innerHeight - 40) + 'px'; });
  head.addEventListener('pointerup', () => { drag = null; });
  $('cX').onclick = () => el.classList.remove('open'); $('cBom').onclick = bomDialog; $('cCust').onclick = customDialog;
  search.oninput = () => { cp.q = search.value; cpList(); };
  const bc = $('bCat'); if (bc) bc.onclick = () => { el.classList.toggle('open'); if (el.classList.contains('open')) cpRender(); };
})();
const matchQ = it => { const q = cp.q.trim().toLowerCase(); if (!q) return true; const hay = (it.n + ' ' + it.l + ' ' + it.w + ' ' + it.h + ' ' + it.l + 'x' + it.w + 'x' + it.h + ' ' + (CAT_GROUPS.find(g => g.id === it.g) || {}).n).toLowerCase(); return q.split(/\s+/).every(t => hay.includes(t.replace('×', 'x'))); };
function cpRender() { if (!$('cat').classList.contains('open')) return; cpChips(); cpList(); cpDetail(); }
function cpChips() {
  const c = $('cChips'); c.innerHTML = ''; for (const g of [{ id: 'all', n: 'WSZYSTKO' }].concat(CAT_GROUPS)) { const b = h('button', { type: 'button', text: g.n, class: cp.g === g.id ? 'on' : '' }); b.onclick = () => { cp.g = g.id; cpChips(); cpList(); }; c.append(b); }
}
function cpList() {
  const L = $('cList'); L.innerHTML = ''; let any = false;
  for (const g of CAT_GROUPS) { if (cp.g !== 'all' && cp.g !== g.id) continue; const items = allItems().filter(i => i.g === g.id && matchQ(i)); if (!items.length) continue; any = true; L.append(h('div', { class: 'gh', text: g.n }));
    for (const it of items) {
      const row = h('div', { class: 'it' + (cp.sel === it.id ? ' on' : '') }), th = h('div', {}); th.innerHTML = drawingSvg(it, it.view || 'plan', 58, 40, false, cp.sel === it.id ? cp.p : null);
      row.append(th.firstChild, h('div', {}, h('div', { class: 't', text: it.n }), h('div', { class: 's', text: it.kind === 'op' ? 'otwór ' + it.w + ' × mur ' + it.t : it.l + ' × ' + it.w + ' × ' + it.h })));
      row.onclick = () => { cpSelect(it.id); }; L.append(row);
    } }
  if (!any) L.append(h('div', { text: 'Brak wyników.', style: 'padding:14px;color:#6b7280' }));
}
function cpSelect(id) {
  cp.sel = id; const it = catItem(id); if (!it) return;
  if (it.kind === 'op') cp.p = { w: it.w, t: it.t, leaves: it.leaves, sw: 1, op: 1 };
  else { const sl = it.g === 'okladziny'; cp.p = { part: 1, view: it.view || 'plan', nx: sl ? 10 : 1, ny: sl ? 6 : 1, jx: 10, jy: 10, eT: 0, eR: 0, eB: 0, eL: 0, jeT: 10, bond: sl }; }
  cpList(); cpDetail();
}
function cpDetail() {
  const D = $('cDet'), sc0 = D.scrollTop; D.innerHTML = ''; setTimeout(() => { D.scrollTop = sc0; }, 0); const it = cp.sel && catItem(cp.sel);
  if (!it) { D.append(h('div', { style: 'color:#6b7280;padding:30px 10px;text-align:center' }, 'Wybierz element z listy po lewej.', h('br'), h('br'), 'Cegły i bloczki pokażą się jako rysunek techniczny z wymiarami, a pod spodem – kalkulator zaprawy i liczby elementów na zadanej długości.')); return; }
  const p = cp.p; D.append(h('h4', { text: it.n }), h('div', { class: 'src', text: (it.kind === 'op' ? 'Symbol w rzucie. ' : '') + 'Źródło: ' + SRC[it.src] + (it.note ? ' • ' + it.note : '') }));
  const dr = h('div', { class: 'dr', id: 'cDr' }), prev = h('div', { class: 'dr', id: 'cPrev' });
  const tabs = h('div', { class: 'tabs' });
  if (it.kind === 'el') for (const [v, n] of [['plan', 'Rzut (dł. × szer.)'], ['elev', 'Elewacja (dł. × wys.)']]) { const b = h('button', { type: 'button', text: n, class: p.view === v ? 'on' : '' }); b.onclick = () => { p.view = v; cpDetail(); }; tabs.append(b); }
  D.append(tabs, dr);
  const form = h('div', { class: 'pg' }), F = (lab, key, o, kind) => { const l = h('label', {}, h('span', { text: lab })); let i; if (kind === 'chk') { l.className = 'k'; i = h('input', { type: 'checkbox' }); i.checked = !!p[key]; i.onchange = () => { p[key] = i.checked; upd(); }; l.prepend(i); l.querySelector('span').remove(); l.append(h('span', { text: lab })); return l; }
    if (kind === 'sel' || kind === 'selself') { i = h('select', {}); for (const [v, n] of o) i.append(h('option', { value: v, text: n })); i.value = p[key]; i.onchange = () => { p[key] = +i.value; upd(); }; } else { i = numIn(p[key], o || {}); i.oninput = i.onchange = () => { p[key] = parseFloat(String(i.value).replace(',', '.')) || 0; upd(); }; } l.append(i); return l; };
  if (it.kind === 'op') form.append(F('Szerokość otworu [mm]', 'w', { min: 100 }), F('Grubość muru [mm]', 't', { min: 20 }), F('Liczba skrzydeł', 'leaves', [[1, '1'], [2, '2'], [3, '3']], 'sel'), ...(it.g === 'drzwi' ? [F('Zawiasy', 'sw', [[1, 'lewe'], [-1, 'prawe']], 'sel'), F('Otwieranie', 'op', [[1, 'na stronę +'], [-1, 'na stronę −']], 'sel')] : []));
  else form.append(F('Część elementu', 'part', [[1, 'cały element'], [0.75, '¾ elementu'], [0.5, 'połówka (½) – na zakładkę'], [0.25, '¼ elementu']], 'sel'), F('Elementów w rzędzie (nx)', 'nx', { min: 1, step: 1 }), F('Rzędów (ny)', 'ny', { min: 1, step: 1 }), F('Spoina w rzędzie [mm]', 'jx', { min: 0 }), F('Spoina między rzędami [mm]', 'jy', { min: 0 }),
    F('Zaprawa na krawędzi: góra', 'eT', null, 'chk'), F('prawa', 'eR', null, 'chk'), F('dół', 'eB', null, 'chk'), F('lewa', 'eL', null, 'chk'), F('Grubość zaprawy na krawędziach [mm]', 'jeT', { min: 0 }), F('Wiązanie (co 2. rząd o ½)', 'bond', null, 'chk'));
  D.append(form);
  const go = h('button', { type: 'button', class: 'go', text: 'Wstaw na rysunek  ▸' }); go.onclick = () => { startPlace(protoOf(it, p)); };
  D.append(go, h('div', { class: 'src', text: 'Po wstawieniu: R – obrót, F / X – zawiasy / kierunek (drzwi), Esc – koniec. Dwuklik na obiekcie – edycja.' }));
  if (it.kind === 'el') { D.append(h('div', { style: 'font-weight:700;font-size:12px;margin:2px 0' }, 'Podgląd układu'), prev); D.append(cpCalcBlock(it, p)); }
  if (it.custom) { const del = h('button', { type: 'button', class: 'mini', text: 'Usuń element własny', style: 'margin-top:8px' }); del.onclick = () => { push(); S.custom = S.custom.filter(c => c.id !== it.id); cp.sel = null; cpList(); cpDetail(); }; D.append(del); }
  function upd() { dr.innerHTML = drawingSvg(it, p.view || 'plan', 420, it.kind === 'op' ? 210 : 200, true, p); if (it.kind === 'el') { prev.innerHTML = arrangementSvg(protoOf(it, p), 420, 170); cpCalcRes(it, p); } }
  cp.upd = upd; upd();
}
function cpCalcBlock(it, p) {
  const c = cp.calc, d = h('details', { open: 'open' }, h('summary', { text: 'Kalkulator zaprawy i ilości elementów' }));
  const inp = (lab, key, o) => { const l = h('label', {}, h('span', { text: lab })), i = numIn(c[key], o || {}); i.oninput = i.onchange = () => { c[key] = parseFloat(String(i.value).replace(',', '.')) || 0; cpCalcRes(it, p); }; l.append(i); return l; };
  const sel = (lab, key, opts) => { const l = h('label', {}, h('span', { text: lab })), i = h('select', {}); for (const [v, n] of opts) i.append(h('option', { value: v, text: n })); i.value = c[key]; i.onchange = () => { c[key] = isNaN(+i.value) ? i.value : +i.value; cpCalcRes(it, p); }; l.append(i); return l; };
  d.append(h('div', { class: 'cc' }, inp('Długość odcinka / ściany L [mm]', 'L', { min: 1 }), inp('Wysokość ściany H [mm] (opcj.)', 'H', { min: 0 }),
    sel('Liczymy wzdłuż', 'axis', [['x', 'poziomo – długość elementu'], ['y', 'pionowo – wysokość (elewacja) / szerokość (rzut)']]), sel('Spoiny', 'ends', [[0, 'tylko między elementami'], [1, 'także na obu końcach']]),
    inp('Dopuszczalna spoina od [mm]', 'jmin', { min: 0 }), inp('… do [mm]', 'jmax', { min: 0 })), h('div', { class: 'res', id: 'cRes' }));
  setTimeout(() => cpCalcRes(it, p), 0); return d;
}
function cpCalcRes(it, p) {
  const R = $('cRes'); if (!R) return; const c = cp.calc, x = c.axis === 'x', e = x ? it.l * (p.part || 1) : (p.view === 'elev' ? it.h : it.w), j = x ? p.jx : p.jy, L = x ? c.L : (c.H > 0 ? c.H : c.L), res = calcOpts(L, e, j, c.ends, c.jmin, c.jmax);
  const lab = x ? 'długości ' + nf1(L) + ' mm' : 'wysokości/głębokości ' + nf1(L) + ' mm';
  let html = 'Na ' + lab + ' przy spoinie ' + nf1(j) + ' mm mieści się <b>' + nf1(res.frac) + '</b> elementu (' + res.whole + ' pełnych + reszta ' + nf1(Math.max(res.rest, 0)) + ' mm).';
  if (Math.abs(res.frac - Math.round(res.frac)) > 0.02) html += ' <span class="bad">Nie wychodzi na całe elementy.</span>'; else html += ' <span class="ok">Wychodzi na całe elementy.</span>';
  html += '<table><tr><th>Elementów</th><th>Potrzebna spoina</th><th></th><th></th></tr>';
  for (const r of res.rows) html += '<tr><td><b>' + r.n + '</b></td><td>' + (r.j === null ? '–' : r.neg ? '<span class="bad">za dużo elementów</span>' : nf1(r.j) + ' mm') + '</td><td>' + (r.j === null || r.neg ? '' : r.ok ? '<span class="ok">✔ w zakresie</span>' : '<span class="bad">poza zakresem ' + nf1(c.jmin) + '–' + nf1(c.jmax) + '</span>') + '</td><td>' + (r.j === null || r.neg ? '' : '<button type="button" class="mini" data-n="' + r.n + '" data-j="' + r.j + '">Użyj</button>') + '</td></tr>';
  html += '</table>';
  const B = objBox(protoOf(it, p)), N = p.nx * p.ny, depth = p.view === 'elev' ? it.w : it.h, face = (p.view === 'elev' ? it.l * it.h : it.l * it.w) * (p.part || 1), mort = Math.max(0, B.bw * B.bh * depth - N * face * depth), area = B.bw * B.bh / 1e6;
  html += '<div style="margin-top:6px;border-top:1px solid #e5e7eb;padding-top:5px"><b>Bieżący układ ' + p.nx + ' × ' + p.ny + '</b>: ' + nf1(B.bw) + ' × ' + nf1(B.bh) + ' mm = ' + nf1(area) + ' m², <b>' + N + ' szt.</b> (+5% zapasu: ' + Math.ceil(N * 1.05) + ')' + (p.bond && p.ny > 1 ? ', w tym ' + Math.floor(p.ny / 2) + ' ciętych na pół' : '') + '.<br>Zaprawa w spoinach: ok. <b>' + nf1(mort / 1e6) + ' l</b>' + (area > 0 ? ' • ' + nf1(N / area) + ' szt./m²' : '') + '.</div>';
  R.innerHTML = html;
  R.querySelectorAll('button[data-n]').forEach(b => b.onclick = () => { const n = +b.dataset.n, jj = Math.round(+b.dataset.j * 10) / 10; if (x) { p.nx = n; p.jx = jj; } else { p.ny = n; p.jy = jj; } cpDetail(); });
}
