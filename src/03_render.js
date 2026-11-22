
/* ---------- wymiary: geometria ---------- */
function dimU(mode, p1, p2) {
  if (mode === 'h') return { x: 1, y: 0 };
  if (mode === 'v') return { x: 0, y: 1 };
  const L = Math.hypot(p2.x - p1.x, p2.y - p1.y);
  return L < 1e-9 ? { x: 1, y: 0 } : { x: (p2.x - p1.x) / L, y: (p2.y - p1.y) / L };
}
const measure = (mode, p1, p2) => { const u = dimU(mode, p1, p2); return Math.abs((p2.x - p1.x) * u.x + (p2.y - p1.y) * u.y); };
function dimGeom(p1, p2, u, c) {
  const n = { x: -u.y, y: u.x }, t1 = p1.x * u.x + p1.y * u.y, t2 = p2.x * u.x + p2.y * u.y;
  return { q1: { x: u.x * t1 + n.x * c, y: u.y * t1 + n.y * c }, q2: { x: u.x * t2 + n.x * c, y: u.y * t2 + n.y * c } };
}
function cFromMouse(u, mode) {
  const n = { x: -u.y, y: u.x }; let c = st.w.x * n.x + st.w.y * n.y;
  if (ui.snapG && mode !== 'a') c = gridSnap(c); return c;
}
function segDimParams(s, offW) {
  const L = slen(s) || 1, u = { x: (s.b.x - s.a.x) / L, y: (s.b.y - s.a.y) / L }, n = { x: -u.y, y: u.x };
  return { u, L, c: s.a.x * n.x + s.a.y * n.y + s.side * (offW !== undefined ? offW : OFF_PX / view.s) };
}

/* drugi punkt wymiaru: domyślnie pod kątem 90° (poziomo/pionowo wg kursora), Shift = swobodnie */
function dimPick() {
  const isO = ui.ortho !== st.shift, auto = ui.dimMode === 'auto', p = snapPt({ from: st.dimP1, ortho: auto && isO });
  let mode = ui.dimMode; if (auto) mode = isO ? (Math.abs(p.x - st.dimP1.x) >= Math.abs(p.y - st.dimP1.y) ? 'h' : 'v') : 'a';
  return { p, mode };
}

/* ---------- kolizje etykiet (PN-EN ISO 129: wartość poza linią / pole z odnośnikiem) ----------
   OBS: odcinki-przeszkody [x1,y1,x2,y2,właściciel] w pikselach widoku (rysunek = -1, wymiar = jego id).
   LBL: wielokąty zajętych pól z wartościami (SAT) – widok/wydruk liczony od nowa przy każdym rysowaniu. */
