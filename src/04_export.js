
/* ---------- rejestrator Canvas2D → SVG (ten sam kod rysuje ekran, PNG i druk wektorowy) ---------- */
function makeRecorder() {
  const out = [], defs = [], stack = []; let m = [1, 0, 0, 1, 0, 0], d = '', cid = 0, curClip = null;
  const mc = document.createElement('canvas').getContext('2d');
  const P = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const sc = () => Math.sqrt(Math.abs(m[0] * m[3] - m[1] * m[2]));
  const mul = n => { const [a, b, c, dd, e, f] = m; m = [a * n[0] + c * n[1], b * n[0] + dd * n[1], a * n[2] + c * n[3], b * n[2] + dd * n[3], a * n[4] + c * n[5] + e, b * n[4] + dd * n[5] + f]; };
  const f2 = v => +v.toFixed(2), esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const r = {
    strokeStyle: '#000', fillStyle: '#000', lineWidth: 1, lineCap: 'butt', lineJoin: 'miter', globalAlpha: 1, font: '12px Arial', textAlign: 'left', textBaseline: 'alphabetic', _dash: [],
    save() { stack.push({ m: m.slice(), curClip, ss: r.strokeStyle, fs: r.fillStyle, lw: r.lineWidth, lc: r.lineCap, lj: r.lineJoin, ga: r.globalAlpha, f: r.font, ta: r.textAlign, tb: r.textBaseline, dd: r._dash }); },
    restore() { const s = stack.pop(); if (!s) return; m = s.m; curClip = s.curClip; r.strokeStyle = s.ss; r.fillStyle = s.fs; r.lineWidth = s.lw; r.lineCap = s.lc; r.lineJoin = s.lj; r.globalAlpha = s.ga; r.font = s.f; r.textAlign = s.ta; r.textBaseline = s.tb; r._dash = s.dd; },
    translate(x, y) { mul([1, 0, 0, 1, x, y]); }, scale(x, y) { mul([x, 0, 0, y, 0, 0]); }, rotate(a) { const c = Math.cos(a), s = Math.sin(a); mul([c, s, -s, c, 0, 0]); },
    setTransform(a, b, c, dd, e, f) { m = [a, b, c, dd, e, f]; }, setLineDash(a) { r._dash = a; },
    beginPath() { d = ''; }, closePath() { d += 'Z'; },
    moveTo(x, y) { const p = P(x, y); d += 'M' + f2(p[0]) + ' ' + f2(p[1]); }, lineTo(x, y) { const p = P(x, y); d += 'L' + f2(p[0]) + ' ' + f2(p[1]); },
    arc(x, y, rr) { const p = P(x, y), q = rr * sc(); d += 'M' + f2(p[0] - q) + ' ' + f2(p[1]) + 'A' + f2(q) + ' ' + f2(q) + ' 0 1 0 ' + f2(p[0] + q) + ' ' + f2(p[1]) + 'A' + f2(q) + ' ' + f2(q) + ' 0 1 0 ' + f2(p[0] - q) + ' ' + f2(p[1]); },
    rect(x, y, w, h) { r.moveTo(x, y); r.lineTo(x + w, y); r.lineTo(x + w, y + h); r.lineTo(x, y + h); r.closePath(); }, roundRect(x, y, w, h) { r.rect(x, y, w, h); },
    _clip() { return curClip ? ' clip-path="url(#' + curClip + ')"' : ''; },
    _stroke() { const da = r._dash.length ? ' stroke-dasharray="' + r._dash.map(v => f2(v * sc())).join(' ') + '"' : ''; return ' stroke="' + r.strokeStyle + '" stroke-width="' + f2(r.lineWidth * sc()) + '" stroke-linecap="' + r.lineCap + '" stroke-linejoin="' + r.lineJoin + '"' + da + (r.globalAlpha < 1 ? ' stroke-opacity="' + r.globalAlpha + '"' : ''); },
    stroke() { if (d) out.push('<path d="' + d + '" fill="none"' + r._stroke() + r._clip() + '/>'); },
    fill(rule) { if (d) out.push('<path d="' + d + '" fill="' + r.fillStyle + '" fill-rule="' + (rule || 'nonzero') + '"' + (r.globalAlpha < 1 ? ' fill-opacity="' + r.globalAlpha + '"' : '') + r._clip() + '/>'); },
    clip(rule) { const id = 'c' + (++cid); defs.push('<clipPath id="' + id + '"><path d="' + d + '" clip-rule="' + (rule || 'nonzero') + '"/></clipPath>'); curClip = id; },
    fillRect(x, y, w, h) { const o = d; r.beginPath(); r.rect(x, y, w, h); r.fill(); d = o; }, strokeRect(x, y, w, h) { const o = d; r.beginPath(); r.rect(x, y, w, h); r.stroke(); d = o; },
    measureText(t) { const mm = /(\d+|bold)\s+([\d.]+)px/.exec(r.font) || [0, 400, 12]; mc.font = mm[1] + ' ' + mm[2] + 'px Arial, sans-serif'; return mc.measureText(t); },
    _text(t, x, y, stroke) {
      const mm = /(\d+|bold)\s+([\d.]+)px/.exec(r.font) || [0, 400, 12], base = { bottom: 'text-after-edge', middle: 'central', top: 'text-before-edge' }[r.textBaseline];
      const anc = { center: 'middle', right: 'end', end: 'end' }[r.textAlign] || 'start';
      const el = '<text x="' + f2(x) + '" y="' + f2(y) + '" transform="matrix(' + m.map(v => +v.toFixed(5)).join(' ') + ')" font-family="Arial, sans-serif" font-size="' + mm[2] + '" font-weight="' + mm[1] + '" text-anchor="' + anc + '"' + (base ? ' dominant-baseline="' + base + '"' : '') +
        (stroke ? ' fill="none"' + r._stroke().replace(/stroke-width="[\d.]+"/, 'stroke-width="' + f2(r.lineWidth) + '"') : ' fill="' + r.fillStyle + '"') + '>' + esc(t) + '</text>';
      out.push(curClip ? '<g' + r._clip() + '>' + el + '</g>' : el);
    },
    fillText(t, x, y) { r._text(t, x, y, false); }, strokeText(t, x, y) { r._text(t, x, y, true); },
    svg(wpx, hpx, wmm, hmm) { return '<svg xmlns="http://www.w3.org/2000/svg" width="' + wmm + 'mm" height="' + hmm + 'mm" viewBox="0 0 ' + f2(wpx) + ' ' + f2(hpx) + '"><defs>' + defs.join('') + '</defs><rect width="100%" height="100%" fill="#fff"/>' + out.join('') + '</svg>'; }
  };
  return r;
}
function withView(nv, nW, nH, nctx, fn) {
  const o = { view, W, H, ctx }; view = nv; W = nW; H = nH; ctx = nctx;
  try { return fn(); } finally { view = o.view; W = o.W; H = o.H; ctx = o.ctx; }
}
function sheetSvg() { // wektorowy arkusz w skali, wyśrodkowany
  const sh = S.sheet, k = 1 / PXMM / sh.N, wpx = sh.pw / PXMM, hpx = sh.ph / PXMM, rec = makeRecorder();
  withView({ s: k, ox: -sh.fx * k, oy: -sh.fy * k }, wpx, hpx, rec, () => drawScene({ clean: true }));
  return rec.svg(wpx, hpx, sh.pw, sh.ph);
}
function freeSvg() {
  const bb = bbox(); if (!bb) return null; const s = Math.min(Math.max(view.s, 0.02), 2), pad = 70, wpx = (bb.x1 - bb.x0) * s + 2 * pad, hpx = (bb.y1 - bb.y0) * s + 2 * pad, rec = makeRecorder();
  withView({ s, ox: pad - bb.x0 * s, oy: pad - bb.y0 * s }, wpx, hpx, rec, () => drawScene({ clean: true }));
  return rec.svg(wpx, hpx, f1(wpx * PXMM), f1(hpx * PXMM));
}
const f1 = v => +v.toFixed(1);
function download(name, data, type) {
  const a = document.createElement('a'); a.href = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type })); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}
