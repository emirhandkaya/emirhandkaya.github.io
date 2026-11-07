# plan.md — build plan for spec.md

## Context

Stages 0–1 produced the scaffold (Astro 7 minimal + MDX + sitemap + RSS, report scripts, agents), intent.md, research/profile-notes.md and 6 TR/EN posts in research/posts/. spec.md (1b3da15) defines pages, schema, tokens, i18n and 14 acceptance criteria. This plan turns that into milestones, each one commit. On approval, this file is copied to `plan.md` at the repo root and committed.

## Decisions (resolving the intent.md open questions)

- Hosting: GitHub Pages, repo `emirhandkaya/emirhandkaya.github.io`, GitHub Actions deploy (prepared in stage 5, not pushed).
- Default language: TR; the root `/` gate per spec §2.
- OG image: one typographic PNG generated from an SVG at build-prep time (no photo needed).
- Resume PDF: generated from `/{lang}/resume/` with `puppeteer-core` + locally installed Chrome (`scripts/resume-pdf.mjs`) into `public/resume-{tr,en}.pdf`, committed. Rerun when the resume changes.
- Fonts: `@fontsource-variable/inter`, `@fontsource-variable/jetbrains-mono` (latin + latin-ext subsets only).
- Same slugs in both locales (keeps the parity script simple).

## Milestones (one commit each; Opus builds, frontend-design guidance applies, brief wins)

**M1 — Foundation**

- `astro.config.mjs`: site, trailingSlash, i18n {defaultLocale tr, locales [tr,en], prefixDefaultLocale}, sitemap i18n.
- `src/styles/tokens.css` (spec §4), `src/styles/global.css` (reset, base type, focus ring, reduced-motion, `.glass`, `.card`, layout utilities; tokens only).
- `src/i18n/{tr,en}.json`, `src/i18n/index.ts` (`t()`, `otherLang()`, `localizedPath()`, date formatter).
- `src/layouts/Base.astro` (head: SEO/OG/hreflang/canonical/JSON-LD slot, skip link, Header, Footer), `src/components/{Header,Footer,LangSwitcher,Seo}.astro`.
- `src/pages/index.astro` → root gate; `src/pages/404.astro`.
- Proof: build passes; `npm run check` passes.
- As built (departures): Fontsource variable packages cannot import single subsets, so the default CSS is used; its `unicode-range` means browsers fetch only the subsets a page needs (latin/latin-ext for TR/EN). Footer socials are GitHub, LinkedIn, Evrim Ağacı, Academia and Medium; Instagram and ORCID join in M4 with their profile-notes entry. Social URLs live in `src/data/site.ts`, nav order there too. The sitemap warns "No pages found" until M2 adds locale pages (the gate and 404 are filtered out).

**M2 — Content collections + blog**

- `src/content.config.ts` (blog, projects, resume schemas per spec §3).
- Move research/posts/{tr,en}/*.md → `src/content/blog/{tr,en}/` (git mv; research/ keeps profile-notes only; I'll record the move in research/README).
- `src/lib/readingTime.ts`; `src/components/{PostCard,TagList}.astro`.
- Pages `src/pages/[lang]/blog/index.astro`, `[...slug].astro`, `tags/[tag].astro`, `[lang]/rss.xml.ts` (getStaticPaths over the locales).
- Proof: 6 posts × 2 locales built; RSS for both; reading time shown; i18n-parity passes for the blog.
- As built (departures): added `src/lib/posts.ts` (slug, sorting, derived description, source-site names) and `src/components/PostMeta.astro` (date + reading time). Tag pages link to the other language's blog index, since tags differ per language. The "translation in progress/partial" note shows only on translations (`translatedFrom` set); a partial Academia entry also gets a "Read the full paper" button. `src/content/{projects,resume}/` hold a `.gitkeep` until M3/M4; the glob loader warns "No files found" until then. Fixed `npm run links`: the shell had stripped the `^` from the skip regex, so it scanned 0 links; options now live in `linkinator.config.json`. It now fails on the M3/M4 routes that don't exist yet (home, projects, resume, about, contact), which is expected until M4.

**M3 — Projects**

- 4 project entries × 2 langs in `src/content/projects/{tr,en}/` (facts only from the notes; unknown → TODO).
- `src/components/ProjectCard.astro`, `TagFilter.astro` (small inline script, `aria-pressed`, `?tag=`, no-JS shows all).
- Pages `[lang]/projects/index.astro`, `[lang]/projects/[slug].astro`.
- Proof: keyboard filter works; detail pages show Problem/Approach/Result.

**M4 — Home, About, Contact, Resume**

- `src/content/resume/{tr,en}.json`; pages `[lang]/index.astro`, `about.astro`, `contact.astro`, `resume.astro` (+ print CSS in global.css under `@media print`).
- `scripts/resume-pdf.mjs` + `npm run resume-pdf`; generate the PDFs; `public/og-default.png`, `public/robots.txt`.
- Add the ORCID (0000-0003-4183-3247), Instagram (ufens30) and Medium (ufens) values to profile-notes "Owner decisions" in this commit (approved in chat).
- Proof: all spec §2 routes exist for both locales.

**M5 — Polish to criteria**

- Restrained motion (fade/translate on card hover and a section reveal via CSS `@starting-style`/`:hover` only; no JS animation), glass header, contrast audit of token pairs, a grep script for criteria 11 and 13 added to `npm run check` (`scripts/guard.mjs`: raw values outside tokens.css; banned personal strings in dist).
- Proof: all npm scripts pass locally.

Then stage 4 (verifier) and stage 5 (reviewer + deploy config) as briefed.

## Risks

- Astro 7 API drift (content layer, i18n helpers) → check the docs for the exact API before M1/M2 instead of guessing.
- Lighthouse ≥ 95 performance: fonts and backdrop-filter cost; preload one font weight, keep JS ≲ 2 KB, no images above the fold.
- lhci needs Chrome; puppeteer-core needs a Chrome path → detect it from the standard Windows paths, fail with a clear message.
- The root JS redirect hurts SEO/a11y → `noindex`, meta-refresh fallback, visible links; x-default points to /tr/.
- Long imported posts with image placeholders → placeholders stay as HTML comments (invisible); tables that were images are noted as TODO.
- Facts are thin (role in team, Valmeto details) → visible TODOs only on About/Resume, listed for the owner in the M4 commit message.

## Criterion → proof

| #      | Proven by                                                   |
| ------ | ----------------------------------------------------------- |
| 1, 2   | `npm run build`, `npm run check`                            |
| 3      | `npm run links`                                             |
| 4      | `npm run lighthouse`                                        |
| 5      | `npm run i18n-parity`                                       |
| 6      | guard.mjs check: each dist page has hreflang ×3 + lang attr |
| 7, 8   | verifier manual check in the browser + code review          |
| 9      | build output + RSS shape check in guard.mjs                 |
| 10     | PDFs exist; reviewer compares them with resume JSON         |
| 11, 13 | guard.mjs greps                                             |
| 12     | CSS review (reduced-motion block zeroes the durations)      |
| 14     | the 2 screenshots in stage 4                                |

## Verification

After M5: verifier subagent runs build, check, links, i18n-parity, lighthouse (failures only), plus one screenshot each at 375px and 1280px of `/tr/` via `npm run preview` in the browser pane.
