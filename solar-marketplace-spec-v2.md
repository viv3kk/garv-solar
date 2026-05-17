# Solar Marketplace Platform — Project Specification

**Working title:** Solar Marketplace Platform
**Version:** 0.1 (draft)
**Date:** May 13, 2026
**Status:** Planning / pre-implementation

---

## 1. Overview

A unified solar e-commerce and intelligence platform serving the Indian solar industry, built and operated under one umbrella with three integrated products that share a common backend, database, and user system.

The platform brings together three needs that today require visiting multiple sites: discovering and procuring solar equipment, comparing prices across vendors, and managing internal procurement workflows. Phase 1 establishes the canonical product catalogue and buyer experience; Phases 2 and 3 layer additional value on top of that same foundation.

The platform is targeted primarily at Indian EPCs (Engineering, Procurement, Construction firms), MSMEs adopting rooftop solar, and the internal procurement team running the platform itself.

### 1.1 Goals

- Become a one-stop platform for solar equipment discovery, comparison, and procurement in India
- Build a clean, authoritative product catalogue independent of any single vendor
- Provide buyers with price intelligence by aggregating listings across the market
- Run efficient internal procurement on the same data infrastructure as the public marketplace

### 1.2 Non-goals (for now)

- Solar installation services (handled by EPC partners, not us)
- Financing / loan origination (referrals only in Phase 1)
- Building a mobile app (web-responsive only for Phase 1)
- International expansion (India-only)
- Multi-vendor seller onboarding in Phase 1 (we are the sole seller initially)

---

## 2. The Three-Phase Plan

| Phase | Product | Audience | Timeline (est.) |
|---|---|---|---|
| 1 | Solar Marketplace | EPCs, MSMEs, businesses buying solar | ~3–4 weeks for MVP |
| 2 | Comparison / Aggregator | Same buyers + SEO traffic | ~4–6 weeks after Phase 1 |
| 3 | Internal Procurement Admin | Internal staff | ~3–4 weeks after Phase 2 |

Each phase ships on top of the previous one — same database, same auth, same product catalogue — with new UI surfaces and new tables added incrementally.

### 2.1 Phase 1 — Solar Marketplace

A public e-commerce site where buyers can browse solar products by category and brand, see specifications, add to cart, and request a quote. Pricing in the Indian solar B2B market is typically quote-based, so the flow is browse → cart → quote request → quote response within ~24 hours → confirm and pay.

Core deliverables: product catalogue (modules, inverters, batteries, cables, BOS, structures, kits), brand pages, search and filtering, cart, quote request flow, buyer dashboard, organization/team accounts, basic admin for managing the catalogue.

### 2.2 Phase 2 — Comparison / Aggregator Site

A public site that compares solar product prices and specs across multiple sources (other marketplaces, manufacturer direct listings, retailer sites). The aggregator anchors every external listing to a canonical product in our catalogue, so a buyer sees "Waaree 540W Mono PERC — available at ₹X here, ₹Y at vendor B, ₹Z at vendor C" with attribution and links.

Core deliverables: source adapters (per-site scraper modules), data normalization, product matching with manual review queue, comparison UI, price history charts, SEO-optimized product pages.

### 2.3 Phase 3 — Internal Procurement Admin

A separate, access-restricted application on its own subdomain for the internal team to manage suppliers, inventory, purchase orders, and the company's own procurement operations. Reuses the same DB and auth as Phases 1 and 2 with a stricter access model.

Core deliverables: supplier management, purchase order workflow with approvals, inventory tracking, internal user management, audit logs, reporting dashboards.

---

## 3. Target Users

### 3.1 Buyers (Phase 1 & 2)

- **EPCs** — Solar installers buying equipment for client projects. Typically buy in larger quantities, want competitive prices, need GST invoices.
- **MSMEs and businesses** — End customers installing rooftop solar on their own premises. Lower volume, may be price-sensitive, often new to the space.
- **Residential customers (secondary)** — Individual homeowners; smaller orders.

Buyers belong to **organizations** (companies). One organization has one or more users with roles within it. KYC (GST, PAN) is captured at the organization level.

### 3.2 Internal Users (Phase 3)

- **Catalogue managers** — Add/edit products, manage brands and categories
- **Procurement staff** — Manage suppliers, raise purchase orders
- **Procurement admins** — Approve purchase orders, manage inventory
- **Super admin** — Platform owner, full access including user management

### 3.3 Anonymous visitors (Phases 1 & 2)

Can browse the catalogue, view product details, and use the comparison tool. Cannot see prices on private listings, cannot request quotes, cannot purchase.

---

## 4. Functional Requirements

### 4.1 Phase 1 — Marketplace

**Public-facing**
- Browse products by category (Modules, Inverters, Batteries, Cables, BOS, Structures, Solar Kits) and sub-category
- Browse by brand (Waaree, Vikram, Jinko, Trina, Luminous, Havells, Polycab, etc.)
- Full-text search across product names, model numbers, brands
- Filter by specs (wattage, efficiency, type, etc. — varies per category)
- Product detail page with specs, images, datasheet PDF, related products
- Solar EMI / savings calculator (carry-over deliverable from earlier scope)