const fname = ext => ((S.proj.name || 'SimpleCAD').replace(/[^\w\-ąćęłńóśźżĄĆĘŁŃÓŚŹŻ ]+/g, '').trim().replace(/\s+/g, '_') || 'SimpleCAD') + '.' + ext;
function exportSvg() { const s = S.sheet.fmt !== 'free' && S.sheet.pw ? sheetSvg() : freeSvg(); if (!s) return alert('Rysunek jest pusty.'); download(fname('svg'), s, 'image/svg+xml'); }
function exportPng() {
  const f = 2.5, oc = document.createElement('canvas'), sh = S.sheet, sheet = sh.fmt !== 'free' && sh.pw;
  let wpx, hpx, nv;
  if (sheet) { const k = 1 / PXMM / sh.N; wpx = sh.pw / PXMM; hpx = sh.ph / PXMM; nv = { s: k, ox: -sh.fx * k, oy: -sh.fy * k }; }
  else { const bb = bbox(); if (!bb) return alert('Rysunek jest pusty.'); const s = Math.min(Math.max(view.s, 0.02), 2), pad = 70; wpx = (bb.x1 - bb.x0) * s + 2 * pad; hpx = (bb.y1 - bb.y0) * s + 2 * pad; nv = { s, ox: pad - bb.x0 * s, oy: pad - bb.y0 * s }; }
  oc.width = Math.round(wpx * f); oc.height = Math.round(hpx * f); const c2 = oc.getContext('2d'); c2.scale(f, f);
  withView(nv, wpx, hpx, c2, () => drawScene({ clean: true })); oc.toBlob(b => download(fname('png'), b));
}
function ensureSheet() { // gdy płótno swobodne – wybierz najmniejszy format A4–A0, w którym rysunek się mieści
  if (S.sheet.fmt !== 'free' && S.sheet.pw) return;
  let ok = false; for (const f of ['A4', 'A3', 'A2', 'A1', 'A0']) { S.sheet.fmt = f; layoutSheet(); if (S.sheet.fits) { ok = true; break; } }
  if (!ok) { S.sheet.fmt = 'A0'; layoutSheet(); } syncUI(); fit();
}
function exportPdf() { // PDF bez okna druku: obraz JPEG na stronie o rozmiarze arkusza
  ensureSheet(); const sh = S.sheet, dpi = Math.min(200, 7000 / (Math.max(sh.pw, sh.ph) / 25.4)), f = dpi / 96, wpx = sh.pw / PXMM, hpx = sh.ph / PXMM, k = 1 / PXMM / sh.N;
  const oc = document.createElement('canvas'); oc.width = Math.round(wpx * f); oc.height = Math.round(hpx * f); const c2 = oc.getContext('2d'); c2.scale(f, f);
  withView({ s: k, ox: -sh.fx * k, oy: -sh.fy * k }, wpx, hpx, c2, () => drawScene({ clean: true }));
  const bin = atob(oc.toDataURL('image/jpeg', 0.92).split(',')[1]), jpg = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) jpg[i] = bin.charCodeAt(i);
  const wpt = (sh.pw / 25.4 * 72).toFixed(2), hpt = (sh.ph / 25.4 * 72).toFixed(2), enc = t => new TextEncoder().encode(t), parts = [], offs = []; let pos = 0;
  const add = u => { parts.push(u); pos += u.length; }, obj = (n, body) => { offs[n] = pos; add(enc(n + ' 0 obj\n' + body + '\nendobj\n')); };
  add(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3, 0xcf, 0xd3, 0x0a]));
  obj(1, '<< /Type /Catalog /Pages 2 0 R >>'); obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
  obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + wpt + ' ' + hpt + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
  offs[4] = pos; add(enc('4 0 obj\n<< /Type /XObject /Subtype /Image /Width ' + oc.width + ' /Height ' + oc.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>\nstream\n')); add(jpg); add(enc('\nendstream\nendobj\n'));
  const cs = 'q ' + wpt + ' 0 0 ' + hpt + ' 0 0 cm /Im0 Do Q'; obj(5, '<< /Length ' + cs.length + ' >>\nstream\n' + cs + '\nendstream');
  const xr = pos; let x = 'xref\n0 6\n0000000000 65535 f \n'; for (let n = 1; n <= 5; n++) x += String(offs[n]).padStart(10, '0') + ' 00000 n \n';
  add(enc(x + 'trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n' + xr + '\n%%EOF')); download(fname('pdf'), new Blob(parts, { type: 'application/pdf' }));
}
function preparePrint() { // zawartość płótna → ukryty arkusz; @media print pokazuje tylko jego (działa dla Ctrl+P i menu drukowania)
  ensureSheet(); const sh = S.sheet;
  $('printRoot').innerHTML = sheetSvg();
  $('printStyle').textContent = '@page{size:' + sh.fmt + ' ' + (sh.land ? 'landscape' : 'portrait') + ';margin:0}@media print{#printRoot{width:' + sh.pw + 'mm;height:' + (sh.ph - 1) + 'mm;overflow:hidden}#printRoot svg{display:block;width:' + sh.pw + 'mm;height:' + sh.ph + 'mm}}';
}
function printSheet() { preparePrint(); window.print(); }
window.addEventListener('beforeprint', preparePrint);
window.addEventListener('afterprint', () => { $('printRoot').innerHTML = ''; $('printStyle').textContent = ''; });

/* ---------- DXF (R12 ASCII, mm) ---------- */
const ACI = [[1, 255, 0, 0], [2, 255, 255, 0], [3, 0, 255, 0], [4, 0, 255, 255], [5, 0, 0, 255], [6, 255, 0, 255], [7, 0, 0, 0], [8, 128, 128, 128], [9, 192, 192, 192], [30, 255, 127, 0]];
function aci(hex) {
  const n = parseInt(hex.slice(1), 16), r = n >> 16, g = (n >> 8) & 255, b = n & 255; let best = 7, bd = 1e9;
  for (const [i, R, G, B] of ACI) { const d = (R - r) ** 2 + (G - g) ** 2 + (B - b) ** 2; if (d < bd) { bd = d; best = i; } } return best;
}
function exportDxf() {
  if (!S.segs.length && !S.texts.length && !S.objs.length) return alert('Rysunek jest pusty.');
  const L = [], add = (...a) => a.forEach(x => L.push(String(x))), n = v => (+v.toFixed(3)), Yd = y => n(-y);
  const layers = { LINIE: 7, WYMIARY: 30, KRESKOWANIE: 8, PRZESTRZENIE: 3, OPISY: 7, OBIEKTY: 1 };
  add(0, 'SECTION', 2, 'HEADER', 9, '$ACADVER', 1, 'AC1009', 9, '$INSUNITS', 70, 4, 0, 'ENDSEC');
  add(0, 'SECTION', 2, 'TABLES', 0, 'TABLE', 2, 'LTYPE', 70, 1, 0, 'LTYPE', 2, 'CONTINUOUS', 70, 0, 3, 'Solid line', 72, 65, 73, 0, 40, 0, 0, 'ENDTAB');
  add(0, 'TABLE', 2, 'LAYER', 70, Object.keys(layers).length); for (const [k, c] of Object.entries(layers)) add(0, 'LAYER', 2, k, 70, 0, 62, c, 6, 'CONTINUOUS'); add(0, 'ENDTAB', 0, 'ENDSEC');
  add(0, 'SECTION', 2, 'ENTITIES');
  const ln = (lay, col, x1, y1, x2, y2) => add(0, 'LINE', 8, lay, 62, col, 10, n(x1), 20, Yd(y1), 30, 0, 11, n(x2), 21, Yd(y2), 31, 0);
  const tx = (lay, col, x, y, h, t, rot) => add(0, 'TEXT', 8, lay, 62, col, 10, n(x), 20, Yd(y), 30, 0, 40, n(h), 1, t, 50, n(rot || 0));
  for (const s of S.segs) ln('LINIE', aci(s.col || '#000000'), s.a.x, s.a.y, s.b.x, s.b.y);
  const dimOut = (p1, p2, u, c, col, label) => {
    const g = dimGeom(p1, p2, u, c), nn = { x: -u.y, y: u.x }, gap = 60, ext = 80, tk = 70;
    for (const [p, q] of [[p1, g.q1], [p2, g.q2]]) { const dx = q.x - p.x, dy = q.y - p.y, dd = Math.hypot(dx, dy) || 1; if (dd > gap) ln('WYMIARY', col, p.x + dx / dd * gap, p.y + dy / dd * gap, q.x + dx / dd * ext, q.y + dy / dd * ext); }
    ln('WYMIARY', col, g.q1.x, g.q1.y, g.q2.x, g.q2.y);
    for (const q of [g.q1, g.q2]) { const a = u.x + nn.x, b = u.y + nn.y, l = Math.hypot(a, b); ln('WYMIARY', col, q.x - a / l * tk / 2, q.y - b / l * tk / 2, q.x + a / l * tk / 2, q.y + b / l * tk / 2); }
    let ang = Math.atan2(-u.y, u.x) * 180 / Math.PI; if (ang > 90 || ang <= -90) ang += 180; const mx = (g.q1.x + g.q2.x) / 2, my = (g.q1.y + g.q2.y) / 2, th = 120, rad = ang * Math.PI / 180;
    tx('WYMIARY', col, mx - Math.cos(rad) * label.length * th * 0.3 - Math.sin(rad) * -0 + Math.sin(rad) * 0, my + Math.sin(rad) * label.length * th * 0.3 - 0, th, label, ang);
  };
  const offW = 600;
  for (const s of S.segs) if (s.dm) { const q = segDimParams(s, offW); dimOut(s.a, s.b, q.u, q.c, s.dm === 1 ? 30 : 5, String(Math.round(q.L * 10) / 10).replace('.', ',')); }
  for (const d of S.dims) dimOut(d.p1, d.p2, dimU(d.mode, d.p1, d.p2), d.c, 5, String(Math.round(measure(d.mode, d.p1, d.p2) * 10) / 10).replace('.', ','));
  for (const { a, f } of areaFaces()) {
    if (a.kind === 'space') tx('PRZESTRZENIE', 3, f.ip.x - 400, f.ip.y, 150, (a.name ? a.name + '  ' : '') + (f.area / 1e6).toFixed(2).replace('.', ',') + ' m2', 0);
    else if (a.kind === 'wallx' || a.kind === 'walli' || ['ceram', 'komork', 'zelbet', 'izol', 'beton'].includes(a.kind)) {
      const sp = (a.kind === 'wallx' ? 60 : a.kind === 'walli' ? 110 : 90) * Math.SQRT2, polys = [f.poly, ...f.holes.map(h => h.poly)];
      for (const sg of (a.kind === 'izol' ? [1, -1] : a.kind === 'ceram' ? [-1] : [1])) {
        let w0 = Infinity, w1 = -Infinity; for (const p of f.poly) { const v = p.x + sg * p.y; w0 = Math.min(w0, v); w1 = Math.max(w1, v); }
        for (let w = Math.ceil(w0 / sp) * sp; w <= w1; w += sp) {
          const hits = []; for (const poly of polys) for (let i = 0; i < poly.length; i++) { const p = poly[i], q = poly[(i + 1) % poly.length], wp = p.x + sg * p.y, wq = q.x + sg * q.y;
            if ((wp <= w) !== (wq <= w)) { const l = (w - wp) / (wq - wp); hits.push({ x: p.x + l * (q.x - p.x), y: p.y + l * (q.y - p.y) }); } }
          hits.sort((p, q) => (p.x - sg * p.y) - (q.x - sg * q.y)); for (let i = 0; i + 1 < hits.length; i += 2) ln('KRESKOWANIE', 8, hits[i].x, hits[i].y, hits[i + 1].x, hits[i + 1].y);
        }
      }
    }
  }
  for (const o of S.objs) for (const it of objGeom(o)) {
    if (it.t === 'mask') continue;
    const poly = it.t === 'poly' ? it.polys : [it.pts], cl = it.t === 'poly' || it.closed;
    for (const P of poly) { if (it.t === 'poly' && it.fill === MORTAR) continue; for (let i = 0; i + 1 < P.length; i++) ln('OBIEKTY', 1, P[i][0], P[i][1], P[i + 1][0], P[i + 1][1]); if (cl && P.length > 2) ln('OBIEKTY', 1, P[P.length - 1][0], P[P.length - 1][1], P[0][0], P[0][1]); }
  }
  for (const t of S.texts) { const b = textBox(t); b.lines.forEach((l, i) => tx('OPISY', aci(t.col || '#000000'), t.x, t.y + (i + 1) * t.h * 1.25 - t.h * .25, t.h * 0.9, l, 0)); }
  add(0, 'ENDSEC', 0, 'EOF');
  download(fname('dxf'), L.join('\r\n'), 'application/dxf');
}
