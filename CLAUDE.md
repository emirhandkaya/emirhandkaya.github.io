# Emirhan Durmuşkaya — personal site

Bilingual (TR/EN) portfolio + blog + resume. Astro, Markdown/MDX content collections, plain CSS, static output.

## Workflow (AI-native SDLC)
Each stage ends by committing one artifact; the next stage starts by reading it:
intent.md → research/profile-notes.md → spec.md → plan.md → code diff → review findings.
If the build departs from plan.md, update plan.md in the same commit.

## Commands
- `npm run dev` / `npm run build` / `npm run preview`
- `npm run check` — astro check + eslint → reports/check.txt
- `npm run links` — link check on dist → reports/links.txt
- `npm run lighthouse` — perf/a11y/SEO ≥ 95 → reports/lighthouse.txt
- `npm run i18n-parity` — every page/key/content entry in both tr and en → reports/i18n-parity.txt
Scripts print only a summary + failures. Never weaken a check to make it pass.

## Conventions
- Routes: `/tr/...` and `/en/...`; UI strings only in `src/i18n/tr.json` and `src/i18n/en.json`.
- Content: `src/content/<collection>/<lang>/<slug>.md(x)`; translations share the slug.
- All design values (colors, fonts, spacing, radii, motion) live in `src/styles/tokens.css`. No magic values elsewhere.
- Dark, one electric-cyan accent, Inter (text) + JetBrains Mono (details). Respect prefers-reduced-motion.
- Mobile-first, accessible: contrast AA+, keyboard reachable, visible focus.
- No UI frameworks, no extra plugins/MCP servers. Use the frontend-design skill for UI work, but the design brief above wins.
- Targeted diffs; small commits, one per milestone.

## Hard rules
- **Never invent facts about Emirhan.** Every biographical claim must cite research/profile-notes.md. Unknown → `TODO`.
- **Ask before using personal data** (anything flagged in profile-notes.md, contact details beyond the public email).
- **TR and EN stay in sync**: any page, key or post change lands in both languages in the same commit (or is marked translationStatus: needed).
- Never read node_modules/, dist/, .astro/, package-lock.json.
- Do not push or deploy without explicit approval.
