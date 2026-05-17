-- =============================================================================
-- Solar Marketplace Platform — Initial Schema
-- Phase 1: Catalogue + Identity + Transactions
-- Phase 2: Aggregator (product_sources, source_listings, price_history)
-- discovery.* kept separate for scraped staging data
-- Scale: <1000 products — kept deliberately simple
-- =============================================================================

create extension if not exists "uuid-ossp";

-- =============================================================================
-- IDENTITY & ACCESS
-- =============================================================================

create table public.profiles (
    id          uuid primary key references auth.users on delete cascade,
    full_name   text,
    phone       text,
    avatar_url  text,
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table public.organizations (
    id          uuid primary key default uuid_generate_v4(),
    name        text not null,
    gstin       text unique,
    pan         text,
    address     jsonb,          -- {line1, line2, city, state, pincode}
    kyc_status  text not null default 'pending'
                    check (kyc_status in ('pending','submitted','verified','rejected')),
    created_at  timestamptz not null default now(),
    updated_at  timestamptz not null default now()
);

create table public.memberships (
    id              uuid primary key default uuid_generate_v4(),
    user_id         uuid not null references public.profiles on delete cascade,
    organization_id uuid not null references public.organizations on delete cascade,
    role            text not null default 'member'
                        check (role in ('owner','member')),
    created_at      timestamptz not null default now(),
    unique (user_id, organization_id)
);

-- =============================================================================
-- CATALOGUE
-- =============================================================================

create table public.brands (
    id          uuid primary key default uuid_generate_v4(),
    name        text not null unique,
    slug        text not null unique,
    logo_url    text,
    website     text,
    is_active   boolean not null default true,
    created_at  timestamptz not null default now()
);

create table public.categories (
    id          uuid primary key default uuid_generate_v4(),
    name        text not null,
    slug        text not null unique,
    parent_id   uuid references public.categories(id),  -- null = top-level
    created_at  timestamptz not null default now()
);

-- Top-level categories seeded from SunStore data
insert into public.categories (name, slug) values
    ('Modules',     'solar-modules'),
    ('Inverters',   'inverters'),
    ('Batteries',   'batteries'),
    ('Cables',      'cables'),
    ('Structure',   'structure'),
    ('Solar Kits',  'solar-kits'),
    ('BOS',         'solar-bos');

create table public.products (
    id              uuid primary key default uuid_generate_v4(),
    sku             text unique,
    name            text not null,
    slug            text unique,
    brand_id        uuid references public.brands,
    category_id     uuid references public.categories,
    description     text,
    specs           jsonb not null default '{}',   -- varies per category
    primary_image   text,
    datasheet_url   text,
    is_active       boolean not null default true,
    search_vector   tsvector,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_products_brand    on public.products (brand_id);
create index idx_products_category on public.products (category_id);
create index idx_products_specs    on public.products using gin(specs);
create index idx_products_search   on public.products using gin(search_vector);

create or replace function public.products_search_vector_update() returns trigger as $$
begin
    new.search_vector :=
        setweight(to_tsvector('english', coalesce(new.name, '')), 'A') ||
        setweight(to_tsvector('english', coalesce(new.sku, '')), 'B') ||
        setweight(to_tsvector('english', coalesce(new.description, '')), 'C');
    return new;
end;
$$ language plpgsql;

create trigger products_search_vector_trigger
    before insert or update on public.products
    for each row execute function public.products_search_vector_update();

-- Variants: different SKUs of the same product (e.g. 540W vs 545W of the same panel line)
create table public.product_variants (
    id              uuid primary key default uuid_generate_v4(),
    product_id      uuid not null references public.products on delete cascade,
    sku             text unique,
    name            text not null,
    specs           jsonb not null default '{}',   -- overrides/extends parent specs
    primary_image   text,
    datasheet_url   text,
    is_active       boolean not null default true,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create index idx_variants_product on public.product_variants (product_id);

create table public.product_images (
    id          uuid primary key default uuid_generate_v4(),
    product_id  uuid not null references public.products on delete cascade,
    url         text not null,
    sort_order  int not null default 0,
    source      text default 'manual',   -- 'manual' | 'sunstore' | 'manufacturer'
    created_at  timestamptz not null default now()
);

-- =============================================================================
-- PHASE 1 — TRANSACTIONS
-- =============================================================================

create table public.carts (
    id              uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations on delete cascade,
    user_id         uuid not null references public.profiles,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.cart_items (
    id          uuid primary key default uuid_generate_v4(),
    cart_id     uuid not null references public.carts on delete cascade,
    product_id  uuid not null references public.products,
    variant_id  uuid references public.product_variants,
    quantity    int not null default 1 check (quantity > 0),
    created_at  timestamptz not null default now(),
    unique (cart_id, product_id, variant_id)
);

create table public.quotes (
    id              uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations,
    created_by      uuid not null references public.profiles,
    status          text not null default 'requested'
                        check (status in ('requested','quoted','accepted','rejected','expired')),
    notes           text,
    expires_at      timestamptz,
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.quote_items (
    id          uuid primary key default uuid_generate_v4(),
    quote_id    uuid not null references public.quotes on delete cascade,
    product_id  uuid not null references public.products,
    variant_id  uuid references public.product_variants,
    quantity    int not null check (quantity > 0),
    unit_price  numeric(12,2),      -- null until quoted
    gst_rate    numeric(5,2),       -- e.g. 12.00 for 12%
    created_at  timestamptz not null default now()
);

create table public.orders (
    id              uuid primary key default uuid_generate_v4(),
    organization_id uuid not null references public.organizations,
    quote_id        uuid references public.quotes,
    status          text not null default 'confirmed'
                        check (status in ('confirmed','processing','dispatched','delivered','cancelled')),
    total_amount    numeric(14,2),
    created_at      timestamptz not null default now(),
    updated_at      timestamptz not null default now()
);

create table public.order_items (
    id          uuid primary key default uuid_generate_v4(),
    order_id    uuid not null references public.orders on delete cascade,
    product_id  uuid not null references public.products,
    variant_id  uuid references public.product_variants,
    quantity    int not null,
    unit_price  numeric(12,2) not null,
    gst_rate    numeric(5,2)
);

create table public.order_events (
    id          uuid primary key default uuid_generate_v4(),
    order_id    uuid not null references public.orders on delete cascade,
    status      text not null,
    note        text,
    created_by  uuid references public.profiles,
    created_at  timestamptz not null default now()
);

-- =============================================================================
-- PHASE 2 — AGGREGATOR (simple, no extra indexes)
-- =============================================================================

create table public.product_sources (
    id               uuid primary key default uuid_generate_v4(),
    product_id       uuid not null references public.products on delete cascade,
    source_name      text not null,          -- 'sunstore', 'loomsolar', etc.
    source_url       text not null unique,
    source_sku       text,
    match_confidence text not null default 'manual'
                         check (match_confidence in ('manual','high','medium','low','unmatched')),
    created_at       timestamptz not null default now(),
    updated_at       timestamptz not null default now()
);

create table public.source_listings (
    id           uuid primary key default uuid_generate_v4(),
    source_id    uuid not null references public.product_sources on delete cascade,
    price        numeric(14,2),      -- null if quote-gated
    currency     text not null default 'INR',
    in_stock     boolean,
    last_seen_at timestamptz not null default now(),
    created_at   timestamptz not null default now()
);

create table public.price_history (
    id          uuid primary key default uuid_generate_v4(),
    source_id   uuid not null references public.product_sources on delete cascade,
    price       numeric(14,2),
    currency    text not null default 'INR',
    recorded_at timestamptz not null default now()
);

-- =============================================================================
-- CROSS-CUTTING
-- =============================================================================

create table public.audit_logs (
    id          bigserial primary key,
    actor_id    uuid references public.profiles,
    action      text not null,
    table_name  text,
    record_id   uuid,
    old_data    jsonb,
    new_data    jsonb,
    created_at  timestamptz not null default now()
);

-- =============================================================================
-- DISCOVERY SCHEMA — scraped staging (not production)
-- =============================================================================

create schema if not exists discovery;

create table if not exists discovery.scraped_products (
    id            serial primary key,
    source_url    text not null unique,
    source        text not null default 'sunstore.co',
    category      text,
    name          text,
    brand         text,
    image_url     text,
    specs         jsonb,
    images        jsonb,
    datasheet_url text,
    description   text,
    raw           jsonb,
    scraped_at    timestamptz,
    ingested_at   timestamptz not null default now(),
    updated_at    timestamptz not null default now()
);

create index idx_scraped_category on discovery.scraped_products (category);
create index idx_scraped_brand    on discovery.scraped_products (brand);

-- =============================================================================
-- updated_at triggers
-- =============================================================================

create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger set_updated_at before update on public.profiles
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.organizations
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.products
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.product_variants
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.quotes
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.orders
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.carts
    for each row execute function public.set_updated_at();
create trigger set_updated_at before update on public.product_sources
    for each row execute function public.set_updated_at();

-- =============================================================================
-- ROW LEVEL SECURITY
-- =============================================================================

alter table public.profiles          enable row level security;
alter table public.organizations     enable row level security;
alter table public.memberships       enable row level security;
alter table public.products          enable row level security;
alter table public.product_variants  enable row level security;
alter table public.brands            enable row level security;
alter table public.categories        enable row level security;
alter table public.product_images    enable row level security;
alter table public.carts             enable row level security;
alter table public.cart_items        enable row level security;
alter table public.quotes            enable row level security;
alter table public.quote_items       enable row level security;
alter table public.orders            enable row level security;
alter table public.order_items       enable row level security;
alter table public.order_events      enable row level security;
alter table public.product_sources   enable row level security;
alter table public.source_listings   enable row level security;
alter table public.price_history     enable row level security;

-- Public read on catalogue
create policy "products are public"   on public.products         for select using (is_active = true);
create policy "variants are public"   on public.product_variants for select using (is_active = true);
create policy "brands are public"     on public.brands           for select using (is_active = true);
create policy "categories are public" on public.categories       for select using (true);
create policy "images are public"     on public.product_images   for select using (true);
create policy "sources are public"    on public.product_sources  for select using (true);
create policy "listings are public"   on public.source_listings  for select using (true);
create policy "history is public"     on public.price_history    for select using (true);

-- Profiles: own row only
create policy "own profile"
    on public.profiles for all
    using (id = auth.uid());

-- Memberships: see own
create policy "own memberships"
    on public.memberships for select
    using (user_id = auth.uid());

-- Organizations: members can view
create policy "org members can view"
    on public.organizations for select
    using (id in (
        select organization_id from public.memberships where user_id = auth.uid()
    ));

-- Carts: org-scoped
create policy "org cart access"
    on public.carts for all
    using (organization_id in (
        select organization_id from public.memberships where user_id = auth.uid()
    ));

create policy "org cart items access"
    on public.cart_items for all
    using (cart_id in (
        select id from public.carts where organization_id in (
            select organization_id from public.memberships where user_id = auth.uid()
        )
    ));

-- Quotes: org-scoped
create policy "org quote access"
    on public.quotes for all
    using (organization_id in (
        select organization_id from public.memberships where user_id = auth.uid()
    ));

create policy "org quote items access"
    on public.quote_items for select
    using (quote_id in (
        select id from public.quotes where organization_id in (
            select organization_id from public.memberships where user_id = auth.uid()
        )
    ));

-- Orders: org-scoped
create policy "org order access"
    on public.orders for select
    using (organization_id in (
        select organization_id from public.memberships where user_id = auth.uid()
    ));

create policy "org order items access"
    on public.order_items for select
    using (order_id in (
        select id from public.orders where organization_id in (
            select organization_id from public.memberships where user_id = auth.uid()
        )
    ));

create policy "org order events access"
    on public.order_events for select
    using (order_id in (
        select id from public.orders where organization_id in (
            select organization_id from public.memberships where user_id = auth.uid()
        )
    ));
