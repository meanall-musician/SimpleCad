# SimpleCAD

Lekki edytor 2D do rysowania i wymiarowania rzutów, ścian i pomieszczeń – jeden plik HTML, działa w przeglądarce (także offline).
Wdrożenie: Cloudflare Workers (Static Assets) pod **https://simplecad.g2b.pl**.

```
src/                 kod źródłowy aplikacji (kolejność składania: tools/build.mjs)
site/index.html      aplikacja po złożeniu (to jest serwowane) – commitowana, żeby deploy nie wymagał builda
site/example.json    „Rysunek przykładowy” (menu ☰ → Rysunek przykładowy) – podmieniasz plik i commitujesz
site/_headers        nagłówki bezpieczeństwa + CSP
tools/build.mjs      składa src/ → site/index.html i wstawia kopię zapasową example.json
wrangler.jsonc       konfiguracja workera (assets = ./site, domena simplecad.g2b.pl)
```

## Deploy (Cloudflare)
Workers & Pages → Create → **Connect to Git** → repo `SimpleCad`, branch `main`. *Build command*: puste, *Deploy command*: `npx wrangler deploy`.
Pole `name` w `wrangler.jsonc` (`simplecad`) musi być takie samo jak nazwa projektu w panelu. Domena `simplecad.g2b.pl` jest w `routes` (strefa g2b.pl musi być na tym samym koncie).
Każdy push na `main` wdraża zmiany.

## Formularz kontaktowy („O programie”)
Wysyła POST na `https://mail.g2b.pl/` (worker `mail` z repo `g2b`, Brevo + Turnstile). Żeby działał z tej domeny:
1. worker `mail` → Settings → Variables: `ALLOWED_ORIGIN` musi zawierać `https://simplecad.g2b.pl` (lista po przecinku, np. `https://g2b.pl,https://www.g2b.pl,https://simplecad.g2b.pl`);
2. Turnstile → widżet użyty na g2b.pl → dodaj hostname `simplecad.g2b.pl` (site key jest w `src/04d_about.js`).

Adres e-mail autora nie występuje w kodzie jako gotowy tekst ani `mailto:` – jest składany w przeglądarce po najechaniu/kliknięciu (ochrona przed zbieraczami adresów).

## Zmiana rysunku przykładowego
W aplikacji: *Zapisz JSON* → wynik wgraj jako `site/example.json` → commit. Plik jest pobierany przy każdym użyciu (`no-cache`); kopia zapasowa w `index.html` (dla pracy offline) odświeża się po `npm run build`.
Uwaga: repo jest publiczne – nie umieszczaj w przykładzie danych prywatnych (inwestor, adres).

## Zmiany w kodzie
Edytuj pliki w `src/`, następnie `npm run build` (Node 18+) i commituj razem `src/` oraz `site/index.html`.