**Authenticated buyer**
- Sign up / log in (email + password, optional Google OAuth)
- Create or join an organization
- Submit organization KYC details (GST, PAN, address)
- Add products to cart with quantities
- Submit quote request from cart
- View quote history and status (requested, quoted, accepted, rejected, expired)
- Accept quote and confirm order
- Track order status (confirmed, processing, dispatched, delivered)
- Download invoices

**Admin (lite, in Phase 1)**
- Create / edit / archive products, variants, brands, categories
- Upload product images and datasheets
- View incoming quote requests, respond with pricing
- Manage orders through their lifecycle

### 4.2 Phase 2 — Aggregator

- Scheduled scrapers run per source, write normalized data
- Each scraped listing matched to a canonical product in our catalogue (or flagged for manual review)
- Manual review queue UI for ambiguous matches
- Comparison view on product detail: "Available at N vendors, prices ₹X–₹Y"
- Price history chart per source per product
- "Best price" indicator with timestamp and source attribution
- Outbound clicks tracked (potential affiliate revenue)
- SEO-optimized comparison pages (structured data, server-rendered)

### 4.3 Phase 3 — Internal Procurement

- Supplier directory with contact details, payment terms, KYC documents
- Internal product-to-supplier mapping (which supplier we buy each SKU from, at what price)
- Purchase order creation, draft → submit → approve → send to supplier
- Approval workflows based on PO value (e.g., > ₹5L needs admin approval)
- Goods receipt notes (GRN) — receive against POs
- Basic inventory tracking (current stock per SKU per warehouse)
- Audit log of every PO, every inventory movement, every approval action
- Internal dashboards: monthly procurement value, top suppliers, slow-moving inventory

---

## 5. Technical Architecture

### 5.1 Stack summary

| Concern | Choice | Notes |
|---|---|---|
| Frontend framework | Next.js 15 (App Router) | Same for all 3 apps |
| Language | TypeScript | Strict mode |
| Database | Supabase (Postgres) | Free tier sufficient for prototype |
| ORM | Drizzle | Lighter than Prisma, good monorepo story |
| Auth | Supabase Auth + RLS | Free up to 50k MAU; well under our scale |
| Object storage | Supabase Storage | Images and datasheet PDFs |
| Search | Postgres `tsvector` | Upgrade to Meilisearch only if needed |
| Hosting | Vercel | Already in use |
| Scraping runtime | Local laptop → GitHub Actions cron | Free; no dedicated server |
| Background jobs | Supabase `pg_cron` + Edge Functions | Free; no Inngest/BullMQ needed yet |
| Transactional email | Resend (free 3000/mo) | Quote notifications, order updates |
| Error monitoring | Sentry free tier | 5k errors/month |
| Domain | Already owned | — |

**Backend pattern:** Next.js Route Handlers + Server Actions only. No separate NestJS or Node backend in Phase 1. Code is organized into framework-free service modules so that if a separate backend is ever needed, the business logic ports over with minimal changes.

### 5.2 Monorepo structure

```
solar-platform/
├── apps/
│   ├── marketplace/     # Phase 1 — public buyer UI
│   ├── compare/         # Phase 2 — public comparison UI
│   └── admin/           # Phase 3 — internal procurement
├── packages/
│   ├── db/              # Drizzle schema, migrations, shared queries
│   ├── auth/            # Supabase Auth client + helpers
│   ├── ui/              # Shared React components (shadcn/ui base)
│   ├── types/           # Shared TypeScript types and Zod schemas
│   └── services/        # Framework-free business logic (products, quotes, orders)
├── scrapers/            # Source adapters for Phase 2 (Python or Node)
├── turbo.json
└── pnpm-workspace.yaml
```

Tooling: **Turborepo** for orchestration, **pnpm** for package management.

Each `apps/*` is deployed as a separate Vercel project on its own subdomain:
- `marketplace.yourdomain.com` (or apex `yourdomain.com`)
- `compare.yourdomain.com`
- `admin.yourdomain.com`

All three apps share a single Supabase project (one Postgres database).

### 5.4 Local development environment

Local development uses a Docker-based Supabase instance managed by the Supabase CLI.

**Start / stop:**
```bash
supabase start   # starts Postgres + Auth + Storage + Studio
supabase stop
supabase db reset   # wipe and re-run all migrations
```

**Local service URLs:**

| Service | URL |
|---|---|
| Studio (Web UI) | http://127.0.0.1:54323 |
| REST API | http://127.0.0.1:54321/rest/v1 |
| GraphQL API | http://127.0.0.1:54321/graphql/v1 |
| Mailpit (email testing) | http://127.0.0.1:54324 |