let OBS = [], LBL = [], CEN = { x: 0, y: 0 };
function buildObs() {
  OBS = S.segs.map(s => [X(s.a.x), Y(s.a.y), X(s.b.x), Y(s.b.y), -1]); LBL = [];
  let cx = 0, cy = 0, n = 0; for (const o of OBS) { cx += o[0] + o[2]; cy += o[1] + o[3]; n += 2; } CEN = n ? { x: cx / n, y: cy / n } : { x: W / 2, y: H / 2 };
}
function segRect(x1, y1, x2, y2, r0, s0, r1, s1) { // Liang–Barsky: czy odcinek przecina prostokąt
  let t0 = 0, t1 = 1; const dx = x2 - x1, dy = y2 - y1, p = [-dx, dx, -dy, dy], q = [x1 - r0, r1 - x1, y1 - s0, s1 - y1];
  for (let i = 0; i < 4; i++) {
    if (Math.abs(p[i]) < 1e-12) { if (q[i] < 0) return false; }
    else { const t = q[i] / p[i]; if (p[i] < 0) { if (t > t1) return false; if (t > t0) t0 = t; } else { if (t < t0) return false; if (t < t1) t1 = t; } }
  }
  return true;
}
function segCross(a, b, o) { // właściwe przecięcie (wnętrza odcinków)
  const rx = b.x - a.x, ry = b.y - a.y, sx = o[2] - o[0], sy = o[3] - o[1], den = rx * sy - ry * sx; if (Math.abs(den) < 1e-9) return false;
  const qx = o[0] - a.x, qy = o[1] - a.y, t = (qx * sy - qy * sx) / den, u = (qx * ry - qy * rx) / den;
  return t > 0.02 && t < 0.98 && u > 0.001 && u < 0.999;
}
function blockedLocal(P, ex, ey, hw, me) { // prostokąt etykiety w układzie linii wymiarowej: x∈[-hw,hw], y∈[-19,1]
  for (const o of OBS) {
    if (o[4] === me) continue;
    const ax = o[0] - P.x, ay = o[1] - P.y, bx = o[2] - P.x, by = o[3] - P.y;
    if (segRect(ax * ex.x + ay * ex.y, ax * ey.x + ay * ey.y, bx * ex.x + by * ex.y, bx * ey.x + by * ey.y, -hw, -19, hw, 1)) return true;
  } return false;
}
function boxBlocked(r, me) { for (const o of OBS) if (o[4] !== me && segRect(o[0], o[1], o[2], o[3], r.x0, r.y0, r.x1, r.y1)) return true; return false; }
function rectPoly(r) { return [{ x: r.x0, y: r.y0 }, { x: r.x1, y: r.y0 }, { x: r.x1, y: r.y1 }, { x: r.x0, y: r.y1 }]; }
function satOverlap(A, B) { // dwa wypukłe wielokąty (SAT); lekki zapas 1 px
  for (const P of [A, B]) for (let i = 0; i < P.length; i++) {
    const a = P[i], b = P[(i + 1) % P.length], nx = a.y - b.y, ny = b.x - a.x;
    let a0 = 1e18, a1 = -1e18, b0 = 1e18, b1 = -1e18;
    for (const p of A) { const d = p.x * nx + p.y * ny; if (d < a0) a0 = d; if (d > a1) a1 = d; }
    for (const p of B) { const d = p.x * nx + p.y * ny; if (d < b0) b0 = d; if (d > b1) b1 = d; }
    const m = Math.hypot(nx, ny) || 1; if (a1 + 1 * m <= b0 || b1 + 1 * m <= a0) return false;
  } return true;
}
const labelHit = poly => LBL.some(q => satOverlap(poly, q));
/* linie wymiaru (w px): pomocnicze + wymiarowa – rejestrowane z góry, żeby etykiety innych wymiarów je omijały */
function dimLines(p1, p2, u, c) {
  const g = dimGeom(p1, p2, u, c), A = S2(p1), B = S2(p2), Q1 = S2(g.q1), Q2 = S2(g.q2), out = [];
  for (const [P, Q] of [[A, Q1], [B, Q2]]) { const dx = Q.x - P.x, dy = Q.y - P.y, d = Math.hypot(dx, dy); if (d > GAP_PX + 2) { const ex = dx / d, ey = dy / d; out.push([P.x + ex * GAP_PX, P.y + ey * GAP_PX, Q.x + ex * EXT_PX, Q.y + ey * EXT_PX]); } }
  const L = Math.hypot(Q2.x - Q1.x, Q2.y - Q1.y); if (L > .5) { const ux = (Q2.x - Q1.x) / L, uy = (Q2.y - Q1.y) / L; out.push([Q1.x - ux * 5, Q1.y - uy * 5, Q2.x + ux * 5, Q2.y + uy * 5]); }
  return out;
}

/* Wymiar „po bożemu”: linie pomocnicze, linia wymiarowa z kreskami 45°, liczba nad linią.
   Kolejność prób: na linii → przesunięta wzdłuż linii → tuż za linią (bliżej / dalej) →
   pole z wartością na odnośniku: ukośnie 45° i dalej poziomo (półka). Pola nie mogą nachodzić na siebie
   ani na linie rysunku/innych wymiarów. o.id = identyfikator (jego własne linie nie są przeszkodą). */
