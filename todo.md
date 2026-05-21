# TODO

## 1. Component extraction — `app/page.tsx` (808 lines, 10 sections still inline)

Extract each section into `app/components/<name>/index.tsx` (+ CSS Module if needed).
Render order must be preserved: Nav → Hero → Marquee → About → Services → Process → Calculator → Projects → Impact → Shop → Testimonials → Team → FAQ → Contact → Footer.

- [ ] Marquee
- [ ] About
- [ ] Services
- [ ] Projects
- [ ] Impact
- [ ] Shop
- [ ] Testimonials
- [ ] Team
- [ ] FAQ
- [ ] Contact

---

## 2. Calculator route extraction — `app/calculator/page.tsx` (1,681 lines)

Break the route page into smaller components under `app/calculator/components/`.
The math logic (`calc.ts`) and constants (`constants.ts`) are already separate.

- [ ] Identify logical UI sections (hero, inputs panel, results panel, savings chart, mobile pill)
- [ ] Extract each into `app/calculator/components/<name>.tsx`
- [ ] Verify sliders, savings, and mobile pill still work after extraction

---

## 3. Product Catalogue UI (Phase 1 marketplace)

### 3.1 Setup

- [x] Database schema (`20260514000000_initial_schema.sql`)
- [ ] Run `supabase start` and apply migration (`supabase db reset`)
- [ ] Seed sample brands and products for development

### 3.2 Data layer

- [x] Supabase client helpers (`lib/supabase/server.ts`, `lib/supabase/client.ts`)
- [x] Product queries (list with pagination, single by slug, search + filter)

### 3.3 Routes

- [x] `/shop` — product listing page (grid, category tabs, search)
- [x] `/shop/[slug]` — product detail page (specs, images, datasheet, quote CTA)
- [ ] `/shop/brands/[slug]` — brand page (all products for a brand)
- [ ] `/shop/categories/[slug]` — category page

### 3.4 Components

- [x] `ProductCard` — image, name, brand, key spec, CTA (`app/components/product-card/`)
- [x] `SpecTable` — renders JSONB specs per category (`app/components/spec-table/`)
- [ ] `FilterSidebar` — brand filter, spec filters (wattage range, type, etc.)
- [ ] `SearchBar` — client-side instant search (upgrade from form GET)

### 3.5 Admin lite (add products)

- [ ] `/admin/products/new` — form to create a product
- [ ] `/admin/products/[id]/edit` — edit product + upload image

---

## 4. Auth flows (prerequisite for cart + quotes)

- [ ] Sign up (email + password)
- [ ] Log in / log out
- [ ] Create or join an organization (post-signup onboarding)
- [ ] Protected route middleware

---

## 5. Cart + Quote flow (after catalogue)

- [ ] Add to cart from product detail
- [ ] Cart page (`/cart`) — review items, quantities
- [ ] Submit quote request
- [ ] Buyer dashboard — quote history and status
- [ ] Order tracking

---

## Later (Phase 2+)

- [ ] Price aggregator (product_sources, source_listings, price_history)
- [ ] Scraper framework (SunStore adapter)
- [ ] Comparison UI on product detail
- [ ] Price history chart
- [ ] Internal procurement admin app

## https://sunstore.co/?redirectUrl=%2Frfq