**Local Postgres connection string:**
```
postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

**Local Supabase API keys (dev only — never commit to production):**

| Key | Value |
|---|---|
| Publishable (anon) | *(generated by `supabase start`)* |
| Secret (service role) | *(generated by `supabase start`)* |

**Local Supabase Storage (S3-compatible):**

| Field | Value |
|---|---|
| URL | http://127.0.0.1:54321/storage/v1/s3 |
| Access Key | *(generated by `supabase start`)* |
| Secret Key | *(generated by `supabase start`)* |
| Region | `local` |

> All services bind to `0.0.0.0` locally. These keys are shared local defaults — rotate everything before any production deployment.

---

### 5.3 Service module pattern

Business logic lives in `packages/services/` as plain TypeScript, not bound to Next.js. Example shape:

```
packages/services/products/
  products.types.ts      # Zod schemas + inferred TS types
  products.queries.ts    # DB queries via Drizzle
  products.service.ts    # Business logic, called from route handlers/actions
  products.test.ts
```

Route handlers and server actions stay thin (parse input, check auth, call service, return). This keeps tests fast and makes the eventual split to a separate backend, if ever needed, a copy-paste rather than a rewrite.

---

### 5.5 Media storage (Cloudflare R2)

All product images, gallery photos, and datasheet PDFs are stored in a Cloudflare R2 bucket and served through a public CDN domain.

**Bucket and CDN:**

| Field | Value |
|---|---|
| Bucket | `garv-urja` |
| CDN domain | `https://media.garvurja.com` |
| R2 endpoint (S3-compat) | *(from Cloudflare R2 settings)* |

**Object key structure:**

Every file gets a deterministic key derived from its original filename. Directory is determined by file type:

```
products/images/<filename>    # .png .jpg .jpeg .webp .gif .avif
products/pdfs/<filename>      # .pdf  (datasheets)
products/other/<filename>     # anything else
```

Full CDN URL: `https://media.garvurja.com/products/images/<filename>`

**Cache headers:** All objects are uploaded with `Cache-Control: public, max-age=31536000, immutable` — 1-year immutable cache. Never mutate an existing key; upload under a new name instead.

**Supported content types:**

| Extension | MIME type |
|---|---|
| `.png` | `image/png` |
| `.jpg` / `.jpeg` | `image/jpeg` |
| `.webp` | `image/webp` |
| `.gif` | `image/gif` |
| `.avif` | `image/avif` |
| `.pdf` | `application/pdf` |

**Media fields per product record:**

| Field | Location in record | Description |
|---|---|---|
| `image` | top-level | Primary card / thumbnail image |
| `detail.images` | array | Full gallery images |
| `detail.datasheet_url` | nested | Datasheet PDF |
| `detail.manufacturer_logo` | nested | Brand logo |

**Using R2 URLs in the Next.js apps:**

Add the CDN domain to `next.config.ts` so `next/image` can optimize from it:

```ts
// next.config.ts
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.garvurja.com",
        pathname: "/products/**",
      },
    ],
  },
};
```

Then use normally:

```tsx
import Image from "next/image";

<Image
  src="https://media.garvurja.com/products/images/some-panel.webp"
  alt="Waaree 540W"
  width={600}
  height={400}
/>
```

For datasheets, use a plain `<a href="...">` — `next/image` does not handle PDFs.

The `NEXT_PUBLIC_MEDIA_BASE_URL` env var (set to `https://media.garvurja.com`) lets you construct URLs without hardcoding the domain:

```ts
const imageUrl = `${process.env.NEXT_PUBLIC_MEDIA_BASE_URL}/products/images/${filename}`;
```

**Migration tooling (`migrate_media.py`):**

Used to backfill media from an external source (originally `mp-prod-files.s3.amazonaws.com`) into R2. It rewrites URLs in all `data/*.json` files in place.

```bash
# Dry-run: count URLs without uploading
python migrate_media.py --dry-run

# Smoke test on one file, limit to 5 URLs
python migrate_media.py --only-json data/cables_20260515.json --limit 5

# Full backfill, 8 parallel upload slots
python migrate_media.py --concurrency 8

# After migration, push rewritten URLs to Postgres
python ingest.py
```

The script keeps a persistent URL→R2 mapping in `data/media_url_map.json`. Re-running is always safe — already-uploaded keys are detected via a `HEAD` check and skipped. Original JSON files are backed up to `data/migrated/originals/` before any rewrite.

**Local development:**

For local runs, Supabase Storage (§5.4) is the simpler alternative — no R2 credentials needed. Set `NEXT_PUBLIC_MEDIA_BASE_URL=http://127.0.0.1:54321/storage/v1/object/public/media` and upload via the Supabase Studio UI or the `supabase storage` CLI.

Set `R2_UPLOAD_MEDIA=false` in `.env` (default) to skip R2 uploads during scrape runs on localhost.

---

## 6. Data Model

### 6.1 Core entities

**Identity & access**
- `users` — auth identity, managed by Supabase Auth
- `profiles` — extended user info (name, phone, avatar)
- `organizations` — buyer companies (GST, PAN, address, KYC status)
- `memberships` — joins users ↔ orgs with a role (`owner`, `member`)