function drawDim(p1, p2, u, c, color, label, o) {
  o = o || {}; const me = o.id === undefined ? -2 : o.id;
  const g = dimGeom(p1, p2, u, c), A = S2(p1), B = S2(p2), Q1 = S2(g.q1), Q2 = S2(g.q2);
  ctx.save(); ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineCap = 'butt'; ctx.lineJoin = 'round';
  const L = Math.hypot(Q2.x - Q1.x, Q2.y - Q1.y);
  if (o.sel && L > 0.5) { ctx.save(); ctx.strokeStyle = C.sel; ctx.globalAlpha = .3; ctx.lineWidth = 8; line(Q1.x, Q1.y, Q2.x, Q2.y); ctx.restore(); }
  ctx.lineWidth = 1;
  for (const [P, Q] of [[A, Q1], [B, Q2]]) {
    const dx = Q.x - P.x, dy = Q.y - P.y, d = Math.hypot(dx, dy);
    if (d > GAP_PX + 2) { const ex = dx / d, ey = dy / d; line(P.x + ex * GAP_PX, P.y + ey * GAP_PX, Q.x + ex * EXT_PX, Q.y + ey * EXT_PX); }
  }
  if (L < 0.5) { ctx.restore(); return; }
  const ux = (Q2.x - Q1.x) / L, uy = (Q2.y - Q1.y) / L;
  line(Q1.x - ux * 5, Q1.y - uy * 5, Q2.x + ux * 5, Q2.y + uy * 5);
  ctx.lineWidth = 2.2; const k = Math.SQRT1_2, tx = (ux + uy) * k, ty = (uy - ux) * k;
  for (const Q of [Q1, Q2]) line(Q.x - tx * 5, Q.y - ty * 5, Q.x + tx * 5, Q.y + ty * 5);
  let ang = Math.atan2(uy, ux); if (ang >= Math.PI / 2 - 1e-9 || ang < -Math.PI / 2 - 1e-9) ang += Math.PI;
  ctx.font = '600 13px Arial, sans-serif';
  const tw = ctx.measureText(label).width, hw = tw / 2 + 4, ex = { x: Math.cos(ang), y: Math.sin(ang) }, ey = { x: -Math.sin(ang), y: Math.cos(ang) };
  const M = { x: (Q1.x + Q2.x) / 2, y: (Q1.y + Q2.y) / 2 };
  let cross = false; for (const ob of OBS) if (ob[4] !== me && segCross(Q1, Q2, ob)) { cross = true; break; }
  const cands = [];
  if (!cross) {
    const room = L / 2 - hw - 3;
    if (tw + 14 <= L) { cands.push(0); if (room > 6) cands.push(room / 2, -room / 2, room, -room); }
    const t = L / 2 + hw + 8; cands.push(t, -t, t + 2 * hw + 6, -(t + 2 * hw + 6));
  }
  const inPoly = (P) => [[-hw, -19], [hw, -19], [hw, 1], [-hw, 1]].map(([lx, ly]) => ({ x: P.x + ex.x * lx + ey.x * ly, y: P.y + ex.y * lx + ey.y * ly }));
  let pos = null;
  for (const t of cands) { const P = { x: M.x + ux * t, y: M.y + uy * t }; if (blockedLocal(P, ex, ey, hw, me)) continue; const poly = inPoly(P); if (labelHit(poly)) continue; pos = { t, P, poly }; break; }
  if (pos) { // etykieta na linii lub tuż za nią
    const { t, P, poly } = pos;
    if (Math.abs(t) > L / 2) { ctx.lineWidth = 1; const s = Math.sign(t), E = { x: M.x + ux * s * L / 2, y: M.y + uy * s * L / 2 }; line(E.x, E.y, P.x - ux * s * hw, P.y - uy * s * hw); }
    ctx.save(); ctx.translate(P.x, P.y); ctx.rotate(ang); ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 3.5; ctx.strokeText(label, 0, -3); ctx.fillText(label, 0, -3); ctx.restore();
    for (let i = 0; i < 4; i++) OBS.push([poly[i].x, poly[i].y, poly[(i + 1) % 4].x, poly[(i + 1) % 4].y, me]);
    LBL.push(poly);
  } else { // pole z odnośnikiem: ukośnie 45°, potem półka poziomo do pola
    const bw = tw / 2 + 7, bh = 11, SH = 10, SQ = Math.SQRT1_2;
    const away = { x: M.x - CEN.x, y: M.y - CEN.y }, ord = [];
    for (const sx of [1, -1]) for (const sy of [1, -1]) ord.push({ sx, sy, pr: -(away.x * sx + away.y * sy) });
    ord.sort((a, b) => a.pr - b.pr);
    let best = null;
    search: for (const len of [26, 44, 68, 98, 134]) for (const d of ord) {
      const K = { x: M.x + d.sx * SQ * len, y: M.y + d.sy * SQ * len }, E = { x: K.x + d.sx * SH, y: K.y };
      const B = { x: E.x + d.sx * bw, y: E.y }, r = { x0: B.x - bw, y0: B.y - bh, x1: B.x + bw, y1: B.y + bh }, poly = rectPoly(r);
      let sc = 0; if (boxBlocked(r, -3)) sc += 20; if (labelHit(poly)) sc += 20;
      for (const ob of OBS) if (ob[4] !== me && (segCross(M, K, ob) || segCross(K, E, ob))) sc += 5;
      if (r.x0 < 2 || r.y0 < 2 || r.x1 > W - 2 || r.y1 > H - 2) sc += 2;
      if (!best || sc < best.sc) best = { sc, K, E, B, r, poly }; if (sc === 0) break search;
    }
    ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(M.x, M.y); ctx.lineTo(best.K.x, best.K.y); ctx.lineTo(best.E.x, best.E.y); ctx.stroke();
    ctx.beginPath(); ctx.arc(M.x, M.y, 2.4, 0, Math.PI * 2); ctx.fill();
    const r = best.r; ctx.fillStyle = '#fff'; ctx.fillRect(r.x0, r.y0, bw * 2, bh * 2);
    ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(r.x0, r.y0, bw * 2, bh * 2);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(label, best.B.x, best.B.y + 1);
    const pl = best.poly; for (let i = 0; i < 4; i++) OBS.push([pl[i].x, pl[i].y, pl[(i + 1) % 4].x, pl[(i + 1) % 4].y, me]);
    OBS.push([M.x, M.y, best.K.x, best.K.y, me], [best.K.x, best.K.y, best.E.x, best.E.y, me]); LBL.push(pl);
  }
  ctx.restore();
}

