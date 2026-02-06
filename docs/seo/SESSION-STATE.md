# Session State

> Last updated: 2026-02-06

## Current Phase

**Content Production — Writing new blog articles per BLOG-CONTENT-PLAN.md**

Tier 1 Quick Wins in progress. First article completed, ready for deployment.

## Completed Work

### PR #120 — 16 Blog Improvements (merged to main)
All improvements from `docs/BLOG_IMPROVEMENTS_TRACKER.md` Fase 2:

| ID | Feature | Status |
|----|---------|--------|
| F2-1 | og:image absolute URL | ✅ |
| F2-2 | Dynamic sitemap with blog URLs | ✅ |
| F2-3/4 | NuxtImg optimization | ✅ |
| F2-5 | Staggered publication dates | ✅ |
| F2-6 | Breadcrumbs | ✅ |
| F2-7 | Category icons | ✅ |
| F2-8 | Clickable tags | ✅ |
| F2-9 | Updated date display | ✅ |
| F2-10 | Author bio (E-E-A-T) | ✅ |
| F2-11 | Content plan | ✅ |
| F2-12 | RSS feed | ✅ |
| F2-13 | CTA WhatsApp + Reservar | ✅ |
| F2-14 | Prev/Next navigation | ✅ |
| F2-15 | Search with accents | ✅ |
| F2-16 | Pagination | ✅ |

### PR #121 — RSS/Sitemap Fix (merged to main)
- **Problem**: `queryCollectionWithEvent` from `#content/server` fails on Firebase (both pre-rendering and runtime — SQLite DB unavailable in serverless)
- **Solution**: Static `public/rss.xml` + static `sitemap.urls` array in `nuxt.config.ts`
- **Deleted**: `server/routes/rss.xml.ts`, `server/api/__sitemap__/urls.ts`

### PR #122 — Blog Audit Bugfixes (merged to main)
4 bugs found during production visual audit:

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| Dates off by 1 day | `new Date('YYYY-MM-DD')` = UTC midnight → COT = day before | Parse date parts manually with local constructor |
| Hero image invisible | `<NuxtImg>` generates `/_ipx/...` URLs that don't resolve on Firebase | Replace with native `<img>` |
| Author avatar broken | Firebase Storage token expired (404) | Reactive `avatarError` ref + branded initial fallback |
| Prev/Next wrong order | `queryCollectionItemSurroundings` sorts alphabetically by path | Custom query with `.order('date', 'DESC')` |

Files changed: `useBlogUtils.ts`, `[...slug].vue` — 2 files, +32 -8 lines.

### PR #123 — Avatar SSR Hydration Fix (merged to main)
- **Problem**: `@error` event on `<img>` fires before Vue hydrates the SSR HTML, so the reactive `avatarError` ref never flips to `true` and the fallback `<div>` never renders.
- **Solution**: `onMounted` check — if `img.complete && img.naturalWidth === 0`, set `avatarError = true`.
- Files changed: `[...slug].vue` — 1 file, +6 lines.

### PR #124 — Visual Polish (merged to main)
Visual refinements from production audit:

| Change | Detail |
|--------|--------|
| Breadcrumbs | Gray text instead of red |
| Avatar | Blue circle fallback instead of red |
| Verified badge | Green instead of blue |
| Reserve button | Green (`bg-green-700`) matching vehicle cards |
| "Más artículos" heading | Removed from Related Posts section |
| Prev/Next cards | Side-by-side grid layout (`grid-cols-2`) |

### PR #125 — ToC Visibility Fix (merged to main)
- **Problem**: Table of Contents invisible on desktop. Tailwind v4 scanner doesn't generate `lg:block` when combined with `hidden` in Vue templates.
- **Solution**: `data-blog-toc` attribute + explicit CSS media query in `base.css`:
  ```css
  [data-blog-toc] { display: none; }
  @media (min-width: 1024px) { [data-blog-toc] { display: block; } }
  ```
- Files changed: `[...slug].vue`, `base.css` — 2 files.

### PR #126 — Layout Reorder & CTA Simplification (merged to main)
4 layout changes from user feedback:

| Change | Detail |
|--------|--------|
| ToC sidebar | Removed `sticky top-24` — scrolls with content |
| "Volver al Blog" | Moved into gray Prev/Next section (white card style) |
| CTA banner | Moved below Prev/Next section (was between Author Bio and Related Posts) |
| CTA buttons | Removed WhatsApp and Reservar buttons, centered text only |

**Final section order**: Hero → Breadcrumbs → Content + Sidebar → Author Bio → Related Posts → Prev/Next + Volver al Blog (gray) → CTA Banner (dark gradient) → Mobile Share → Footer

Files changed: `[...slug].vue` — 1 file.

