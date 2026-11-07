# Spec — emirhandkaya.github.io

Inputs: intent.md, research/profile-notes.md (the only source of facts about Emirhan; unknown → `TODO`).

## 1. Site & hosting

- `site: https://emirhandkaya.github.io`, `base: /`, `output: 'static'`, `trailingSlash: 'always'`.
- Locales `tr` (default) and `en`; Astro i18n `routing.prefixDefaultLocale: true`, so every page lives under `/tr/` or `/en/`.

## 2. Pages (identical slugs in both locales)

| Route (`/{lang}/…`) | Content                                                                                                                                                                                                                                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/` (root)          | Language gate: uses the stored choice (`localStorage.lang`), else `navigator.language` (tr* → tr, otherwise en), then redirects. `<noscript>` and `<meta http-equiv="refresh">` fallback to `/tr/`, plus visible links to both languages. `noindex`. |
| `` (home)           | Hero (name, one-line role from notes, CTA buttons: Projects, Resume), 3 featured projects, 3 latest posts, highlight strip (İstanbul Regional "Regional Winners" 2026; "qualified for FIRST Championship Houston").                                  |
| `about/`            | Short bio from the notes only: entrepreneur (Valmeto, self-described founder), FRC 10141 Turing Robotics (Halil Bekmezci Anadolu Lisesi), interests (physics, philosophy, history), based in İstanbul. Unknowns → TODO.                              |
| `resume/`           | Web resume: summary, experience, robotics, writing, skills, links. Download button for `/resume-{lang}.pdf`. Print stylesheet.                                                                                                                       |
| `projects/`         | Card grid with a tag filter (progressive enhancement: all cards visible without JS; tag buttons are `aria-pressed` toggles; filtered state is mirrored to `?tag=`).                                                                                  |
| `projects/[slug]/`  | Detail: Problem → Approach → Result (h2 sections), meta (role, date, status, tags, links).                                                                                                                                                           |
| `blog/`             | Post list (date, reading time, tags), newest first.                                                                                                                                                                                                  |
| `blog/[slug]/`      | Post: title, date, reading time, tags, "originally published at" note with link, body, prev/next.                                                                                                                                                    |
| `blog/tags/[tag]/`  | Posts with that tag.                                                                                                                                                                                                                                 |
| `contact/`          | mailto `emirhandurmuskaya@gmail.com`, links: GitHub, LinkedIn, Evrim Ağacı, Academia, Medium, Instagram, ORCID.                                                                                                                                      |
| `rss.xml`           | Per-locale RSS feed of blog posts.                                                                                                                                                                                                                   |
| `404.html`          | Root 404 page, bilingual.                                                                                                                                                                                                                            |

Global: header (logo/name, nav, language switcher), footer (socials, RSS, © year), skip link.

## 3. Content model (`src/content.config.ts`, glob loaders)

Path convention: `src/content/<collection>/<lang>/<slug>.md(x)`. Entry id = `<lang>/<slug>`; translations share the slug.

**blog**: `title` string · `description` string (≤160, derived if absent) · `date` date · `updated?` date · `lang` 'tr'|'en' · `tags` string[] · `canonicalUrl?` url · `mirrors?` url[] · `translationStatus` 'needed'|'partial'|'done' · `translatedFrom?` 'tr'|'en' · `draft` boolean = false.

- Reading time = words / 200 wpm, rounded up, computed at build from the body.
- Canonical: original-language posts with `canonicalUrl` emit `<link rel="canonical">` pointing to the original; translations are self-canonical and show "Translated from the Turkish original" with a link.
- Seed: the 6 posts in research/posts/{tr,en}. İskilipli Atıf is shown with its abstract and a "Read the full paper on Academia" link.

**projects**: `title` · `summary` · `lang` · `date` · `tags` string[] · `role?` · `status` 'active'|'done'|'archived' · `links` {label, url}[] · `featured` boolean · `order` number. The body uses h2 sections `Problem`/`Approach`/`Result` (`Problem`/`Yaklaşım`/`Sonuç` in TR).
Seed (facts from the notes only): Turing Robotics FRC #10141 · Valmeto · this website · Writing (essays across Evrim Ağacı/Academia).

**resume**: data collection `src/content/resume/{tr,en}.json` (summary, experience[], robotics[], writing[], skills[], links[]), same keys in both languages.

**UI strings**: `src/i18n/{tr,en}.json`, nested keys, no strings hard-coded in components; a `t(lang, key)` helper fails the build on a missing key.

## 4. Design tokens (`src/styles/tokens.css` is the only place for raw values)

- Color: `--bg #07090c`, `--surface rgb(255 255 255 / .03)`, `--surface-strong rgb(255 255 255 / .06)`, `--border rgb(255 255 255 / .09)`, `--text #e6edf3`, `--text-muted #9aa7b4`, `--accent #00e5ff`, `--accent-ink #001a1f` (text on the accent), `--focus var(--accent)`. Every text/background pair must meet WCAG AA (body text ≥ 7:1 target).
- Type: `--font-sans` Inter Variable, `--font-mono` JetBrains Mono Variable (self-hosted via @fontsource-variable, latin + latin-ext for Turkish, `font-display: swap`). Fluid scale `--step--1 … --step-5` using clamp().
- Space `--space-1 … --space-8` (4px base); `--radius-sm 6px`, `--radius 12px`; `--border-w 1px`; `--maxw 72rem`, `--measure 68ch`.
- Glass: `--glass-blur 12px`, `--glass-bg var(--surface)`; `backdrop-filter` only inside `@supports`, with a solid fallback.
- Motion: `--dur-fast 120ms`, `--dur 220ms`, `--ease cubic-bezier(.2,.7,.2,1)`. Under `prefers-reduced-motion: reduce` all durations become 0 and reveal effects are disabled.
- Mono is used for meta (dates, tags, reading time, nav numbers, code); Inter for everything else.