**Catalogue**
- `brands` — Waaree, Jinko, etc.
- `categories` — hierarchical (Modules → Mono PERC / HJT / Thin Film)
- `products` — canonical product, keyed on `(brand_id, model_number)`
- `product_variants` — different SKUs of the same product (e.g., 540W and 545W of same line)
- `product_images` — separate table; tracks source attribution
- `product_datasheets` — links to PDFs in Supabase Storage

**Specs**
- `specs` stored as JSONB on `products` (varies by category — wattage for modules, Ah for batteries, gauge for cables)
- Optional: `category_spec_schemas` to validate JSONB shape per category

**Phase 1 transactions**
- `carts`, `cart_items`
- `quotes`, `quote_items`, `quote_responses`
- `orders`, `order_items`, `order_events` (status history)
- `invoices`

**Phase 2 aggregator**
- `product_sources` — "this canonical product appears on vendor X as their SKU Y"
- `source_listings` — current price + URL per source per product
- `price_history` — snapshots over time
- `scrape_runs` — log of each scraper execution
- `scrape_raw` — raw scraped JSON, retained for re-processing

**Phase 3 procurement**
- `suppliers` — internal supplier directory
- `supplier_products` — which supplier we buy each SKU from, at what price
- `purchase_orders`, `purchase_order_items`, `purchase_order_approvals`
- `goods_receipts`, `goods_receipt_items`
- `inventory_levels` — current stock per SKU per warehouse
- `inventory_movements` — every inbound/outbound

**Cross-cutting**
- `audit_logs` — every admin action, every approval, every mutation that matters

### 6.1.1 PostgreSQL Schema Implementation

The canonical database schema lives in `supabase/migrations/20260514000000_initial_schema.sql`. Key tables and their structure:

**Identity & Access**

```text
profiles (id→auth.users, full_name, phone, avatar_url, created_at, updated_at)
organizations (id, name, gstin, pan, address[jsonb], kyc_status, created_at, updated_at)
memberships (id, user_id→profiles, organization_id→organizations, role∈{owner,member})
```

**Catalogue**

```text
brands (id, name, slug unique, logo_url, website, is_active, created_at)
categories (id, name, slug unique, parent_id→categories[self-ref], created_at)
  ↳ Seeded: Modules, Inverters, Batteries, Cables, Structure, Solar Kits, BOS

products (id, sku unique, name, slug, brand_id→brands, category_id→categories,
  description, specs[jsonb], primary_image, datasheet_url, is_active,
  search_vector[tsvector], created_at, updated_at)
  ↳ Index: gin(specs), gin(search_vector) for full-text and spec filtering
  ↳ Trigger: search_vector auto-updated on insert/update

product_variants (id, product_id→products on delete cascade, sku unique, name,
  specs[jsonb], primary_image, datasheet_url, is_active, created_at, updated_at)

product_images (id, product_id→products on delete cascade, url, sort_order,
  source∈{manual,sunstore,manufacturer}, created_at)
```

**Phase 1 Transactions**

```text
carts (id, organization_id→organizations, user_id→profiles, created_at, updated_at)
cart_items (id, cart_id→carts, product_id→products, variant_id→product_variants,
  quantity>0, created_at, unique(cart_id, product_id, variant_id))

quotes (id, organization_id→organizations, created_by→profiles,
  status∈{requested,quoted,accepted,rejected,expired}, notes, expires_at, created_at, updated_at)
quote_items (id, quote_id→quotes, product_id→products, variant_id→product_variants,
  quantity>0, unit_price[numeric(12,2)], gst_rate[numeric(5,2)], created_at)

orders (id, organization_id→organizations, quote_id→quotes,
  status∈{confirmed,processing,dispatched,delivered,cancelled}, total_amount[numeric(14,2)],
  created_at, updated_at)
order_items (id, order_id→orders, product_id→products, variant_id→product_variants,
  quantity, unit_price[numeric(12,2)], gst_rate[numeric(5,2)])

order_events (id, order_id→orders, status, note, created_by→profiles, created_at)
```

**Phase 2 Aggregator**

```text
product_sources (id, product_id→products on delete cascade, source_name, source_url unique,
  source_sku, match_confidence∈{manual,high,medium,low,unmatched}, created_at, updated_at)

source_listings (id, source_id→product_sources, price[numeric(14,2)],
  currency[default INR], in_stock[boolean], last_seen_at, created_at)

price_history (id, source_id→product_sources, price[numeric(14,2)],
  currency[default INR], recorded_at)
```

**Discovery (Phase 2 staging)**

```text
discovery.scraped_products (id[serial], source_url unique, source[default sunstore.co],
  category, name, brand, image_url, specs[jsonb], images[jsonb], datasheet_url,
  description, raw[jsonb], scraped_at, ingested_at, updated_at)
```

**Cross-cutting**

```text
audit_logs (id[bigserial], actor_id→profiles, action, table_name, record_id,
  old_data[jsonb], new_data[jsonb], created_at)
```

**Triggers & Indexes**

