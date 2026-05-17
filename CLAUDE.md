# CLAUDE.md

Guidance for Claude Code working with the Garv Urja marketing site.

## Project Overview

**Site:** Garv Urja Solutions — MNRE-registered solar EPC (Alwar, Rajasthan)  
**Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, plain CSS + CSS Modules  
**Audience:** Pan-India (residential, commercial, industrial solar customers)  
**Key focus:** High-performance marketing site, component modularity, CSS co-location

## Commands

```bash
npm run dev      # Dev server at http://localhost:3000
npm run build    # Production build (Turbopack)
npm run lint     # ESLint via Next.js
npx tsc --noEmit # Type-check without emitting
```

No tests configured yet.

## Architecture

### Routes

- `/` — homepage (`app/page.tsx`, ~800 lines, remaining inline sections)
- `/home-solar` — residential landing page with Apple liquid-glass hero
- `/commercial-solar` — C&I landing page (Phase 02 hidden via `hidden: true` flag in PROCESS, filtered by `VISIBLE_PHASES`)
- `/calculator` — savings calculator (~1.7k lines, wrapped in `<Suspense>` because it uses `useSearchParams`)
- `/faqs` — categorised FAQs with search

### Shared layer

- `app/_shared.tsx` — `Nav`, `Footer`, and atom components (`Eyebrow`, `Arrow`, `Plus`, `SunMark`, `ImgPh`, `Reveal`, `Counter`). The leading underscore opts the file out of Next.js routing.
- Nav uses custom CSS classes `.nav-desktop` and `.nav-mobile-btn` (defined in `globals.css`) instead of Tailwind `hidden md:flex`, because inline `style.display` would otherwise override Tailwind.

### Extracted section components

Three sections have been split out of `app/page.tsx` into their own folders under `app/components/`:

- `app/components/hero/index.tsx`
- `app/components/process/index.tsx` (+ `process.module.css`)
- `app/components/calculator/index.tsx`

The remaining 10 sections (`Marquee`, `About`, `Services`, `Projects`, `Impact`, `Shop`, `Testimonials`, `Team`, `FAQ`, `Contact`) are still inline in `app/page.tsx`. Render order in `<Home />` is preserved: `Nav` → `Hero` → `Marquee` → `About` → `Services` → `Process` → `Calculator` → `Projects` → `Impact` → `Shop` → `Testimonials` → `Team` → `FAQ` → `Contact` → `Footer`.

## Styling Approach

Hybrid of **CSS custom properties + Tailwind utility classes + inline `style` props**:

- **Design tokens** live in `globals.css` under `:root` as `oklch()` values (`var(--ochre)`, `var(--ink-soft)`, etc.). Never hardcode colours.
- **Route/component-specific CSS** is co-located: `app/calculator/calculator.css` (loaded via route layout), `app/components/process/process.module.css` (CSS Module). This keeps `globals.css` lean (~990 lines of shared styles only).
- Responsive layout uses Tailwind v4's `max-sm: 639px` and `max-md: 767px` variants (e.g. `className="max-md:grid-cols-1"`). Custom `!important` overrides in `globals.css` handle precedence with inline `style` props.
- Section spacing is driven by `--section-py` / `--gutter` / `--max-w` CSS variables. Use `.container-site` and `.section-pad` for new sections.
- Typography classes (`.h-display`, `.h-section`, `.h-card`, `.lede`, `.eyebrow`) are in `globals.css` — use these, don't recreate with Tailwind.
- Three colour themes: `warm` (default, via `body.grain`), `sage`, `dusk`. Switch via a class on `<body>` or ancestor.

### Apple liquid-glass cards

Used on `/calculator` and the `/home-solar` hero benefits bar. Pattern is `backdrop-filter: blur() saturate()` + inset highlights via box-shadow. Classes: `.calc-card`, `.calc-savings`. Don't replicate inline — extend the existing classes.

### Images