## 5. i18n rules

- Every page, UI key, project and resume key exists in both languages (`npm run i18n-parity`). Blog posts must exist in both languages; an incomplete translation is allowed only with `translationStatus: needed|partial` (shown with a "translation in progress" note). All 6 seed posts exist in both.
- `<html lang>` is set per page; every page emits `hreflang` alternates for tr, en and `x-default` (→ `/tr/…`).
- Switcher: links to the same page in the other language (falls back to that language's home if the page is missing), writes `localStorage.lang` on click; `aria-current` on the active language; text labels "TR"/"EN" with an accessible name in full.
- Dates use `Intl.DateTimeFormat(lang)`; RSS and sitemap carry the locale.

## 6. SEO / meta

Per page: title template `{page} — Emirhan Durmuşkaya`, meta description, canonical, Open Graph (title, description, url, locale + alternate locale, type website/article, image `/og-default.png` 1200×630), Twitter card `summary_large_image`, JSON-LD `Person` (on home) and `BlogPosting` (on posts). Sitemap via @astrojs/sitemap with i18n config. `robots.txt` links the sitemap.

## 7. Accessibility

Landmarks (header/nav/main/footer), one h1 per page, skip link, visible 2px accent focus ring (`:focus-visible`) on all interactive elements, keyboard-operable filter and switcher, no information conveyed by color alone, alt text on all images, target size ≥ 24px, no autoplay.

## 8. Privacy

No analytics, no third-party requests at runtime (fonts are self-hosted). Only data approved in profile-notes.md "Owner decisions". Never: birth date or age, second email, Valmeto address.

## 9. Acceptance criteria

1. `npm run build` succeeds with zero warnings from astro check.
2. `npm run check` passes (astro check + eslint).
3. `npm run links` passes: no broken internal links in dist.
4. `npm run lighthouse` reports ≥ 95 for performance, accessibility and SEO on `/tr/` and `/en/`.
5. `npm run i18n-parity` passes.
6. All the routes in §2 exist for both locales in dist; each emits hreflang tr/en/x-default and the correct `<html lang>`.
7. The switcher preserves the current page, and the root redirect honors the stored choice (manual check).
8. The tag filter works with the keyboard and degrades to showing all cards without JS.
9. Each post shows a reading time; RSS validates for both locales (`/tr/rss.xml`, `/en/rss.xml`).
10. Resume PDFs exist for both languages and match the web resume content.
11. Raw color, font or spacing values appear only in tokens.css (grep check: no `#hex`/`px` outside tokens.css except 0/1px borders via tokens).
12. Under reduced motion, no transitions or animations run.
13. Every biographical claim traces to profile-notes.md; no unapproved personal data appears in dist (grep for the birth year, second email, address).
14. Mobile (375px) and desktop (1280px) screenshots show no horizontal scroll and readable layout.
