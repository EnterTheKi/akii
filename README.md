# KIAZAKI · 気 · 33:27

A KIAZAKI site built inside the Herbarium layout from `Fay-main`: the night garden,
the wandering white butterfly, the specimens and the quiet type. The content is
kiaz's — the Way, the Vault, Imaginos and the Logbook.

## Run

```sh
npm install
npm run dev      # http://localhost:4321/akii/   (base is /akii for GitHub Pages)
npm run build    # dist/
```

Pushing to `main` builds the site and publishes `dist/` to GitHub Pages at
<https://entertheki.github.io/akii/> via `.github/workflows/deploy.yml`.

## Where things live

- `src/components/Herbarium.astro` — the home page (hero, Vault, Way, Imaginos, Logbook, frequency)
- `src/components/VaultIndex.astro` — all 50 frames and the viewer (`public/js/vault.js`)
- `src/components/ImaginosPage.astro` — the five kiaz glyphs
- `src/components/BlogIndex.astro`, `BlogPost.astro` — the seven logbook notes
- `src/data/profile.ts`, `precepts.ts`, `vault.ts`, `imaginos.json` — kiaz content
- `src/content/posts/*.md` — the original kiaz prose, with its small ASCII headers
- `src/styles/herbarium.css` — Fay's theme plus the KIAZAKI section styles
- `public/vault/` — the kiaz stills and merch

The source folders `Fay-main/` and `kiaz-main/` are reference copies and are not
part of the Astro build. The previous static kiaz build is kept in `kiaz-static/`.