- Marketing photography: Unsplash URLs with `?w=900&q=80&auto=format&fit=crop`. `next.config.ts` allowlists `images.unsplash.com`.
- Real project photos: `/public/images/sites/site-1.jpeg` through `site-4.jpeg`.
- Hero photos: `/public/images/home-solar-hero.png` (desktop) and `home-solar-hero-mobile.png` (mobile, served via `<picture>` with `media` source).
- When adding new images, use the `<ImgPh src=... tag=...>` component — not a raw `<img>` or Next.js `<Image>` — so the gradient overlay and location tag render.

## Design System

**Read `design-system.md` before any visual or layout change.** It is the canonical reference for tokens, typography, spacing, layout helpers, component patterns, and the section checklist.

### Spacing rules (quick reference)

- Section padding → `className="section-pad"` (uses `--section-py: clamp(48px, 5vw, 80px)`)
- Heading-to-content gap → `style={{ marginBottom: 'var(--section-gap)' }}`
- All other gaps → `--space-xs` through `--space-2xl` tokens
- Never hard-code pixel values for spacing

## Naming Conventions

### Files and folders — kebab-case

All lowercase, hyphen-separated. No PascalCase, camelCase, or snake_case for filenames.

- Components: `components/user-profile.tsx`
- Hooks: `hooks/use-local-storage.ts`
- Utilities: `lib/format-date.ts`
- Types: `types/user-data.ts`

**Framework-reserved filenames** (exact, do NOT kebab-case): `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `template.tsx`, `default.tsx`, `route.ts`, `middleware.ts`, `instrumentation.ts`, `opengraph-image.tsx`, `icon.tsx`, `sitemap.ts`, `robots.ts`.

**Project-specific exemptions:** `CLAUDE.md` (reserved), `_shared.tsx` (leading underscore intentional — opts out of Next.js routing), root config files.

### Code — standard JS/TS conventions

- Variables, functions, hooks: `camelCase` (hooks prefixed `use`)
- Booleans: prefer `is`, `has`, `should`, `can` prefixes
- Types, interfaces, components: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

## File Structure

```text
app/
  components/
    hero/
      index.tsx                  ← Extracted section component
    process/
      index.tsx
      process.module.css         ← Co-located CSS Module
    calculator/
      index.tsx                  ← Homepage calculator (not the /calculator route)
  calculator/
    calculator.css               ← Route-specific CSS (loaded via layout.tsx)
    layout.tsx                   ← Imports calculator.css for the /calculator route
    page.tsx                     ← Savings calculator surface
    calc.ts                      ← Math logic
    constants.ts                 ← Tariff rates, state data, etc.
  home-solar/
    page.tsx                     ← Residential landing
  commercial-solar/
    page.tsx                     ← C&I landing (hidden Phase 02)
  faqs/
    page.tsx                     ← FAQ page with search
  _shared.tsx                    ← Shared components (Nav, Footer, atoms)
  globals.css                    ← Design tokens, base styles, shared classes (~990 lines)
  layout.tsx                     ← Root layout
  page.tsx                       ← Homepage (~800 lines)