/* ---------- teksty ---------- */
const mctx = document.createElement('canvas').getContext('2d');
function textBox(t) {
  const lines = String(t.txt).split('\n'); mctx.font = (t.bold ? '700 ' : '500 ') + t.h + 'px Arial, sans-serif';
  let w = 0; for (const l of lines) w = Math.max(w, mctx.measureText(l).width);
  return { w, h: lines.length * t.h * 1.25, lines };
}
function drawTexts(clean) {
  for (const t of S.texts) {
    const px = t.h * view.s; if (px < 2.5) continue; const b = textBox(t), x = X(t.x), y = Y(t.y), pad = px * 0.35;
    ctx.save(); ctx.font = (t.bold ? '700 ' : '500 ') + px + 'px Arial, sans-serif'; ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = t.col || '#000';
    b.lines.forEach((l, i) => ctx.fillText(l, x, y + i * px * 1.25));
    if (t.box) { ctx.strokeStyle = t.col || '#000'; ctx.lineWidth = 1.5; ctx.strokeRect(x - pad, y - pad, b.w * view.s + 2 * pad, b.h * view.s + 2 * pad - px * .25); }
    if (!clean && st.sel && st.sel.t === 'text' && st.sel.id === t.id) { ctx.strokeStyle = C.sel; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.strokeRect(x - pad - 2, y - pad - 2, b.w * view.s + 2 * pad + 4, b.h * view.s + 2 * pad + 2 - px * .25); }
    ctx.restore();
  }
}