- `set_updated_at()` trigger on: profiles, organizations, products, product_variants, quotes, orders, carts, product_sources
- Full-text search vector auto-updated from product name, SKU, and description on insert/update
- Indexes on foreign keys and frequently-filtered columns (brand_id, category_id, category on scraped_products)

### 6.2 Critical architectural decisions

**Products are canonical; vendor listings are separate.** The `products` table represents *the actual product made by the manufacturer*. The `product_sources` table represents *where it's listed for sale*. This separation is what makes Phase 2 work without rebuilding Phase 1. Phase 1 queries `products` directly (our own listings). Phase 2 joins `products` with `product_sources` to show multi-vendor comparison.

**Specs as JSONB.** Solar product specs vary wildly across categories. A column-per-spec schema explodes; a separate `attributes` table makes queries awkward. JSONB on the `products` table, with optional validation against per-category schemas, is the sweet spot.

**Multi-tenancy via organizations.** Buyers are users-within-organizations, not lone users. This is critical for B2B — one EPC may have 5 people using the platform under one GST. Quote and order ownership is at the org level, not user level.

---

## 7. Authentication & Authorization

### 7.1 Identity

Supabase Auth handles signup, login, password reset, email verification, and OAuth (Google enabled at minimum). Sessions are HTTP-only cookies on the platform domain, verified server-side on every protected request.

### 7.2 Roles (RBAC)

| Role | Phase | Scope | Permissions |
|---|---|---|---|
| `guest` | 1, 2 | Public | Browse, search, compare; cannot see private prices or quote |
| `buyer` | 1 | Org-scoped | All of guest, plus cart, quote requests, orders for their org |
| `buyer_admin` | 1 | Org-scoped | All of buyer, plus manage org's users and KYC |
| `catalogue_manager` | 1, 2 | Internal | Edit catalogue, manage Phase 2 scraping config |
| `procurement_staff` | 3 | Internal | Create POs, manage suppliers |
| `procurement_admin` | 3 | Internal | Approve POs, manage inventory |
| `super_admin` | All | Internal | Everything |

### 7.3 Row-level security (RLS)

Every table has RLS policies enforced at the database level. Implemented policies (from `20260514000000_initial_schema.sql`):

#### Public catalogue (unauthenticated)

- `products`, `product_variants`, `brands`, `categories`, `product_images` — `SELECT` if `is_active = true`
- `product_sources`, `source_listings`, `price_history` — `SELECT` without restriction (aggregator data is public)

#### Authenticated buyers (org-scoped)

- `profiles` — can view/edit own row only (`WHERE id = auth.uid()`)
- `memberships` — can view own memberships (`WHERE user_id = auth.uid()`)
- `organizations` — can view if user is a member (`WHERE id IN (select organization_id from memberships where user_id = auth.uid())`)
- `carts`, `cart_items` — org-scoped (`WHERE organization_id IN (user's orgs)`)
- `quotes`, `quote_items` — org-scoped; can insert, select, and manage own org's quotes
- `orders`, `order_items`, `order_events` — org-scoped; read-only for buyers

#### Internal users (admin roles)

- `products`, `brands`, `categories` — can mutate if assigned `catalogue_manager` role
- `purchase_orders`, `suppliers` — internal-only; invisible to buyer roles
- `audit_logs` — insert-only by app code; read-only by `super_admin`

RLS gives defense in depth: even if the application layer has a bug, the database refuses to return rows the user shouldn't see. Combined with role-based access control in the app layer, this prevents unauthorized access to buyer data, internal operations, and pricing information.

### 7.4 Admin subdomain hardening

The admin app (`admin.yourdomain.com`) has additional middleware:
- Restricted to users with an internal role
- Mandatory MFA enforced at the auth provider level
- IP allowlist where feasible
- Stricter session timeout (e.g., 1 hour vs 7 days for buyers)
- Every mutating action writes an `audit_log` entry

---

## 8. Data Acquisition Strategy

### 8.1 Phase 1 — catalogue seeding

The Phase 1 marketplace catalogue is **not** scraped from competitors. It is built from:

- **Manufacturer datasheets** — Waaree, Jinko, Vikram, etc. publish full specs publicly
- **MNRE ALMM list** — Indian government's approved solar modules list; structured, authoritative, free
- **Manual entry by catalogue managers** — ~200 SKUs to start, expanded over time
- **Direct partnerships with brands** — bulk data exchange where possible

This gives clean, authoritative data with zero legal exposure and no dependency on a third-party site staying up.

### 8.2 Phase 2 — multi-source aggregation

Phase 2 is where scraping legitimately applies — the *purpose* of the aggregator is comparison with attribution, similar to PriceRunner or Honey. Every scraped listing links back to the source vendor and is presented as "available here." This is the standard, accepted model for price aggregators.

**Sources to support:**
- SunStore (sunstore.co)
- Loom Solar (loomsolar.com)
- Tata Power Solar consumer site
- Manufacturer direct stores
- (more added over time via the source adapter pattern)

