
/* =====================================================================
   WYPEŁNIENIA MATERIAŁOWE obszarów (kreskowanie wg oznaczeń rysunkowych, grunt i zieleń)
   Wzór jest kotwiczony do początku układu (stabilny przy przesuwaniu), a losowość deterministyczna.
   ===================================================================== */
const AREA_KINDS = [
  ['space', 'Przestrzeń (pomieszczenie) – nazwa i powierzchnia'], ['wallx', 'Mur / ściana zewnętrzna – kreskowanie gęste'], ['walli', 'Ściana działowa – kreskowanie rzadkie'],
  ['ceram', 'Pustak, cegła ceramiczna'], ['komork', 'Bloczki z betonu komórkowego'], ['zelbet', 'Element z żelbetu'], ['beton', 'Beton niezbrojony'],
  ['podsypka', 'Podsypka żwirowo-piaskowa'], ['izol', 'Izolacja termiczna'], ['trawa', 'Trawa'], ['ziemia', 'Ziemia (grunt rodzimy)'], ['piasek', 'Piasek'],
  ['glina', 'Glina'], ['rosl', 'Roślinność (krzewy, zieleń)'], ['zwir', 'Żwir'], ['none', 'Bez oznaczenia']];
const HATCH = { // fill – tło, ink – kolor znaków
  ceram: { fill: '#fff', ink: '#111' }, komork: { fill: '#fff', ink: '#111' }, zelbet: { fill: '#fff', ink: '#111' }, beton: { fill: '#f1f2f4', ink: '#333' },
  podsypka: { fill: '#fff', ink: '#222' }, izol: { fill: '#fff', ink: '#111' }, trawa: { fill: '#d9f0c6', ink: '#2f7d32' }, ziemia: { fill: '#ead9c4', ink: '#6b4423' },
  piasek: { fill: '#fbf0c2', ink: '#a67c1d' }, glina: { fill: '#efd5b4', ink: '#9a5a26' }, rosl: { fill: '#c9e8b3', ink: '#2e7d32' }, zwir: { fill: '#eef0f2', ink: '#546e7a' }
};
const hash2 = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
function drawMaterial(kind, f) {
  const H0 = HATCH[kind]; if (!H0) return;
  facePath(f); ctx.fillStyle = H0.fill; ctx.fill('evenodd');
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity; for (const p of f.poly) { x0 = Math.min(x0, X(p.x)); x1 = Math.max(x1, X(p.x)); y0 = Math.min(y0, Y(p.y)); y1 = Math.max(y1, Y(p.y)); }
  const w = x1 - x0, hh = y1 - y0; if (!(w > 0 && hh > 0)) return;
  ctx.save(); facePath(f); ctx.clip('evenodd'); ctx.strokeStyle = H0.ink; ctx.fillStyle = H0.ink; ctx.lineWidth = 1; ctx.lineCap = 'butt'; ctx.lineJoin = 'round'; ctx.setLineDash([]);
  const ox = X(0), oy = Y(0), cells = (P) => { const i0 = Math.floor((x0 - ox) / P) - 1, i1 = Math.ceil((x1 - ox) / P) + 1, j0 = Math.floor((y0 - oy) / P) - 1, j1 = Math.ceil((y1 - oy) / P) + 1; return (i1 - i0) * (j1 - j0) < 40000 ? { i0, i1, j0, j1 } : null; };
  const diag = (sp, dir, dash) => { if ((w + hh) / sp > 3000) return; if (dash) ctx.setLineDash(dash); for (let k = x0 - hh; k <= x1; k += sp) dir > 0 ? line(k, y1, k + hh, y0) : line(k, y0, k + hh, y1); ctx.setLineDash([]); };
  const tri = (x, y, r) => { ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x + r, y + r * .8); ctx.lineTo(x - r, y + r * .8); ctx.closePath(); ctx.stroke(); };
  const hex = (x, y, r) => { ctx.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; k ? ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)) : ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a)); } ctx.closePath(); ctx.stroke(); };
  const circ = (x, y, r, fill) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); if (fill) ctx.fill(); ctx.stroke(); };
  if (kind === 'ceram') diag(8, -1);
  else if (kind === 'zelbet') diag(8, 1, [14, 5]);
  else if (kind === 'komork') {
    diag(9, 1, [9, 6]); const P = 34, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const r = hash2(i, j, 1), x = ox + (i + hash2(i, j, 2)) * P, y = oy + (j + hash2(i, j, 3)) * P;
      if (r < .3) { ctx.fillStyle = '#fff'; ctx.beginPath(); hex(x, y, 3 + hash2(i, j, 4) * 3); } else if (r < .55) { ctx.beginPath(); ctx.moveTo(x, y - 2); ctx.lineTo(x + 2, y); ctx.lineTo(x, y + 2); ctx.lineTo(x - 2, y); ctx.closePath(); ctx.stroke(); } }
  }
  else if (kind === 'izol') { const sx = 22, sl = 1.7; if (w / sx < 2000) for (let k = x0 - hh / sl; k <= x1; k += sx) { line(k, y1, k + hh / sl, y0); line(k, y0, k + hh / sl, y1); } }
  else if (kind === 'podsypka' || kind === 'beton') {
    const P = kind === 'beton' ? 12 : 9, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const r = hash2(i, j, 1), x = ox + (i + hash2(i, j, 2)) * P, y = oy + (j + hash2(i, j, 3)) * P;
      if (r < .55) ctx.fillRect(x, y, 1.2, 1.2); else if (r < .7) { ctx.fillRect(x, y, 1.2, 1.2); ctx.fillRect(x + 2, y + 1, 1.2, 1.2); } else if (r < .8) tri(x, y, 2.4); }
  }
  else if (kind === 'trawa') { const P = 15, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const x = ox + (i + hash2(i, j, 2)) * P, y = oy + (j + hash2(i, j, 3)) * P; if (hash2(i, j, 1) < .7) { line(x, y, x - 3, y - 5); line(x, y, x, y - 6.5); line(x, y, x + 3, y - 5); } } }
  else if (kind === 'ziemia') { const P = 12, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const r = hash2(i, j, 1), x = ox + (i + hash2(i, j, 2)) * P, y = oy + (j + hash2(i, j, 3)) * P;
      if (r < .5) { const a = hash2(i, j, 5) * Math.PI; line(x, y, x + Math.cos(a) * 4, y + Math.sin(a) * 4); } else if (r < .8) ctx.fillRect(x, y, 1.4, 1.4); } }
  else if (kind === 'piasek') { const P = 6, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) if (hash2(i, j, 1) < .6) ctx.fillRect(ox + (i + hash2(i, j, 2)) * P, oy + (j + hash2(i, j, 3)) * P, 1, 1); }
  else if (kind === 'glina') { const R = 7, c = cells(R); const i0 = Math.floor((y0 - oy) / R) - 1, i1 = Math.ceil((y1 - oy) / R) + 1;
    if (c) for (let r = i0; r < i1; r++) { const y = oy + r * R, off = (r % 2 ? 7 : 0); for (let x = ox - 1000 + (Math.floor((x0 - ox + 1000) / 16) * 16) + off; x < x1 + 16; x += 16) line(x, y, x + 9, y); } }
  else if (kind === 'rosl') { const P = 22, c = cells(P); ctx.fillStyle = 'rgba(76,175,80,.35)';
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const x = ox + (i + hash2(i, j, 2)) * P, y = oy + (j + hash2(i, j, 3)) * P, r = 4 + hash2(i, j, 4) * 3; circ(x, y, r, true); circ(x + r * .9, y + r * .5, r * .8, true); circ(x - r * .8, y + r * .6, r * .75, true); } }
  else if (kind === 'zwir') { const P = 10, c = cells(P);
    if (c) for (let i = c.i0; i < c.i1; i++) for (let j = c.j0; j < c.j1; j++) { const r = hash2(i, j, 1); if (r < .6) circ(ox + (i + hash2(i, j, 2)) * P, oy + (j + hash2(i, j, 3)) * P, 1.2 + hash2(i, j, 4) * 1.8, false); } }
  ctx.restore();
}
