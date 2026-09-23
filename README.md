# denniscastillo-portfolio

Astro + Tailwind, indhold i Markdown, redigering via Pages CMS, hosting på Simply.com.

## Lokalt

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # bygger til dist/
npm run preview  # servér dist/ lokalt
```

## Struktur

| Sti | Indhold |
| --- | --- |
| `src/content/cases/` | En Markdown-fil per case |
| `src/content/blog/` | En Markdown-fil per indlæg |
| `src/content/pages/` | Forside, om, kontakt |
| `src/data/settings.json` | Navigation, footer, SEO-defaults |
| `public/uploads/` | Billeder uploadet via Pages CMS |
| `public/kontakt.php` | Formular-endpoint, køres af PHP på Simply |
| `src/content.config.ts` | Skema for indholdet, build fejler hvis et felt mangler |
| `.pages.yml` | Hvilke felter Pages CMS viser |

Skemaet i `src/content.config.ts` og felterne i `.pages.yml` skal ændres sammen. Ellers viser editoren felter der ikke findes i koden, eller omvendt.

## Deploy

Push til `main` udløser GitHub Actions, der bygger og synkroniserer `dist/` til webhotellet med rsync over SSH.

Rollback: revert commit'et og push. Næste build lægger den forrige version op igen.

### Spærre mod forkert sti

rsync kører med `--delete`. Peger `SIMPLY_PATH` et forkert sted hen, ville den rydde den forkerte mappe. Workflow'et tjekker derfor tre ting før det rører serveren:

1. `SIMPLY_PATH` og `SIMPLY_USER` er ikke tomme, og stien er absolut.
2. Stien er mindst fire niveauer dyb. Det blokerer `/`, `/var`, `/var/www` og kontoens rodmappe, hvor naboprojekter ligger side om side.
3. Filen `.deploy-ok` findes i målmappen. Er stien forkert, findes filen ikke, og deploy stopper før rsync starter.

Markørfilen oprettes en gang:

```bash
ssh <bruger>@ssh.simply.com "touch <sti>/.deploy-ok"
```

rsync ekskluderer den, så `--delete` ikke fjerner den igen. Skal siden senere flyttes til en anden mappe, oprettes markørfilen i den nye mappe først.

### Secrets der skal findes i repo'et

| Secret | Værdi |
| --- | --- |
| `SIMPLY_SSH_KEY` | Den private nøgle, hele filen inklusive BEGIN- og END-linjerne |
| `SIMPLY_USER` | Brugernavnet til SSH og FTP hos Simply |
| `SIMPLY_PATH` | Stien på webhotellet der skal modtage filerne |

Den offentlige nøgle uploades i Simplys kontrolpanel under Website og SSH-adgang.

## Kontaktformular

`public/kontakt.php` sender med PHP's `mail()`. Modtageren står øverst i filen. Beskyttelsen er et honeypot-felt plus et tidstjek. Kommer der spam igennem, er næste skridt rate limiting på IP.