/* ---------- obszary: przestrzenie i kreskowanie murów ---------- */
function facePath(f) {
  ctx.beginPath();
  for (const poly of [f.poly, ...f.holes.map(h => h.poly)]) { poly.forEach((p, i) => { const x = X(p.x), y = Y(p.y); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }); ctx.closePath(); }
}
function drawAreas(clean) {
  const fl = areaFaces();
  if (!clean && st.hoverFace && ui.tool === 'area') { facePath(st.hoverFace); ctx.fillStyle = 'rgba(250,204,21,.35)'; ctx.fill('evenodd'); }
  for (const { a, f } of fl) {
    facePath(f);
    if (a.kind === 'space') { ctx.fillStyle = 'rgba(13,148,136,.10)'; ctx.fill('evenodd'); }
    else if (HATCH[a.kind]) drawMaterial(a.kind, f);
    else if (a.kind === 'wallx' || a.kind === 'walli') {
      ctx.fillStyle = a.kind === 'wallx' ? '#e5e7eb' : '#f3f4f6'; ctx.fill('evenodd');
      ctx.save(); facePath(f); ctx.clip('evenodd');
      let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const p of f.poly) { x0 = Math.min(x0, X(p.x)); x1 = Math.max(x1, X(p.x)); y0 = Math.min(y0, Y(p.y)); y1 = Math.max(y1, Y(p.y)); }
      const sp = a.kind === 'wallx' ? 6 : 10, hh = y1 - y0;
      ctx.strokeStyle = a.kind === 'wallx' ? '#374151' : '#6b7280'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
      if ((x1 - x0 + hh) / sp < 3000) for (let k = x0 - hh; k <= x1; k += sp) line(k, y1, k + hh, y0);
      ctx.restore();
    }
    if (!clean && st.sel && st.sel.t === 'area' && st.sel.id === a.id) { facePath(f); ctx.strokeStyle = C.sel; ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.stroke(); ctx.setLineDash([]); }
  }
}
function drawAreaLabels() {
  for (const { a, f } of areaFaces()) if (HATCH[a.kind] && a.name) { const x = X(f.ip.x), y = Y(f.ip.y); ctx.save(); ctx.font = '600 12px Arial, sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; const tw = ctx.measureText(a.name).width; ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(x - tw / 2 - 3, y - 8, tw + 6, 16); ctx.fillStyle = '#111'; ctx.fillText(a.name, x, y); ctx.restore(); }
  for (const { a, f } of areaFaces()) if (a.kind === 'space') {
    const x = X(f.ip.x), y = Y(f.ip.y); ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#0f766e';
    ctx.font = '700 14px Arial, sans-serif'; ctx.textBaseline = 'bottom'; if (a.name) ctx.fillText(a.name, x, y);
    ctx.font = '500 12px Arial, sans-serif'; ctx.textBaseline = 'top'; ctx.fillText((f.area / 1e6).toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' m²', x, y + 1); ctx.restore();
  }
}

/* ---------- arkusz i tabelka rysunkowa ---------- */
const sm = () => S.sheet.m || { t: 15, r: 15, b: 15, l: 15 };
const tbDims = () => { const sh = S.sheet, m = sm(), rows = Math.ceil(S.proj.tb.length / 2), sc = sh.tbs || 1, W0 = Math.min(180, sh.pw - m.l - m.r), H0 = 12 + rows * 9;
  return { W0, H0, sc, Wb: W0 * sc, Hb: H0 * sc, x: sh.pw - m.r - W0 * sc, y: sh.ph - m.b - H0 * sc }; };
function tbRectW() { const d = tbDims(), sh = S.sheet; return { x0: sh.fx + d.x * sh.N, y0: sh.fy + d.y * sh.N, x1: sh.fx + (d.x + d.Wb) * sh.N, y1: sh.fy + (d.y + d.Hb) * sh.N }; }
const tokens = v => String(v).replace('{skala}', '1:' + S.sheet.N).replace('{data}', new Date().toLocaleDateString('pl-PL')).replace('{format}', S.sheet.fmt + (S.sheet.land ? ' poz.' : ' pion.'));
function drawSheet(clean) {
  const sh = S.sheet, k = sh.N * view.s, x0 = X(sh.fx), y0 = Y(sh.fy), w = sh.pw * k, h = sh.ph * k, mm = sm();
  ctx.save();
  if (!clean) {
    ctx.fillStyle = 'rgba(0,0,0,.14)'; ctx.fillRect(x0 + 5, y0 + 5, w, h); ctx.fillStyle = '#fff'; ctx.fillRect(x0, y0, w, h);
    ctx.strokeStyle = '#9ca3af'; ctx.lineWidth = 1; ctx.strokeRect(x0, y0, w, h);
    ctx.fillStyle = '#4b5563'; ctx.font = '600 12px Arial, sans-serif'; ctx.textBaseline = 'bottom'; ctx.textAlign = 'left';
    ctx.fillText(sh.fmt + (sh.land ? ' pozioma' : ' pionowa') + ' · skala 1:' + sh.N + ' · marginesy G/P/D/L ' + [mm.t, mm.r, mm.b, mm.l].join('/') + ' mm', x0, y0 - 5);
  }
  if (!clean || sh.frame) { ctx.strokeStyle = clean ? '#000' : '#6366f1'; ctx.lineWidth = clean ? (sh.frameW || 1) : 1.3; if (!clean) ctx.setLineDash([7, 4]);
    ctx.strokeRect(x0 + mm.l * k, y0 + mm.t * k, w - (mm.l + mm.r) * k, h - (mm.t + mm.b) * k); }
  ctx.restore();
}
function drawTB(clean) {
  const sh = S.sheet, k = sh.N * view.s, d = tbDims(), Wb = d.W0, Hb = d.H0, tb = S.proj.tb;
  ctx.save(); ctx.translate(X(sh.fx) + d.x * k, Y(sh.fy) + d.y * k); ctx.scale(k * d.sc, k * d.sc);
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, Wb, Hb); ctx.strokeStyle = '#111'; ctx.lineWidth = .6; ctx.strokeRect(0, 0, Wb, Hb);
  ctx.lineWidth = .3; line(0, 12, Wb, 12); line(Wb / 2, 12, Wb / 2, Hb);
  ctx.fillStyle = '#111'; ctx.textBaseline = 'middle'; ctx.textAlign = 'left';
  ctx.font = '700 5px Arial, sans-serif'; let nm = S.proj.name || ''; while (nm.length > 3 && ctx.measureText(nm).width > Wb - 50) nm = nm.slice(0, -2);
  ctx.fillText(nm, 3, 6.3); ctx.textAlign = 'right'; ctx.font = '600 3px Arial, sans-serif'; ctx.fillText(sh.fmt + '  ·  1:' + sh.N, Wb - 3, 6.3);
  tb.forEach((f, i) => {
    const r = Math.floor(i / 2), c = i % 2, cx = c * Wb / 2, cy = 12 + r * 9; ctx.lineWidth = .3; if (r > 0) line(cx, cy, cx + Wb / 2, cy);
    ctx.textAlign = 'left'; ctx.textBaseline = 'top'; ctx.fillStyle = '#6b7280'; ctx.font = '500 2.2px Arial, sans-serif'; ctx.fillText(f.l, cx + 1.5, cy + 1);
    const v = tokens(f.v); let fs = 3.6; ctx.font = '600 ' + fs + 'px Arial, sans-serif'; const tw = ctx.measureText(v).width || 1;
    if (tw > Wb / 2 - 3) { fs = Math.max(1.6, fs * (Wb / 2 - 3) / tw); ctx.font = '600 ' + fs + 'px Arial, sans-serif'; }
    ctx.fillStyle = '#111'; ctx.textBaseline = 'alphabetic'; ctx.fillText(v, cx + 1.5, cy + 7.4);
  });
  ctx.restore();
  if (!clean && st.sel && st.sel.t === 'tb') {
    const x = X(sh.fx) + d.x * k, y = Y(sh.fy) + d.y * k, w = d.Wb * k, hh = d.Hb * k;
    ctx.save(); ctx.strokeStyle = C.sel; ctx.lineWidth = 2; ctx.setLineDash([6, 4]); ctx.strokeRect(x - 3, y - 3, w + 6, hh + 6); ctx.setLineDash([]);
    ctx.fillStyle = '#fff'; ctx.fillRect(x - 7, y - 7, 12, 12); ctx.strokeRect(x - 7, y - 7, 12, 12); ctx.restore();
  }
}
function bbox() {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; const add = (x, y) => { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); };
  for (const s of S.segs) { add(s.a.x, s.a.y); add(s.b.x, s.b.y); }
  for (const d of S.dims) { const g = dimGeom(d.p1, d.p2, dimU(d.mode, d.p1, d.p2), d.c); add(d.p1.x, d.p1.y); add(d.p2.x, d.p2.y); add(g.q1.x, g.q1.y); add(g.q2.x, g.q2.y); }
  for (const t of S.texts) { const b = textBox(t); add(t.x, t.y); add(t.x + b.w, t.y + b.h); }
  for (const o of S.objs) for (const c of objCorners(o)) add(c.x, c.y);
  return isFinite(x0) ? { x0, y0, x1, y1 } : null;
}
function layoutSheet() {
  const sh = S.sheet; if (sh.fmt === 'free') return; const base = PAPER[sh.fmt], bb = bbox() || { x0: -1000, y0: -700, x1: 1000, y1: 700 };
  const bw = Math.max(bb.x1 - bb.x0, 1), bh = Math.max(bb.y1 - bb.y0, 1), m = sm(), pad = 14;
  const tbH = sh.tb ? (12 + Math.ceil(S.proj.tb.length / 2) * 9) * (sh.tbs || 1) + 6 : 0; let best = null;
  for (const o of (sh.orient === 'auto' ? ['l', 'p'] : [sh.orient === 'land' ? 'l' : 'p'])) {
    const PW = o === 'l' ? base[1] : base[0], PH = o === 'l' ? base[0] : base[1], aw = PW - m.l - m.r, ah = PH - m.t - m.b - tbH;
    let N = null, fits;
    if (sh.scale === 'max') { N = Math.max(0.01, Math.ceil(Math.max(bw / Math.max(aw - 2 * pad, 1), bh / Math.max(ah - 2 * pad, 1)) * 100) / 100); fits = aw > 2 * pad && ah > 2 * pad; }
    else { const list = sh.scale === 'auto' ? SCALES : [Math.max(0.01, Number(sh.scale) || 1)]; for (const n of list) if (bw / n + 2 * pad <= aw && bh / n + 2 * pad <= ah) { N = n; break; } fits = N !== null; if (!fits) N = list[list.length - 1]; }
    const cd = { o, PW, PH, N, aw, ah, fits };
    if (!best || (cd.fits && !best.fits) || (cd.fits === best.fits && (cd.N < best.N || (cd.N === best.N && (bw >= bh) === (o === 'l'))))) best = cd;
  }
  sh.N = best.N; sh.pw = best.PW; sh.ph = best.PH; sh.land = best.o === 'l'; sh.fits = best.fits;
  const off = sh.off || { x: 0, y: 0 }; sh.cen = { x: m.l + best.aw / 2, y: m.t + best.ah / 2 };
  sh.fx = (bb.x0 + bb.x1) / 2 - (sh.cen.x + off.x) * best.N; sh.fy = (bb.y0 + bb.y1) / 2 - (sh.cen.y + off.y) * best.N;
}
function syncOff() { const sh = S.sheet, bb = bbox(); if (!bb || !sh.cen) return; sh.off = { x: ((bb.x0 + bb.x1) / 2 - sh.fx) / sh.N - sh.cen.x, y: ((bb.y0 + bb.y1) / 2 - sh.fy) / sh.N - sh.cen.y }; }
function allRect() { const bb = bbox(); return bb ? { x0: X(bb.x0) - 14, y0: Y(bb.y0) - 14, x1: X(bb.x1) + 14, y1: Y(bb.y1) + 14 } : null; }

