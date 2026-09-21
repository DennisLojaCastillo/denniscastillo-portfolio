# denniscastillo-portfolio

Astro + Tailwind, indhold i Markdown, redigering via Pages CMS, hosting paa Simply.com.

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
| `src/content/blog/` | En Markdown-fil per indlaeg |
| `src/content/pages/` | Forside, om, kontakt |
| `src/data/settings.json` | Navigation, footer, SEO-defaults |
| `public/uploads/` | Billeder uploadet via Pages CMS |
| `public/kontakt.php` | Formular-endpoint, koeres af PHP paa Simply |
| `src/content.config.ts` | Skema for indholdet, build fejler hvis et felt mangler |
| `.pages.yml` | Hvilke felter Pages CMS viser |

Skemaet i `src/content.config.ts` og felterne i `.pages.yml` skal aendres sammen. Ellers viser editoren felter der ikke findes i koden, eller omvendt.

## Deploy

Push til `main` udloeser GitHub Actions, der bygger og synkroniserer `dist/` til webhotellet med rsync over SSH.

Rollback: revert commit'et og push. Naeste build lægger den forrige version op igen.

### Spaerre mod forkert sti

rsync koerer med `--delete`. Peger `SIMPLY_PATH` et forkert sted hen, ville den rydde den forkerte mappe. Workflow'et tjekker derfor tre ting foer det roerer serveren:

1. `SIMPLY_PATH` og `SIMPLY_USER` er ikke tomme, og stien er absolut.
2. Stien er mindst fire niveauer dyb. Det blokerer `/`, `/var`, `/var/www` og kontoens rodmappe, hvor naboprojekter ligger side om side.
3. Filen `.deploy-ok` findes i maalmappen. Er stien forkert, findes filen ikke, og deploy stopper foer rsync starter.

Markoerfilen oprettes en gang:

```bash
ssh <bruger>@ssh.simply.com "touch <sti>/.deploy-ok"
```

rsync ekskluderer den, saa `--delete` ikke fjerner den igen. Skal siden senere flyttes til en anden mappe, oprettes markoerfilen i den nye mappe foerst.

### Secrets der skal findes i repo'et

| Secret | Vaerdi |
| --- | --- |
| `SIMPLY_SSH_KEY` | Den private noegle, hele filen inklusive BEGIN- og END-linjerne |
| `SIMPLY_USER` | Brugernavnet til SSH og FTP hos Simply |
| `SIMPLY_PATH` | Stien paa webhotellet der skal modtage filerne |

Den offentlige noegle uploades i Simplys kontrolpanel under Website og SSH-adgang.

## Kontaktformular

`public/kontakt.php` sender med PHP's `mail()`. Modtageren staar oeverst i filen. Beskyttelsen er et honeypot-felt plus et tidstjek. Kommer der spam igennem, er naeste skridt rate limiting paa IP.