## Key Architectural Decisions

1. **No `queryCollectionWithEvent` in server routes**: Nuxt Content v3's server-side API doesn't work on Firebase. Use static alternatives.
2. **Static RSS**: `public/rss.xml` served directly by Firebase Hosting CDN. Must be updated manually when adding new blog posts.
3. **Static sitemap URLs**: Blog URLs listed in `nuxt.config.ts` `sitemap.urls`. Must be updated manually when adding new blog posts.
4. **No local builds**: CI/CD handles build and deploy. Never run `npm run build` locally.
5. **No `<NuxtImg>` for hero images**: IPX optimization URLs don't resolve on Firebase Hosting. Use native `<img>` for critical above-the-fold images.
6. **Avatar fallback pattern**: Firebase Storage tokens expire. Always provide CSS fallback for external image URLs.
7. **No `queryCollectionItemSurroundings`**: Returns alphabetical order, not date order. Use custom `.order('date', 'DESC')` query instead.
8. **SSR hydration race for `@error`**: Vue `@error` handlers on `<img>` don't catch errors that fire before hydration. Use `onMounted` + `img.complete && img.naturalWidth === 0` check.
9. **Tailwind v4 scanner workaround**: Scanner doesn't generate responsive utilities like `lg:block` when combined with `hidden` in Vue templates. Use `data-*` attributes + explicit CSS `@media` queries.
10. **Non-sticky ToC**: Sidebar Table of Contents scrolls with content instead of staying fixed — less visual clutter on long articles.

## Manual Maintenance Required

When adding a new blog article:
1. Create markdown file in `packages/ui-alquilatucarro/content/blog/`
2. Add article to `public/rss.xml` (maintain date-descending order, update `lastBuildDate`)
3. Add URL to `nuxt.config.ts` → `sitemap.urls` array
4. Add URL to `nuxt.config.ts` → `prerender.routes` array

## Production Verification (2026-02-01)

- **RSS**: `/rss.xml` → 200, valid XML, 7 articles, 4,458 bytes
- **Sitemap**: `/sitemap.xml` → 200, 30 total URLs, 8 blog URLs (index + 7 articles)
- **All blog pages**: Rendering correctly with all 16 improvements
- **Fix #1 (dates)**: "18 de diciembre de 2025" ✅ (was "17")
- **Fix #2 (hero image)**: Native `<img>`, visible, no `/_ipx/` ✅
- **Fix #3 (avatar)**: Blue circle fallback "A" (32px + 80px) ✅
- **Fix #4 (prev/next)**: Ordered by date DESC, side-by-side grid ✅
- **PR #125 (ToC)**: Visible on desktop via `data-blog-toc` workaround ✅
- **PR #126 (layout)**: Non-sticky ToC ✅, Prev/Next + Volver al Blog in gray section ✅, CTA below without buttons ✅

## Blog Content Production Progress

### Tier 1 — Quick Wins (5 articles, KD ≤ 25%)

| # | Article | Slug | Status | Image |
|---|---------|------|--------|-------|
| 1 | Viajar por carretera en Colombia | `viajar-por-carretera-colombia-guia` | ✅ Merged (PR #136) | ✅ 4 images |
| 2 | Precios de alquiler de carros | `precios-alquiler-carros-colombia` | ✅ Merged (PR #137) | ✅ 4 images |
| 3 | Mejores destinos en carro | `mejores-destinos-viajar-carro-colombia` | ✅ Merged (PR #143) | ✅ 5 images |
| 4 | Turismo en Santander | `turismo-santander-en-carro` | PR #144 | ✅ 4 images |
| 5 | Turismo en Boyacá | `turismo-boyaca-en-carro` | Pending | — |

### Article #1 Images (completed)

Images in `packages/ui-alquilatucarro/public/img/blog/`:

- `viajar-carretera.jpg` — Hero: carretera panorámica colombiana (Freepik)
- `autopista-moderna.jpg` — Autopista con túnel moderno
- `tablero-navegacion-carro.jpg` — Dashboard con GPS y navegación
- `gps-navegacion-carro.jpg` — Conductor usando celular para navegar

## Next Actions

- **Merge PR #144**: Turismo en Santander (images added via Unsplash)
- **Write article #5**: Turismo en Boyacá en carro
- Monitor Google Search Console for blog indexing
- Replace Firebase Storage avatar URL with a local file (long-term fix for expired tokens)

## Economic Decisions

- No paid tools for SEO monitoring (use free tiers)
- Static files over serverless functions where possible (lower cost, faster)

## Branch State

- **main**: Clean, up to date through PR #143
- **feat/blog-turismo-santander**: PR #144 open, awaiting image download
- All feature branches deleted after merge
