---
# Facts: intent.md (problem), CLAUDE.md / spec.md / plan.md (how it is built).
title: 'Bu site'
summary: 'Projeleri, yazıları ve özgeçmişi tek yerde toplayan iki dilli (TR/EN) statik kişisel site.'
lang: tr
date: 2026-11-07
tags: [web, astro, i18n]
status: active
featured: false
order: 4
links:
  - label: GitHub deposu
    url: https://github.com/emirhandkaya/emirhandkaya.github.io
---

## Problem

Emirhan’ın çalışmaları ve yazıları GitHub, Academia, Evrim Ağacı, LinkedIn ve basın haberleri arasında dağınıktı. Hem Türkçe hem İngilizce, kim olduğunu, ne yaptığını ve ne yazdığını anlatan tek bir yer yoktu.

## Yaklaşım

- Astro ile statik çıktı; içerik Markdown koleksiyonlarında, her sayfa `/tr/` ve `/en/` altında.
- Sade CSS; renk, yazı tipi, boşluk ve hareket değerlerinin tamamı tek bir `tokens.css` dosyasında.
- Dil seçici seçimi hatırlar; her sayfada hreflang, site haritası, RSS ve Open Graph var.
- Aşamalı bir iş akışı: niyet → araştırma → şartname → plan → kod → inceleme. Biyografik her bilgi bir kaynak notuna dayanır.

## Sonuç

Okumakta olduğunuz site: altı yazı iki dilde, projeler ve özgeçmiş tek bir adreste.
