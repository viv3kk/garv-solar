# Garv Urja Solar — Design System Reference

> **Purpose:** This document is the single source of truth for all design decisions on this site.
> Any AI agent or developer touching the UI must read this before making changes.

---

## 1. Colour Tokens

All colours are defined as `oklch()` values in `globals.css :root`. **Never hard-code hex or rgb values.**

### Base Palette

| Token | Value | Usage |
|---|---|---|
| `--bg` | `oklch(0.985 0.006 90)` | Default page background (near-white warm) |
| `--bg-warm` | `oklch(0.965 0.012 95)` | Alternate section background (slightly deeper) |
| `--bg-deep` | `oklch(0.93 0.018 100)` | Deep section background (e.g. Impact, stat blocks) |

### Ink (Text)

| Token | Value | Usage |
|---|---|---|
| `--ink` | `oklch(0.22 0.015 130)` | Primary text, headings |
| `--ink-soft` | `oklch(0.42 0.013 130)` | Secondary text, body copy |
| `--ink-mute` | `oklch(0.62 0.010 130)` | Captions, eyebrows, placeholders |

### Rule / Dividers

| Token | Value | Usage |
|---|---|---|
| `--rule` | `oklch(0.88 0.014 110)` | Borders, dividers, grid lines |

### Accent Colours

| Token | Value | Usage |
|---|---|---|
| `--ochre` | `oklch(0.60 0.11 75)` | Primary accent — links, highlights, active states |
| `--ochre-deep` | `oklch(0.46 0.09 65)` | Hover/pressed ochre |
| `--moss` | `oklch(0.46 0.055 145)` | Secondary accent — sustainability signals |
| `--moss-deep` | `oklch(0.34 0.05 145)` | Hover/pressed moss |
| `--sage` | `oklch(0.72 0.045 145)` | Muted green, decorative |
| `--clay` | `oklch(0.55 0.085 45)` | Tertiary warm accent |

### Background Rhythm (section alternation)

Sections alternate backgrounds to create visual separation without hard borders:

```
Hero        → gradient (custom)
About       → --bg
Services    → --bg-warm
Process     → --bg
Calculator  → custom dark (--ink-based)
Projects    → --bg-warm
Impact      → --bg-deep
Testimonials→ --bg-warm
Team        → --bg
FAQ         → --bg-warm
Contact     → custom dark
Footer      → --ink
```

### Colour Themes

Three themes are available via a class on `<body>` or a parent wrapper:

| Class | Description |
|---|---|
| `body.grain` (default) | Warm parchment with paper-grain overlay |
| `.theme-sage` | Green-shifted backgrounds |
| `.theme-dusk` | Dark mode — inverts bg/ink relationship |

---

## 2. Typography

All type classes are in `globals.css`. **Use these classes — do not re-create them with Tailwind.**

### Scale

| Class | Font | Size range | Weight | Use for |
|---|---|---|---|---|
| `.h-display` | Newsreader (serif) | 46–104 px | 400 | Hero headline |
| `.h-section` | Newsreader (serif) | 34–60 px | 400 | Section headings |
| `.h-card` | Newsreader (serif) | 22–28 px | 400 | Card/feature headings |
| `.lede` | IBM Plex Sans | 17–21 px | 300 | Intro paragraphs |
| `.eyebrow` | IBM Plex Mono | 11 px | 400 | Section labels (ALL CAPS, tracked) |

### Font Families

| Class | Font | Use |
|---|---|---|
| `.font-display` | Newsreader | All display and section headings |
| (body default) | IBM Plex Sans | Body text, UI labels |
| `.font-mono` | IBM Plex Mono | Eyebrows, captions, monospaced data |

### Rules
- Headings always use `font-weight: 400` (never bold) — the serif face provides enough visual weight.
- Body text uses `font-weight: 300` for lede-level copy, `400` for standard prose.
- Never set `font-size` directly on elements — always use a scale class or a `clamp()` that fits within the scale.

---

## 3. Spacing Scale

All spacing tokens are in `globals.css :root`. **Use these tokens — never hard-code pixel values in inline styles.**

| Token | Range | Intended use |
|---|---|---|
| `--space-xs` | 8–12 px | Inline gaps, icon padding |
| `--space-sm` | 16–24 px | Component inner padding |
| `--space-md` | 24–40 px | Card gaps, tight stacks |
| `--space-lg` | 40–64 px | Section-head → content gap (`--section-gap`) |
| `--space-xl` | 48–80 px | Between major blocks inside a section |
| `--space-2xl` | 64–104 px | Reserved for hero-level separation |
| `--section-py` | 48–80 px | Section top/bottom padding (applied via `.section-pad`) |
| `--section-gap` | = `--space-lg` | Gap between eyebrow/heading and section content |

### Spacing Rules
1. **Section padding** is always applied via the `.section-pad` utility class — never by setting `padding` manually on `<section>`.
2. **Heading-to-content gaps** use `var(--section-gap)` or `margin-bottom: var(--section-gap)` — never a raw pixel value.
3. **Component-internal gaps** use `--space-xs` through `--space-md` depending on density.
4. **Never** mix `gap:`, `margin-top:`, and `padding:` on the same element to fake spacing. Pick one.

