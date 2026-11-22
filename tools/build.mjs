// Składa site/index.html z plików src/ (jeden samodzielny plik HTML) i wstawia kopię zapasową przykładu.
// Użycie: node tools/build.mjs        (npm run build)
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import vm from 'node:vm';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const parts = ['01_head.html', '02_core.js', '03_render.js', '04_export.js', '04b_catalog.js', '04c_hatch.js', '04d_about.js', '05_tools.js'];
let html = parts.map(f => readFileSync(join(root, 'src', f), 'utf8')).join('');
const ex = JSON.stringify(JSON.parse(readFileSync(join(root, 'site', 'example.json'), 'utf8'))).replace(/</g, '\\u003c');
if (!html.includes('/*@EXAMPLE@*/null')) throw new Error('brak znacznika /*@EXAMPLE@*/null w src/04d_about.js');
html = html.replace('/*@EXAMPLE@*/null', () => ex);
const i = html.lastIndexOf('<script>'), j = html.lastIndexOf('</script>');
new vm.Script(html.slice(i + 8, j), { filename: 'simplecad-inline.js' }); // sprawdzenie składni
writeFileSync(join(root, 'site', 'index.html'), html);
console.log('OK site/index.html', (html.length / 1024).toFixed(0) + ' kB');