**Scraping principles:**
- Respect `robots.txt`
- Polite request rates (2–5s between requests per domain)
- Identifying User-Agent with contact email
- Cache aggressively; re-scrape on a daily/weekly cadence, not constantly
- Store raw responses in `scrape_raw` for re-processing
- All listings displayed with clear source attribution and outbound link

**Product matching** — the hardest engineering problem in Phase 2:
- Normalize on `(brand, model_number_normalized)` as the join key
- Fuzzy matching (Levenshtein or embedding similarity) for ambiguous cases
- Manual review queue — never auto-merge ambiguous matches
- Re-runnable: when matching logic improves, re-process `scrape_raw`

### 8.3 Primary source: SunStore (sunstore.co)

SunStore is one of the most comprehensive solar equipment catalogues in India, owned by Aerem. It is our **first and most important Phase 2 source** and a **research-only input for Phase 1**.

**Role per phase**

| Phase | Use of SunStore data |
|---|---|
| 1 (Marketplace) | Discovery/research only — identifies which brands and models exist, what categories matter commercially. Our own catalogue is built from manufacturer datasheets and the MNRE ALMM, not from SunStore verbatim. Scraped SunStore data is stored in a separate `discovery.*` schema, not in production `products`. |
| 2 (Aggregator) | Primary source. Listings stored in `product_sources` + `source_listings` and surfaced in comparison UI with attribution and outbound link to SunStore. |
| 3 (Internal) | Competitor price intelligence and category trend signals; not user-facing. |

**Categories covered by the scraper**

`solar-modules`, `inverters`, `batteries`, `cables`, `structure`, `solar-kits`, `solar-bos`

**Implementation**

- Local Python scraper at `scrapers/sunstore/` in the monorepo
- Playwright-based (works against any rendering — Next.js sites like SunStore are JS-heavy)
- Intercepts XHR/Fetch calls during run so we can detect and switch to JSON APIs over time
- Outputs newline-delimited or structured JSON to `data/` for review before any DB ingest
- Polite defaults: 2-second delay between requests, identifying User-Agent, `robots.txt` respected
- Source attribution (`source_url`, `scraped_at`) stamped on every record
- Raw response retained in `scrape_raw` to allow re-normalization later

**Important caveat on pricing**

SunStore prices are quote-gated (browse → request quote → 24h response). Public pages do not expose prices. The scraper captures product specs, brand, model, images, datasheet PDFs, and availability — but **not real prices**. For Phase 2 to display useful price comparisons, additional sources with publicly-visible pricing (Loom Solar, retail e-commerce listings, manufacturer direct stores) will be added in the same scraper framework.

**Ingestion pipeline**

```
local laptop → playwright scraper → data/*.json
       ↓ (separate manual step, after review)
Supabase staging schema (discovery.scraped_products)
       ↓ (matching + manual review)
Phase 2: product_sources, source_listings
Phase 1: never used as production data
```

Keeping ingest as a separate step (not auto-run) gives a checkpoint to review changes and prevent bad scraped data from going live.

### 8.4 Scraper hosting

- **Now:** local laptop, run manually or via local cron/Task Scheduler
- **Soon:** GitHub Actions cron (2000 free minutes/month on private repos)
- **Later, if needed:** a small dedicated worker on Fly.io or Render

The scraper code lives in `scrapers/` in the monorepo. For local runs it writes JSON files; for scheduled cloud runs it writes directly to Supabase using the service-role key (stored as a secret).

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Product list pages: < 1.5s on 4G
- Product detail pages: < 1s on 4G (heavily cached, server-rendered)
- Search results: < 500ms (Postgres FTS sufficient up to ~10k SKUs)
- Comparison page: < 2s including external prices (cached server-side)

### 9.2 Security

- All requests served over HTTPS (Vercel default)
- HTTP-only, secure, SameSite=Lax cookies for auth
- RLS on every table — no bypass at application layer
- Secrets in Vercel/Supabase env vars, never committed
- Service-role keys used only in server-side code, never shipped to client
- CSRF protection via Next.js Server Actions (built-in)
- Rate limiting on auth endpoints (Supabase built-in) and quote submission (custom)
- Audit logging on every internal mutation
- MFA mandatory for internal roles

### 9.3 Reliability

- Database backups via Supabase (daily, retained 7 days on free tier)
- Vercel preview deployments for every PR
- Sentry alerts on error spikes
- Manual review queue prevents bad scraped data from going live

### 9.4 SEO (Phase 2 especially)

- Server-rendered product pages with structured data (`Product` schema.org JSON-LD)
- Canonical URLs to avoid duplicate content across vendor pages
- XML sitemap auto-generated from catalogue
- Comparison pages tuned for "[brand] [model] price India" search intent

### 9.5 Accessibility

- WCAG 2.1 AA target
- Keyboard navigation across all flows
- Semantic HTML, ARIA where needed
- Forms labeled correctly, errors announced to screen readers

---

## 10. Cost Estimate

