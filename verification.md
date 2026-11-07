# Stage 4 — verification

Date: 2026-11-07 · Commit verified: `b10a3d8` (main) · Checks from spec.md §9 / plan.md "Criterion → proof".

## Results by criterion

| #   | Criterion                                                                      | Result        | Evidence                                                                                                                                                                                                   |
| --- | ------------------------------------------------------------------------------ | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Build succeeds, astro check has zero warnings                                  | PASS          | `npm run build`: 54 pages, no WARN lines; astro check passes                                                                                                                                               |
| 2   | `npm run check` passes                                                         | PASS          | astro check, eslint and `scripts/guard.mjs` all pass                                                                                                                                                       |
| 3   | No broken internal links                                                       | PASS          | `npm run links`: 61 links scanned, 0 broken                                                                                                                                                                |
| 4   | Lighthouse ≥ 95 for perf/a11y/SEO on /tr/ and /en/                             | PASS          | CI run 42391096359 (GitHub runner): 96/100/100/100 on both. Local run here: /en/ 96/100/100/100, /tr/ 95/100/100/100 (benchmarkIndex ~730; local perf is unreliable on this Celeron N4120, see plan.md M5) |
| 5   | `npm run i18n-parity` passes                                                   | PASS          | UI keys, content entries and resume JSON keys match                                                                                                                                                        |
| 6   | All §2 routes in both locales; hreflang tr/en/x-default; correct `<html lang>` | PASS          | guard.mjs: 38 required routes present, tr/en page parity, lang + 3 hreflang on all 54 pages, one h1 each                                                                                                   |
| 7   | Switcher keeps the page; root gate honours stored choice                       | PASS          | Manual (puppeteer): see below                                                                                                                                                                              |
| 8   | Tag filter works with keyboard; shows all cards without JS                     | PASS          | Manual (puppeteer): see below                                                                                                                                                                              |
| 9   | Reading time on each post; RSS valid for both locales                          | PASS          | guard.mjs RSS shape + 6 items per feed; reading time on every post card and post page                                                                                                                      |
| 10  | Resume PDFs exist for both languages and match the web resume                  | PASS (exists) | `public/resume-{tr,en}.pdf` are printed from `/{lang}/resume/` by `npm run resume-pdf`. Content match is for the stage 5 reviewer to confirm                                                               |
| 11  | Raw color/font/spacing values only in tokens.css                               | PASS          | guard.mjs (tested by planting a violation)                                                                                                                                                                 |
| 12  | No transitions or animations under reduced motion                              | PASS          | `/tr/` with `prefers-reduced-motion: reduce`: 0 of 198 elements have a non-zero transition/animation; `document.getAnimations()` is empty                                                                  |
| 13  | Biographical claims trace to profile-notes; no unapproved personal data        | PASS (data)   | guard.mjs privacy patterns: none found in dist. Claim-by-claim tracing is for the stage 5 reviewer                                                                                                         |
| 14  | 375px and 1280px screenshots: no horizontal scroll, readable                   | PASS          | `verification/tr-375.png`, `verification/tr-1280.png`; scrollWidth equals clientWidth at both widths                                                                                                       |

## Manual checks (criteria 7, 8, 12, 14)

Run with puppeteer-core against `astro preview`, each case in a fresh browser context:

- Gate, no stored choice: `navigator.language` tr-TR → `/tr/`, en-US → `/en/`, de-DE → `/en/`.
- Gate without JS: meta refresh → `/tr/`; visible links to `/tr/` and `/en/` in the HTML.
- Switcher: `/tr/blog/yapay-zeka-ve-matematik/` → EN → `/en/blog/yapay-zeka-ve-matematik/`, and `localStorage.lang = en`. Then `/` → `/en/`, even with `navigator.language` tr-TR.
- Switcher fallback: on `/en/blog/tags/philosophy/` (no TR counterpart) the TR link goes to `/tr/blog/`.
- Filter by keyboard: focus `#robotics` → Enter selects it (1 card, `aria-pressed=true`, `?tag=robotics`, status "1 project shown"); Space clears it (4 cards, no query). `/tr/projects/?tag=yazi` loads filtered (1 card).
- Filter without JS: filter UI hidden, all 4 cards visible.

## Findings (not fixed here; stage 4 reports only)

1. **İskilipli Atıf post shows an exact date that may be invented.** `src/content/blog/{tr,en}/iskilipli-atif-neden-asildi.md` has `date: 2025-01-01`, displayed as "1 Ocak 2025" / "1 January 2025". profile-notes only gives "2025" for the six works' range. The date also puts it first in "Latest writing" on the home page. The owner should confirm the real date (Academia) or the site should show the year only.
2. **The `verifier` agent cannot run on this machine.** `.claude/agents/verifier.md` grants `Bash`, but this Windows session's shell is PowerShell, so the agent had no command tool and ran nothing. This stage's scripts were run directly instead. Changing the agent's tools is a config change for the owner to decide.
3. **Owner TODOs still visible on the site** (expected, from M3/M4): Emirhan's role in Turing Robotics (About, Resume); Valmeto period/founding year (Resume). Valmeto responsibilities and results are an HTML-comment TODO on the project page.
4. **`git push` doesn't use the `gh` login on this machine.** Git uses Windows Credential Manager, which has no GitHub login. The one push to `site-v2` passed `gh` as the credential helper for that command only. `gh auth setup-git` would make it permanent.