design-system.md                 ← Token reference, typography, layout, patterns
CLAUDE.md                        ← This file (Claude Code guidance)
```

## Engineering Principles (always-on)

These five rules apply to every change. The rest live in `.claude/_rules/` and should be loaded on demand (see below).

### Immutability

Never mutate existing objects or arrays. Always return new copies. Rationale: prevents hidden side effects, makes debugging easier, plays well with React's reference equality.

### Error handling

Handle errors explicitly at every level. Wrap `JSON.parse` and other throwing calls in `try/catch`. Never silently swallow errors with empty `catch` blocks. Always `throw new Error(...)` — never `throw "string"`.

### Validate at boundaries

Treat all external input (API responses, form input, file content, query params) as untrusted. Validate with a schema (Zod) or explicit checks before use. Fail fast with clear messages.

### Service-role key is server-only

`SUPABASE_SERVICE_ROLE_KEY` may only appear in files under `'use server'`, `route.ts`, `actions.ts`, `packages/services/**`, `packages/db/**`, or `scripts/**`. The canonical admin client lives in `packages/db/admin.ts` with `import 'server-only'` at the top. Never reach for it as a shortcut to bypass an annoying RLS policy — fix the policy. Full rules: `.claude/_rules/supabase/service-role-key.md`.

### Org-scoped queries filter by session org_id, never client payload

For any table holding buyer data (`carts`, `quotes`, `orders`, `invoices`, …), the `org_id` used in SELECT/INSERT/UPDATE/DELETE is resolved server-side from the authenticated session via `getCurrentOrg()`. Never accept `org_id` from a request body or query parameter — Zod schemas on the server use `.strict()` so an extra `org_id` field rejects. RLS is the safety net; this rule is defense in depth. Full rules: `.claude/_rules/supabase/multi-tenancy.md`.

## On-demand rules

Detailed rules live under `.claude/_rules/`. They are **not** auto-loaded — invoke them explicitly when needed:

> "Follow `.claude/_rules/supabase/rls.md` when writing the policy for this table"
> "Use `.claude/_rules/drizzle/migrations.md` to add this column"

Available files:

- `_rules/common/` — coding-style, code-review, development-workflow, git-workflow, hooks, patterns, performance, security, testing, agents, **postgres-patterns, database-migrations, api-design, backend-patterns**
- `_rules/typescript/` — coding-style, hooks, patterns, security, testing
- `_rules/supabase/` — rls, service-role-key, multi-tenancy, auth
- `_rules/drizzle/` — migrations

### When working on the backend, read these in this order

1. `_rules/common/backend-patterns.md` — service-module pattern, route handlers vs server actions
2. `_rules/common/api-design.md` — REST conventions, error envelopes, pagination
3. `_rules/common/postgres-patterns.md` — JSONB, FTS, indexing
4. `_rules/common/database-migrations.md` — general migration discipline
5. `_rules/drizzle/migrations.md` — Drizzle-specific layered on top
6. `_rules/supabase/rls.md` + `_rules/supabase/multi-tenancy.md` + `_rules/supabase/auth.md` — Supabase guardrails

## Sub-agents

`.claude/agents/` contains seven project-local sub-agents that can be invoked via the Agent tool:

- `code-reviewer` — general code review
- `typescript-reviewer` — TS-specific (type safety, async correctness, Node/web security)
- `db-reviewer` — Supabase + Drizzle review (RLS, schema, multi-tenancy, indexes, migrations safety). Invoke whenever migrations, schema files, RLS policy files, or service-module DB queries are touched.
- `refactor-cleaner` — dead code, duplication, deeply nested logic
- `security-reviewer` — OWASP-flavour security pass
- `planner` — high-level implementation planning
- `doc-updater` — keeping docs/CLAUDE.md in sync after changes

## Git Workflow

**Commits:** Use conventional commits (`feat:`, `fix:`, `refactor:`, `chore:`, `docs:`)

**Branches:** Feature branches off `main`, PRs required for review

**Before committing:**

- Run `npm run build` — verify Turbopack compiles all routes
- Run `npm run lint` — fix ESLint warnings
- Run `npx tsc --noEmit` — verify no TypeScript errors
- Verify visual changes in the dev server (`npm run dev`)

**Deployment:** Vercel preview on PR, production on merge to `main`

**CSS refactoring:** After extracting CSS, always run the full build to catch precedence issues or forgotten selectors

## Environment Setup

Copy `.env.local` to the root directory (already created) and fill in production secrets before deployment:

```bash
# Local development — Supabase, Resend, Sentry, Cloudflare R2
cp .env.local .env.local  # Already set up with local defaults
```

**Keys to fill in for production:**

- `RESEND_API_KEY` — from Resend dashboard
- `NEXT_PUBLIC_SENTRY_DSN` — from Sentry project settings
- `SENTRY_AUTH_TOKEN` — from Sentry for build-time source-map uploads
- `R2_SECRET_ACCESS_KEY` — from Cloudflare R2 (production only)

**Local development:**

- Start Supabase: `supabase start`
- Media uploads use Supabase Storage (no R2 setup needed)
- Set `R2_UPLOAD_MEDIA=false` in `.env.local` (default)

Never commit `.env.local` or any secrets to git.
