---
# Facts: intent.md (problem), CLAUDE.md / spec.md / plan.md (how it is built).
title: 'This website'
summary: 'A bilingual (TR/EN) static personal site that brings projects, writing and resume together in one place.'
lang: en
date: 2026-11-07
tags: [web, astro, i18n]
status: active
featured: false
order: 4
links:
  - label: GitHub repository
    url: https://github.com/emirhandkaya/emirhandkaya.github.io
---

## Problem

Emirhan's work and writing were scattered across GitHub, Academia, Evrim Ağacı, LinkedIn and press coverage. There was no single place, in Turkish and English, that showed who he is, what he does and what he writes.

## Approach

- Static output with Astro; content in Markdown collections, every page under `/tr/` and `/en/`.
- Plain CSS; every color, font, spacing and motion value lives in one `tokens.css` file.
- The language switcher remembers the choice; every page has hreflang, a sitemap entry, RSS and Open Graph.
- A staged workflow: intent → research → spec → plan → code → review. Every biographical claim traces to a source note.

## Result

The site you are reading: six essays in two languages, projects and a resume at one address.