/* ---------- siatka, znaczniki, podgląd ---------- */
function drawGrid() {
  if (!ui.grid) return;
  const steps = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000], minor = steps.find(s => s * view.s >= 10) || steps[steps.length - 1];
  const major = String(minor)[0] === '1' ? minor * 5 : minor * 2, w0 = toW(0, 0), w1 = toW(W, H);
  const i0 = Math.floor(w0.x / minor), i1 = Math.ceil(w1.x / minor), j0 = Math.floor(w0.y / minor), j1 = Math.ceil(w1.y / minor);
  for (const pass of [0, 1]) {
    ctx.strokeStyle = pass ? 'rgba(148,163,184,.55)' : 'rgba(148,163,184,.22)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let i = i0; i <= i1; i++) { if ((pass === 1) !== (Math.round(i * minor) % major === 0)) continue; const x = Math.round(X(i * minor)) + .5; ctx.moveTo(x, 0); ctx.lineTo(x, H); }
    for (let j = j0; j <= j1; j++) { if ((pass === 1) !== (Math.round(j * minor) % major === 0)) continue; const y = Math.round(Y(j * minor)) + .5; ctx.moveTo(0, y); ctx.lineTo(W, y); }
    ctx.stroke();
  }
}
function marker(x, y, kind) {
  const px = X(x), py = Y(y); ctx.save(); ctx.lineWidth = 2;
  if (kind === 'point') { ctx.strokeStyle = C.sel; ctx.strokeRect(px - 7, py - 7, 14, 14); }
  else if (kind === 'line') { ctx.strokeStyle = '#0ea5e9'; ctx.beginPath(); ctx.moveTo(px, py - 8); ctx.lineTo(px + 8, py); ctx.lineTo(px, py + 8); ctx.lineTo(px - 8, py); ctx.closePath(); ctx.stroke(); }
  else { ctx.strokeStyle = kind === 'align' ? '#a78bfa' : '#667085'; ctx.beginPath(); ctx.arc(px, py, 4.5, 0, Math.PI * 2); ctx.stroke(); }
  ctx.restore();
}
function drawGuides(gs) { ctx.save(); for (const g of gs || []) { ctx.strokeStyle = '#a78bfa'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]); if (g.axis === 'x') line(X(g.v), 0, X(g.v), H); else line(0, Y(g.v), W, Y(g.v)); } ctx.restore(); }
function drawPreview() {
  if (st.drag) return;
  if (ui.tool === 'line') {
    if (!st.start) { const p = snapPt({}); st.snap = p; drawGuides(p.guides); marker(p.x, p.y, p.kind); return; }
    const a = st.start, e = computeEnd(); st.snap = e; drawGuides(e.guides);
    ctx.save(); ctx.setLineDash([7, 5]); ctx.strokeStyle = e.manual ? C.man : '#667085'; ctx.lineWidth = 2.5; line(X(a.x), Y(a.y), X(e.x), Y(e.y)); ctx.restore();
    const L = Math.hypot(e.x - a.x, e.y - a.y);
    if (L > 0.5) { const side = outwardSide({ a, b: e }), u = { x: (e.x - a.x) / L, y: (e.y - a.y) / L }, n = { x: -u.y, y: u.x };
      drawDim(a, e, u, a.x * n.x + a.y * n.y + side * OFF_PX / view.s, e.manual ? C.man : C.grey, fmt(L)); }
    marker(e.x, e.y, e.kind);
    if (st.buf !== '') {
      const txt = st.buf + ' mm'; ctx.save(); ctx.font = '700 15px Arial, sans-serif'; const tw = ctx.measureText(txt).width, bx = X(e.x) + 14, by = Y(e.y) - 34;
      ctx.fillStyle = '#fff'; ctx.strokeStyle = C.man; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.roundRect(bx, by, tw + 16, 26, 6); ctx.fill(); ctx.stroke();
      ctx.fillStyle = C.man; ctx.textBaseline = 'middle'; ctx.fillText(txt, bx + 8, by + 13); ctx.restore();
    }
  } else if (ui.tool === 'dim') {
    if (!st.dimP1) { const p = snapPt({}); st.snap = p; drawGuides(p.guides); marker(p.x, p.y, p.kind); }
    else if (!st.dimP2) {
      const { p, mode } = dimPick(); st.snap = p; drawGuides(p.guides); marker(st.dimP1.x, st.dimP1.y, 'point');
      ctx.save(); ctx.setLineDash([6, 4]); ctx.strokeStyle = C.tool; ctx.lineWidth = 1.5; line(X(st.dimP1.x), Y(st.dimP1.y), X(p.x), Y(p.y)); ctx.restore();
      ctx.save(); ctx.font = '600 13px Arial, sans-serif'; ctx.fillStyle = C.tool; ctx.fillText(fmt(measure(mode, st.dimP1, p)), X(p.x) + 12, Y(p.y) - 10); ctx.restore(); marker(p.x, p.y, p.kind);
    } else {
      marker(st.dimP1.x, st.dimP1.y, 'point'); marker(st.dimP2.x, st.dimP2.y, 'point');
      const u = dimU(st.dimEff, st.dimP1, st.dimP2); drawDim(st.dimP1, st.dimP2, u, cFromMouse(u, st.dimEff), C.tool, fmt(measure(st.dimEff, st.dimP1, st.dimP2)));
    }
  } else if (ui.tool === 'text') { const p = snapPt({}); st.snap = p; marker(p.x, p.y, p.kind); }
  else if (ui.tool === 'place') { const o = placeObj(); if (o) { st.snap = snapPt({}); drawObj(o, { alpha: .7 }); if (o.k === 'op' && o.onWall) { const B = objBox(o), c = objXf(o)(B.bw / 2, B.bh / 2); marker(c[0], c[1], 'line'); } } }
}
function drawScaleBar() {
  const cands = [10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000], len = cands.find(v => v * view.s >= 80) || cands[cands.length - 1], px = len * view.s, x0 = 16, y0 = H - 18;
  ctx.save(); ctx.strokeStyle = '#475467'; ctx.fillStyle = '#475467'; ctx.lineWidth = 2; line(x0, y0, x0 + px, y0); line(x0, y0 - 5, x0, y0 + 5); line(x0 + px, y0 - 5, x0 + px, y0 + 5);
  ctx.font = '12px Arial, sans-serif'; ctx.textBaseline = 'bottom'; ctx.textAlign = 'left'; ctx.fillText(len >= 1000 ? (len / 1000) + ' m' : len + ' mm', x0 + 4, y0 - 6); ctx.restore();
}

