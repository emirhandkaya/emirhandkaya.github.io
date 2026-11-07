# Stage 5 — review findings

Date: 2026-11-07 · Reviewed: `146a8f9` (main) against spec.md, plan.md (incl. "As built" departures), CLAUDE.md and research/profile-notes.md. Reviewer: the `reviewer` agent (reading files only; its Bash tool does not work on this Windows machine). I checked each finding; "Verdict" is mine.

Already known from verification.md and not repeated: the İskilipli Atıf date, the verifier's tools, the visible owner TODOs, and git not using the gh login.

## High

**1. Flagged personal data was published in the public repo.** Verdict: **confirmed; partly fixed locally, needs owner decision.**
`research/profile-notes.md` recorded a stale age, a school grade and the Valmeto registered-address districts (flagged "do not use"). `scripts/guard.mjs` named the two districts. The repo `emirhandkaya/emirhandkaya.github.io` is public, and branch `site-v2` (pushed for CI on 2026-11-07) carries the whole history, so these values are readable on GitHub. The built site (dist/) never contained them.

- Fixed in this commit: the notes keep the flags but no values; the guard checks address words by SHA-256 hash and uses generic age/grade patterns.
- Still exposed: every earlier commit, locally and on `site-v2`. Removing it needs a history rewrite and deleting or force-updating the remote branch, which is the owner's call. Commits can stay reachable by SHA on GitHub for a while after the branch is gone; GitHub Support can purge them.

## Medium

**2. Valmeto founder claim is unqualified on About, the home role line and JSON-LD.** Verdict: **confirmed, owner to decide.** `about.entrepreneur` ("I founded Valmeto" / "Valmeto’nun kurucusuyum"), `home.role` ("Founder of Valmeto") and JSON-LD `jobTitle`/`worksFor` in `src/pages/[lang]/index.astro`. The notes support it only as his self-description (spec §2: "self-described founder"); Resume and the project page say so, these don't. It is his own site in his own voice, so it may be fine as is. Or the About sentence can carry the same qualifier.

**3. Resume robotics period "2025 –" implies when he joined.** Verdict: **confirmed.** `src/content/resume/{tr,en}.json`: 2025 is the team's rookie year; his join date is unknown (notes: Gaps). Should be `TODO` or omitted.

**4. i18n-parity's page check is empty.** Verdict: **confirmed** (also noted after M2). `scripts/i18n-parity.mjs` reads `src/pages/{tr,en}`, which don't exist, so it compares nothing. guard.mjs covers built-page parity, but the script's check is hollow. Fix: drop it there, or check `src/pages/[lang]` content slugs instead.

**5. Missing Pages deploy workflow.** Verdict: **resolved in this commit** (`.github/workflows/deploy.yml`, written while the review ran). Sub-point: nothing in CI checks that the committed PDFs match the resume JSON (criterion 10). Valid, low.

**6. hreflang/x-default point to a non-translation when a page has no counterpart.** Verdict: **confirmed; spec conflict.** Tag pages (and any post/project without a translation) emit `hreflang` for the other language pointing at its blog/projects index, which is not reciprocal. spec §5 / criterion 6 require tr/en/x-default on every page. Better SEO: emit alternates only for real translations, plus a spec change. Owner/spec decision.

## Low

7. **"TR" switcher label vs accessible name "Türkçe"** (WCAG 2.5.3 Label in Name). Confirmed. Fix: accessible name that contains the visible text, e.g. "TR — Türkçe".
8. **ASCII tag slugs shown as Turkish words without diacritics** ("#girisimcilik", "#yazi", "#osmanli-tarihi"). Confirmed. Fix: display labels separate from slugs.
9. **Post `<aside>` labelled "Read the original"** though it also holds translation notes; `:empty` hiding is fragile. Confirmed.
10. **No RSS autodiscovery** `<link rel="alternate" type="application/rss+xml">` in the head; no atom:self. Confirmed, easy.
11. **"Read all of them here" vs the abstract-only İskilipli Atıf post** (About, Writing project). Confirmed.
12. **Resume "Evrim Ağacı 2022 – 2023"** not in the notes. Verdict: **partly disagree.** The range comes from the imported posts' Evrim Ağacı canonical URLs and dates (stage 1 research output), not invention. It should still be cited in the notes.
13. **`status: active` on projects and the Problem framing of Valmeto/Writing** have no source. Partly confirmed: the framing describes the market, not Emirhan. `status` is a judgment the owner should confirm.
14. **`resume-pdf.mjs` path check** `startsWith(DIST)` accepts sibling dirs; `decodeURIComponent` can throw. Confirmed; localhost-only, easy fix.
15. **`og-image.mjs` raw sizes** contradict its "no raw design values" comment. Confirmed; fix the comment or tokens.
16. **guard.mjs coverage gaps**: PDFs not scanned; no 3:1 check for focus ring/borders; inline `style=`/`<script>` not scanned. Confirmed, low.
17. **Copy nits**: straight vs curly apostrophe in "Durmuşkaya'nın" (TR `site.description`, `rss.description`); `blog.updated` has a colon in TR, not in EN. Confirmed.

## No findings

- No unapproved personal data in `src/` or `dist/`. ORCID, Instagram and Medium match the approved values.
- Houston is always "qualified" / "katılma hakkı kazandı", never "competed".
- No hard-coded UI strings outside `src/i18n/*.json`.
- Landmarks, skip link, one h1 per page, focus ring, target sizes and reduced motion are all in place.