| Item | Monthly cost | Notes |
|---|---|---|
| Vercel | ₹0 | Hobby plan, 3 projects |
| Supabase | ₹0 | Free tier (500MB DB, 50k MAU, 1GB storage) |
| Domain | ~₹60/mo amortized | ~₹700/year, already owned |
| Resend | ₹0 | Free 3000 emails/month |
| Sentry | ₹0 | Free 5k errors/month |
| GitHub Actions | ₹0 | 2000 free minutes/month |
| **Total** | **~₹60/mo** | Effectively free; ~₹700/year |

**Likely first paid upgrades** (in order):
1. Supabase Pro (₹2000/mo) when DB hits 500MB or you need point-in-time recovery
2. Vercel Pro (~₹1700/mo) for team collaboration or longer build/function times
3. Meilisearch hosted (~₹1500/mo) when Postgres FTS becomes insufficient

You won't need any of these for the first few hundred users.

---

## 11. Roadmap & Milestones

### 11.1 Pre-launch (Week 0)

- Set up Supabase project, Vercel projects, monorepo, basic CI
- Domain DNS configured for subdomains
- Sentry, Resend, GitHub Actions wired in

### 11.2 Phase 1 — Marketplace (Weeks 1–4)

| Week | Deliverable |
|---|---|
| 1 | DB schema + RLS policies; auth flows (signup, login, org creation) |
| 2 | Product catalogue UI (list, detail, search, filter); admin lite for adding products |
| 3 | Cart, quote request flow, quote response flow |
| 4 | Order management, invoices, polish, launch |

Seed catalogue: ~200 SKUs across the main categories from manufacturer datasheets.

### 11.3 Phase 2 — Aggregator (Weeks 5–10)

| Week | Deliverable |
|---|---|
| 5–6 | Scraper framework + first source adapter (SunStore); `product_sources` and matching tables |
| 7 | Manual review queue UI for ambiguous matches |
| 8 | Comparison UI on product detail; price history |
| 9 | Second and third source adapters; SEO pages |
| 10 | Polish, launch comparison product |

### 11.4 Phase 3 — Internal Procurement (Weeks 11–14)

| Week | Deliverable |
|---|---|
| 11 | Admin app scaffolded on subdomain; supplier directory |
| 12 | Purchase order workflow; approvals |
| 13 | Goods receipt; inventory tracking |
| 14 | Reporting dashboards; audit log UI; polish |

These are estimates for a solo developer working consistently. Realistic doubling is common; treat the timeline as direction, not commitment.

---

## 12. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Scraping target blocks our IP | Medium | Medium | Polite rate limits; respect robots.txt; rotate User-Agent; cache aggressively |
| Legal pushback from scraped sources | Low–Medium | High | Use scraping only for Phase 2 aggregator with clear attribution; do not seed Phase 1 with scraped data; use manufacturer/MNRE for own catalogue |
| Product matching errors in Phase 2 | High | Medium | Manual review queue; never auto-merge; store raw data for re-processing |
| Solo developer burnout / timeline slip | Medium | Medium | Ship Phase 1 minimum-viable; resist scope creep; cut non-essentials |
| Supabase free tier limits hit | Low (early) | Low | Upgrade to Pro is cheap and seamless; no migration needed |
| Quote response SLA missed | Medium | Medium | Internal alerting; clear UX expectations to buyer ("within 24 hours") |
| Catalogue data goes stale | High over time | Medium | Phase 2 scraping inherently re-validates pricing; spec data is stable |

---

## 13. Out of Scope (Explicitly)

- Direct online payment in Phase 1 (quotes are confirmed offline; explore Razorpay later)
- Returns / RMA workflow in Phase 1 MVP
- Multi-currency
- Multi-language UI (English only initially)
- Recommendation engine / personalization
- Live chat / in-app messaging
- Mobile app (responsive web only)
- Selling installation services
- Multi-vendor seller onboarding in Phase 1

---

## 14. Open Questions & Decisions Pending

1. **Project name** — currently a placeholder
2. **Logo and brand identity** — not yet designed
3. **Legal entity** — under what company will the platform operate (existing Aerem-like entity, or new)?
4. **Payment partner** — Razorpay, Cashfree, or another for when Phase 1 moves beyond quote-only
5. **GST compliance** — invoice format, HSN codes per category, IGST/CGST/SGST handling rules
6. **Quote response team** — who responds to quote requests, what's the SLA, how do we route them
7. **Initial supplier list for Phase 3** — which suppliers will we onboard first
8. **Marketing strategy** — SEO-led, partnerships, EPC outreach? Affects what we build first
9. **Affiliate revenue model in Phase 2** — do source vendors pay for outbound clicks, and on what terms

---

## 15. Environment Variables

All three Next.js apps (`marketplace`, `compare`, `admin`) share the same Supabase backend and follow the same env var naming convention. Each app has its own `.env.local` file; secrets must never be committed.

### 15.1 Supabase

