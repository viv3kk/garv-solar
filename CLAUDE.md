# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server at http://localhost:3000
npm run build    # production build
npm run lint     # ESLint via Next.js
npx tsc --noEmit # type-check without emitting (use node_modules/.bin/tsc --noEmit if npx resolves wrong version)
```

There are no tests configured yet.

## Architecture

This is a **single-page marketing site** for Garv Urja Solar. The entire homepage lives in one file: `app/page.tsx` (~1,500 lines). There are no separate `components/` or `lib/` directories — all atom components, section components, and data arrays are co-located in that single file.

### `app/page.tsx` structure (top to bottom)

**Atom components** (reusable primitives at the top of the file):
- `Eyebrow` — mono label with a leading rule line
- `Arrow`, `Plus`, `SunMark` — inline SVG icons
- `ImgPh` — image wrapper with a gradient overlay and location tag; renders a striped placeholder when `src` is omitted
- `Reveal` — `IntersectionObserver`-based fade-in-up (threshold 0.12, triggers once)
- `Counter` — `requestAnimationFrame` count-up with cubic ease-out, also observer-gated

**Section components** (rendered in order in `<Home />`):
`Nav` → `Hero` → `Marquee` → `About` → `Services` → `Process` → `Calculator` → `Projects` → `Impact` → `Shop` → `Testimonials` → `Team` → `FAQ` → `Contact` → `Footer`

**Key interactive sections:**
- `Nav` — scroll listener toggles frosted-glass style at 40 px
- `Hero` — CSS keyframe blobs (`blob-drift-a/b`), rotating conic gradient (`sun-rotate`), floating motes (`mote-float`) — all defined in `globals.css`
- `Services` — local `useState` tab index; re-renders panel with `fade-in` animation on tab change
- `Calculator` — all math is inline; uses Gujarat tariff constants (`₹8.5` residential, `₹9.5` commercial) and irradiation assumption of 5.2 kWh/m²/day
- `FAQ` — local `useState` for open index; max-height CSS accordion
- `Contact` — controlled form with a `submitted` boolean that swaps the form for a success state

### Styling approach

Styling is a **hybrid of CSS custom properties + Tailwind utility classes + inline `style` props**:

- All design tokens live in `globals.css` under `:root` as `oklch()` values. Always use these variables (`var(--ochre)`, `var(--ink-soft)`, etc.) — never hardcode colours.
- Responsive layout uses the custom max-width breakpoints defined in `tailwind.config.ts` (`max-sm: 639px`, `max-md: 767px`). These are used as class names like `className="max-md:grid-cols-1"`.
- Section spacing is driven by `--section-py` / `--gutter` / `--max-w` CSS variables; use the `.container-site` and `.section-pad` classes for new sections.
- Typography classes (`.h-display`, `.h-section`, `.h-card`, `.lede`, `.eyebrow`) are defined in `globals.css` — use these, don't recreate them with Tailwind.
- Three colour themes exist: `warm` (default, applied via `body.grain`), `sage`, and `dusk`. Switching theme applies a class on `<body>` or a parent element.

### Images

All images are Unsplash URLs with `?w=900&q=80&auto=format&fit=crop`. The `next.config.ts` allowlists `images.unsplash.com`. When adding new images use the `<ImgPh src=... tag=...>` component — not a raw `<img>` or Next.js `<Image>` — so the gradient overlay and location tag render correctly.

## Design System

**Read `DESIGN_SYSTEM.md` before making any visual or layout changes.** It is the canonical reference for:

- All colour tokens (never hard-code colours)
- Typography scale (use `.h-display`, `.h-section`, `.h-card`, `.lede`, `.eyebrow`)
- Spacing scale (`--space-xs` → `--space-2xl`, `--section-py`, `--section-gap`)
- Layout helpers (`.container-site`, `.section-pad`, `.section-head`)
- Component patterns (`Eyebrow`, `ImgPh`, `Reveal`, `Counter`, buttons)
- Section checklist and anti-patterns

### Key spacing rules (quick reference)
- Section padding → always via `className="section-pad"` (uses `--section-py: clamp(48px, 5vw, 80px)`)
- Heading-to-content gap → `style={{ marginBottom: 'var(--section-gap)' }}`
- All other gaps → use `--space-xs` through `--space-2xl` tokens
- Never hard-code pixel values for spacing