/* ---------- scena ---------- */
function drawScene(o) {
  const clean = !!o.clean, sheet = S.sheet.fmt !== 'free' && S.sheet.pw > 0;
  if (!clean) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.fillStyle = (sheet && !clean) ? '#dde1ea' : '#fff'; ctx.fillRect(0, 0, W, H);
  buildObs(); if (sheet) drawSheet(clean); if (!clean) drawGrid();
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.setLineDash([]);
  drawAreas(clean);
  const isSel = (t, id) => !clean && st.sel && st.sel.t === t && st.sel.id === id;
  for (const s of S.segs) { const sel = isSel('seg', s.id); ctx.strokeStyle = sel ? C.sel : (s.col || '#000'); ctx.lineWidth = sel ? 4.5 : 3; line(X(s.a.x), Y(s.a.y), X(s.b.x), Y(s.b.y)); }
  drawObjs(clean);
  if (S.sheet.fmt !== 'free' || true) if (ui.showDims) {
    const specs = [];
    for (const s of S.segs) if (s.dm) { const q = segDimParams(s, o.offW); specs.push({ p1: s.a, p2: s.b, u: q.u, c: q.c, col: s.dm === 1 ? C.man : C.tool, lab: fmt(q.L), sel: isSel('seg', s.id) }); }
    for (const d of S.dims) specs.push({ p1: d.p1, p2: d.p2, u: dimU(d.mode, d.p1, d.p2), c: d.c, col: C.tool, lab: fmt(measure(d.mode, d.p1, d.p2)), sel: isSel('dim', d.id) });
    specs.forEach((q, i) => { q.id = i; q.len = Math.hypot(S2(q.p2).x - S2(q.p1).x, S2(q.p2).y - S2(q.p1).y); for (const l of dimLines(q.p1, q.p2, q.u, q.c)) OBS.push([l[0], l[1], l[2], l[3], i]); });
    specs.sort((a, b) => a.len - b.len); // krótkie (mało miejsca) dostają etykiety w pierwszej kolejności
    for (const q of specs) drawDim(q.p1, q.p2, q.u, q.c, q.col, q.lab, { sel: q.sel, id: q.id });
  }
  drawAreaLabels(); drawTexts(clean);
  if (!clean) {
    const big = ui.tool === 'sel';
    for (const p of pts()) { const x = X(p.x), y = Y(p.y), r = big ? 5 : 3, hot = st.sel && st.sel.t === 'vtx' && same(st.sel, p);
      ctx.fillStyle = hot ? C.sel : '#fff'; ctx.strokeStyle = hot ? '#047857' : '#111'; ctx.lineWidth = 1.5; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); ctx.strokeRect(x - r, y - r, 2 * r, 2 * r); }
  }
  if (!clean && st.sel && st.sel.t === 'all') { const r = allRect(); if (r) {
    ctx.save(); ctx.strokeStyle = C.sel; ctx.lineWidth = 2; ctx.setLineDash([8, 5]); ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(18,184,134,.06)'; ctx.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0);
    if (sheet) { ctx.fillStyle = '#fff'; ctx.fillRect(r.x1 - 6, r.y1 - 6, 12, 12); ctx.strokeRect(r.x1 - 6, r.y1 - 6, 12, 12); } ctx.restore(); } }
  if (sheet && S.sheet.tb) drawTB(clean);
  if (!clean) { drawPreview(); drawScaleBar(); updateStatus(); }
}