---

## 4. Layout System

### Container

```css
.container-site   /* max-width: --max-w (1320px), centered, gutter padding */
.section-pad      /* padding-block: --section-py */
```

Always wrap section content in `<div className="container-site">` inside `<section className="section-pad">`.

### Grid Patterns

| Pattern | Classes / Style |
|---|---|
| 2-col equal | `style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'var(--space-lg)' }}` |
| 2-col editorial (60/40) | `gridTemplateColumns: '3fr 2fr'` |
| 4-col stats | `gridTemplateColumns: 'repeat(4, 1fr)'` |
| Responsive collapse | Add `className="max-md:grid-cols-1"` (custom Tailwind breakpoint) |

### Breakpoints (custom, defined in `tailwind.config.ts`)

| Token | Value | Usage |
|---|---|---|
| `max-sm` | 639 px | Mobile-only overrides |
| `max-md` | 767 px | Tablet-and-below overrides |

These are used as **max-width** variants: `className="max-md:grid-cols-1"`.

---

## 5. Component Patterns

### Eyebrow
```tsx
<Eyebrow>Label Text</Eyebrow>
```
Renders as mono-tracked ALL CAPS with a leading rule line. Always the first element in a section header.

### Section Header Anatomy
```
<Eyebrow>          ← always first
<h2 className="h-section">  ← section title
<p className="lede">        ← optional subtitle (right column in .section-head)
```
Wrap in `.section-head` div for the standard 2-col editorial header layout.

### Image Component
```tsx
<ImgPh src="https://images.unsplash.com/..." tag="Location Name" />
```
Always use `<ImgPh>` — never raw `<img>` or Next.js `<Image>`. Adds gradient overlay and location tag. Use Unsplash URLs with `?w=900&q=80&auto=format&fit=crop`.

### Reveal (fade-in animation)
```tsx
<Reveal delay={200}>   {/* delay in ms, optional */}
  ...content
</Reveal>
```
Wraps content in an IntersectionObserver fade-in-up. Use on any element that should animate in on scroll. Stagger sibling items with incrementing `delay` values (e.g., `i * 80`).

### Counter (animated stat)
```tsx
<Counter to={1000} suffix="+" />
```
Animates from 0 to `to` with cubic ease-out, observer-gated. Use inside Reveal for combined scroll + count-up effect.

### Buttons
```tsx
<button className="btn btn-primary">Label</button>
<button className="btn btn-ghost">Label</button>
<a className="btn btn-primary btn-arrow">Label</a>  {/* adds → arrow */}
```

---

## 6. Animation Conventions

| Animation | Where defined | Used on |
|---|---|---|
| `blob-drift-a/b` | `globals.css` | Hero background blobs |
| `sun-rotate` | `globals.css` | Hero conic-gradient ring |
| `mote-float` | `globals.css` | Hero floating particles |
| `fade-in` | `globals.css` | Services tab panel swap |
| `.reveal` / `.reveal.visible` | `globals.css` | All scroll-triggered reveals |

**Rule:** All motion should be `transition-duration: 0.55s ease` for reveals, `0.22s` for interactive state changes (hover, focus). Never use `animation: all`.

---

## 7. Section Checklist

When adding a new section, verify:

- [ ] `<section>` has `.section-pad` class
- [ ] Content is wrapped in `<div className="container-site">`
- [ ] Background uses a CSS token (`--bg`, `--bg-warm`, `--bg-deep`, or custom)
- [ ] Section header follows Eyebrow → h2 → lede anatomy
- [ ] Heading-to-content gap uses `var(--section-gap)` (not a raw pixel value)
- [ ] Images use `<ImgPh>`, not `<img>`
- [ ] Scroll-reveal items are wrapped in `<Reveal>`
- [ ] No hard-coded colours — only `var(--token-name)` or Tailwind utilities
- [ ] Responsive collapse handled with `max-md:` variants

---

## 8. What Not To Do

| ❌ Don't | ✅ Do instead |
|---|---|
| `style={{ padding: '140px 0' }}` | `className="section-pad"` |
| `style={{ marginBottom: '72px' }}` | `style={{ marginBottom: 'var(--section-gap)' }}` |
| `style={{ color: '#8B6914' }}` | `style={{ color: 'var(--ochre)' }}` |
| `<img src="..." />` | `<ImgPh src="..." tag="..." />` |
| `style={{ fontSize: '48px' }}` | `className="h-section"` |
| `font-weight: 700` on headings | `font-weight: 400` (serif does the work) |
| Adding a new breakpoint | Use `max-sm` or `max-md` from tailwind.config.ts |
| Hard-coding a gap like `gap: 56px` | `gap: 'var(--space-lg)'` |

---

*Last updated: May 2026. Maintained alongside `globals.css` and `tailwind.config.ts`.*