| Variable | Local value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `http://127.0.0.1:54321` | Client-safe. Swap for hosted URL in production. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(generated by `supabase start`)* | Client-safe. Row-level security enforces limits. |
| `SUPABASE_SERVICE_ROLE_KEY` | *(generated by `supabase start`)* | **Server-only.** Never expose to client bundles. |
| `SUPABASE_DB_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Used by Drizzle migrations and `ingest.py`. |

### 15.2 App URLs

| Variable | Local value | Notes |
|---|---|---|
| `NEXT_PUBLIC_MARKETPLACE_URL` | `http://localhost:3000` | Used for cross-app links and CORS. |
| `NEXT_PUBLIC_COMPARE_URL` | `http://localhost:3001` | — |
| `NEXT_PUBLIC_ADMIN_URL` | `http://localhost:3002` | — |

### 15.3 Email (Resend)

| Variable | Value | Notes |
|---|---|---|
| `RESEND_API_KEY` | *(set from Resend dashboard)* | Server-only. Free tier: 3 000 emails/month. |
| `EMAIL_FROM` | `noreply@garvurja.com` | Must be a verified sender domain in Resend. |

### 15.4 Media / Object Storage (Cloudflare R2)

See §5.5 for the full architecture, object key schema, cache strategy, and `next/image` configuration.

| Variable | Value | Notes |
|---|---|---|
| `R2_ACCOUNT_ID` | *(from Cloudflare dashboard)* | Server-only. |
| `R2_ACCESS_KEY_ID` | *(from Cloudflare dashboard)* | Server-only. |
| `R2_SECRET_ACCESS_KEY` | *(in `.env`)* | Server-only. |
| `R2_BUCKET` | `garv-urja` | Production bucket. |
| `NEXT_PUBLIC_MEDIA_BASE_URL` | `https://media.garvurja.com` | Public CDN base. Append `/products/images/<file>` or `/products/pdfs/<file>`. |
| `R2_UPLOAD_MEDIA` | `false` (local) / `true` (prod) | Controls whether scrape runs push media to R2. |

> For local development, set `NEXT_PUBLIC_MEDIA_BASE_URL=http://127.0.0.1:54321/storage/v1/object/public/media` and use Supabase Storage instead — no R2 credentials needed.

### 15.5 Error monitoring (Sentry)

| Variable | Value | Notes |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | *(from Sentry project settings)* | Client + server. One DSN per app. |
| `SENTRY_AUTH_TOKEN` | *(from Sentry)* | Build-time only; used by `@sentry/nextjs` source-map upload. |

### 15.6 Scraper-specific (Python, not Next.js)

| Variable | Default | Notes |
|---|---|---|
| `SCRAPE_CONTACT_EMAIL` | *(from team email)* | Included in `User-Agent`. Required. |
| `RATE_LIMIT_SECONDS` | `2.0` | Seconds between requests. Do not go below 2. |
| `MAX_RETRIES` | `3` | Exponential backoff on failure. |
| `HEADLESS` | `true` | Set `false` for debugging with visible browser. |
| `DB_URL` | `postgresql://postgres:postgres@127.0.0.1:54322/postgres` | Used by `ingest.py`. |

### 15.7 `.env.local` template (Next.js apps)

Copy into each `apps/*/` directory and fill in production values before deployment:

```bash
# ── Supabase ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=(generated by supabase start)
SUPABASE_SERVICE_ROLE_KEY=(generated by supabase start)
SUPABASE_DB_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres

# ── App URLs ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_MARKETPLACE_URL=http://localhost:3000
NEXT_PUBLIC_COMPARE_URL=http://localhost:3001
NEXT_PUBLIC_ADMIN_URL=http://localhost:3002

# ── Email (Resend) ────────────────────────────────────────────────────────
RESEND_API_KEY=(from Resend dashboard)
EMAIL_FROM=noreply@garvurja.com

# ── Media (Cloudflare R2) ─────────────────────────────────────────────────
R2_ACCOUNT_ID=(from Cloudflare dashboard)
R2_ACCESS_KEY_ID=(from Cloudflare dashboard)
R2_SECRET_ACCESS_KEY=(from Cloudflare dashboard)
R2_BUCKET=garv-urja
NEXT_PUBLIC_MEDIA_BASE_URL=https://media.garvurja.com

# ── Error monitoring (Sentry) ─────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=(from Sentry project)
SENTRY_AUTH_TOKEN=(from Sentry)
```

---

## 16. Glossary

- **EPC** — Engineering, Procurement, Construction firm; installs solar systems for end customers
- **MSME** — Micro, Small, and Medium Enterprise (Indian classification)
- **MNRE** — Ministry of New and Renewable Energy (Government of India)
- **ALMM** — Approved List of Models and Manufacturers (MNRE's list of approved solar modules)
- **BOS** — Balance of System (electrical components beyond modules and inverters)
- **DCDB / ACDB** — DC / AC Distribution Board
- **PO** — Purchase Order
- **GRN** — Goods Receipt Note
- **RLS** — Row Level Security (Postgres feature)
- **RBAC** — Role-Based Access Control
- **FTS** — Full-Text Search
- **SKU** — Stock Keeping Unit (unique product variant)
- **KYC** — Know Your Customer (identity verification)

---

*This is a living document. Update as decisions are made and the project evolves.*
