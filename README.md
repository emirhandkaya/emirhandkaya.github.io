# emirhandurmuskaya.com

Personal site of Emirhan Durmuşkaya: portfolio, blog and resume in Turkish and English. Built with Astro (static output), Markdown content collections and plain CSS.

How it was built: `intent.md` → `research/profile-notes.md` → `spec.md` → `plan.md` → code → `verification.md` → `review.md`. Project rules are in `CLAUDE.md`.

## Commands

| Command               | What it does                                                                     |
| --------------------- | -------------------------------------------------------------------------------- |
| `npm install`         | Install dependencies                                                             |
| `npm run dev`         | Dev server at `localhost:4321`                                                   |
| `npm run build`       | Build to `dist/`                                                                 |
| `npm run preview`     | Serve `dist/` locally                                                            |
| `npm run check`       | astro check + eslint + `scripts/guard.mjs` (needs a build) → `reports/check.txt` |
| `npm run i18n-parity` | TR/EN parity of UI keys and content → `reports/i18n-parity.txt`                  |
| `npm run links`       | Internal link check on `dist/` → `reports/links.txt`                             |
| `npm run lighthouse`  | Performance / accessibility / SEO ≥ 95 → `reports/lighthouse.txt`                |
| `npm run resume-pdf`  | Build, print `/{lang}/resume/` to `public/resume-{lang}.pdf`, rebuild            |
| `npm run og-image`    | Render `public/og-default.png` (1200×630)                                        |

`resume-pdf` and `og-image` need Chrome or Edge; set `CHROME_PATH` if it is not in a standard location. Rerun `resume-pdf` whenever `src/content/resume/*.json` changes, and commit the PDFs.

Lighthouse performance scores are unreliable on slow machines (benchmarkIndex below ~1000). CI runs every check on GitHub's runners (`.github/workflows/ci.yml`).

## Content

- Posts: `src/content/blog/{tr,en}/<slug>.md`. Projects: `src/content/projects/{tr,en}/<slug>.md`. Resume: `src/content/resume/{tr,en}.json`.
- Translations share the slug. Every change lands in both languages, or is marked `translationStatus: needed`.
- UI strings live only in `src/i18n/{tr,en}.json`. Design values live only in `src/styles/tokens.css`.
- Facts about Emirhan come only from `research/profile-notes.md`.

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds, runs the checks and publishes `dist/` on every push to `main`.

One-time setup (owner):

1. Repo **Settings → Pages → Build and deployment → Source**: choose **GitHub Actions**.
2. Put this site on `main`. The repo's current `main` holds the previous hand-written site, and its history is unrelated to this one. Options:
   - Replace it: push this history to `main` with force. The old site stays reachable only through git history.
   - Keep the old history: merge `site-v2` into `main` with `--allow-unrelated-histories`, removing the old files.
3. The first push to `main` deploys. Check the **Deploy** run in the Actions tab, then the live site.
