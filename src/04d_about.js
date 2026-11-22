
/* =====================================================================
   O PROGRAMIE: informacje, linki, formularz kontaktowy (worker „mail” na mail.g2b.pl + Cloudflare Turnstile),
   antyspamowy adres e-mail (nie występuje w kodzie jako gotowy tekst ani mailto), rysunek przykładowy.
   ===================================================================== */
const APP_VERSION = '0.7';
const ABOUT = {
  mailEndpoint: 'https://mail.g2b.pl/',            // ten sam worker, który obsługuje formularz na g2b.pl
  turnstileSiteKey: '0x4AAAAAAGER2WSTQmztaybD',     // klucz publiczny widżetu (jak na g2b.pl); domena musi być dodana w widżecie
  exampleUrl: 'example.json',
  mail: { u: ['simple', 'cad'], d: ['g2b', 'pl'] }  // składane w locie
};
const EXAMPLE_EMBED = /*@EXAMPLE@*/null;           // kopia zapasowa przykładu wstawiana przy budowaniu (tools/build.mjs)

const mailAddr = () => ABOUT.mail.u.join('') + String.fromCharCode(64) + ABOUT.mail.d.join('.');
let tsLoad = null, tsWidget = null, tsToken = '';
function loadTurnstile() {
  if (window.turnstile) return Promise.resolve();
  if (!tsLoad) tsLoad = new Promise((ok, fail) => {
    const s = document.createElement('script'); s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; s.async = true;
    s.onload = () => ok(); s.onerror = () => { tsLoad = null; fail(new Error('turnstile')); }; document.head.appendChild(s);
  });
  return tsLoad;
}
function aboutSetStatus(txt, cls) { const s = $('aSt'); s.textContent = txt || ''; s.className = 'ams' + (cls ? ' ' + cls : ''); }
function aboutOpen() {
  $('abver').textContent = 'v' + APP_VERSION; aboutSetStatus('');
  const dlg = $('abt'), online = /^https?:$/.test(location.protocol);
  dlg.showModal();
  const dis = !online; for (const id of ['aN', 'aE', 'aS', 'aM', 'aSend']) $(id).disabled = dis;
  $('aNote').textContent = dis ? 'Formularz działa tylko po otwarciu SimpleCAD ze strony internetowej (nie z pliku na dysku). Napisz bezpośrednio na adres e-mail powyżej.'
    : 'Wiadomość trafia przez formularz kontaktowy g2b.pl. Podany adres posłuży wyłącznie do odpowiedzi.';
  if (online && ABOUT.turnstileSiteKey && tsWidget === null) {
    loadTurnstile().then(() => {
      if (tsWidget !== null) return;
      tsWidget = window.turnstile.render($('aCap'), { sitekey: ABOUT.turnstileSiteKey, theme: 'light', language: 'pl',
        callback: t => { tsToken = t; }, 'error-callback': () => { tsToken = ''; aboutSetStatus('Weryfikacja antyspamowa jest niedostępna – napisz bezpośrednio na adres e-mail.', 'err'); },
        'expired-callback': () => { tsToken = ''; }, 'timeout-callback': () => { tsToken = ''; } });
    }, () => aboutSetStatus('Nie udało się załadować weryfikacji antyspamowej – sprawdź połączenie lub napisz bezpośrednio na adres e-mail.', 'err'));
  }
}
function aboutSend() {
  const n = $('aN').value, e = $('aE').value.trim(), s = $('aS').value.trim(), m = $('aM').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) || !s || m.length < 5) { aboutSetStatus('Uzupełnij swój e-mail, temat i wiadomość (min. 5 znaków).', 'err'); return; }
  if (ABOUT.turnstileSiteKey && !tsToken) { aboutSetStatus('Potwierdź, że nie jesteś robotem (okienko powyżej).', 'err'); return; }
  $('aSend').disabled = true; aboutSetStatus('Wysyłanie…');
  fetch(ABOUT.mailEndpoint, { method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name: n, email: e, subject: 'SimpleCAD: ' + s, message: m, hp: $('aH').value, token: tsToken, lang: 'pl', page: 'SimpleCAD v' + APP_VERSION + ' ' + location.host }) })
    .then(r => r.json().catch(() => ({})).then(j => { if (!r.ok || !j.ok) throw new Error(j.error || r.status); }))
    .then(() => { aboutSetStatus('Dziękuję! Wiadomość została wysłana – odpowiem na podany adres.', 'ok'); $('aS').value = ''; $('aM').value = ''; })
    .catch(err => {
      const c = String(err && err.message); $('aSend').disabled = false; tsToken = ''; if (window.turnstile && tsWidget !== null) { try { window.turnstile.reset(tsWidget); } catch (_) { } }
      aboutSetStatus(c === 'captcha' ? 'Weryfikacja antyspamowa nie powiodła się – spróbuj ponownie.' : c === 'rate' ? 'Dziś wysłano już zbyt wiele wiadomości z Twojego adresu – spróbuj jutro.'
        : c === 'forbidden' ? 'Formularz nie jest jeszcze dostępny z tej domeny – napisz bezpośrednio na adres e-mail.' : 'Nie udało się wysłać wiadomości – spróbuj ponownie lub napisz bezpośrednio na adres e-mail.', 'err');
    });
}
(function () { // powiązania
  const a = $('aMail');
  const reveal = () => { a.textContent = mailAddr(); a.href = 'mailto:' + mailAddr(); };
  a.textContent = ABOUT.mail.u.join('') + ' [at] ' + ABOUT.mail.d.join('.');   // dla robotów: bez poprawnego adresu
  a.addEventListener('pointerenter', reveal); a.addEventListener('focus', reveal); a.addEventListener('touchstart', reveal, { passive: true });
  a.addEventListener('click', e => { e.preventDefault(); reveal(); location.href = a.href; });
  $('bAbout').onclick = () => { $('hmenu').classList.remove('open'); aboutOpen(); };
  $('aX').onclick = $('aClose').onclick = () => $('abt').close();
  $('abt').addEventListener('mousedown', e => { if (e.target === $('abt')) $('abt').close(); });
  $('aSend').onclick = aboutSend; $('abt').querySelector('form').addEventListener('submit', e => { e.preventDefault(); });
})();

/* ---------- rysunek przykładowy ---------- */
function loadExampleDoc(d) {
  if (!d || !Array.isArray(d.segs)) throw new Error('bad example');
  push(); S = migrate(JSON.parse(JSON.stringify(d))); st.sel = null; resetDraw(); syncUI();
  if (S.sheet && S.sheet.fmt !== 'free') { layoutSheet(); if (S.sheet.fits === false) { S.sheet.scale = 'max'; S.sheet.off = { x: 0, y: 0 }; afterSheetChange(); } } // rysunek ma mieścić się na arkuszu
  fit();
}
function loadExample() {
  if (S.segs.length && !confirm('Wczytać rysunek przykładowy? Bieżący rysunek zostanie zastąpiony (Ctrl+Z cofnie).')) return;
  const embedded = () => { if (EXAMPLE_EMBED) loadExampleDoc(EXAMPLE_EMBED.data || EXAMPLE_EMBED); else alert('Nie udało się wczytać rysunku przykładowego.'); };
  if (!/^https?:$/.test(location.protocol)) return embedded();
  fetch(ABOUT.exampleUrl, { cache: 'no-cache' }).then(r => { if (!r.ok) throw 0; return r.json(); }).then(j => loadExampleDoc(j.data || j)).catch(embedded);
}
$('bExample').onclick = () => { $('hmenu').classList.remove('open'); loadExample(); };
