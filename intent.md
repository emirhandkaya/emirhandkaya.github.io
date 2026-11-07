# Intent

## Problem
Emirhan Durmuşkaya's work and writing are scattered (GitHub, Academia.edu, Evrim Ağacı, LinkedIn, press coverage).
There is no single, owned place that presents who he is, what he has built, and what he writes — in both Turkish and English.

## Outcome
A fast, static, bilingual (TR/EN) personal site deployed from `emirhandkaya/emirhandkaya.github.io` (or Vercel/Netlify) with:
- Home, About, Resume (web + PDF download), Projects (cards, tag filter, detail pages: problem → approach → result),
  Blog (tags, reading time, RSS), Contact (mailto + social links).
- Language switcher that remembers the choice; hreflang, sitemap, RSS, Open Graph.
- Lighthouse ≥ 95 for performance, accessibility, SEO; all TR/EN pages and strings in parity.

## Audience
Recruiters and collaborators (robotics/engineering/research), Turkish science-reading community (Evrim Ağacı readers),
and international readers via English.

## Constraints
- Stack fixed: Astro + Markdown/MDX collections, plain CSS, built-in i18n routing, static output; scaffolded with `npm create astro`.
- Design fixed: near-black, one electric-cyan accent, Inter + JetBrains Mono, thin-bordered glass cards, restrained motion
  respecting prefers-reduced-motion; all design values in a single tokens.css; mobile-first and accessible.
- Content truthfulness: only public facts that clearly refer to him, cited in research/profile-notes.md; sensitive data needs approval.
- Only his own content; no copying others'.
- Budget: Claude Pro usage limits — lean stages, small diffs, cheap models for research/verification/review.
- No push/deploy without explicit approval.

## Open questions
1. Hosting target: GitHub Pages (existing repo) vs Vercel vs Netlify? Custom domain?
2. Which imported posts to republish in full vs link out (canonicalUrl) — and which to translate?
3. Resume source: is there an existing CV/PDF, or build from LinkedIn + research?
4. Which projects to feature (5-8), and any private/unlisted work to include?
5. Profile photo / OG image: provide one or use a generated typographic card?
6. Default language at `/` — redirect by browser language, or Turkish first?
