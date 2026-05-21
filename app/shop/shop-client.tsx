'use client'

import { useState, useMemo } from 'react'
import ProductCard from '../components/product-card'
import type { Product } from '../../types/product'

type Category = { id: string; name: string; slug: string }
type Brand = { id: string; name: string; slug: string }

const TRUST_ITEMS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M9 12l2 2 4-4" /><circle cx="12" cy="12" r="10" />
      </svg>
    ),
    label: '100% Genuine · brand-sourced',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="16" rx="2" /><path d="M3 10h18M8 14h4" />
      </svg>
    ),
    label: 'GST invoice on every order',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="1" y="3" width="15" height="13" rx="1" />
        <path d="m16 8 4 0 3 3v5h-7M5 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM19 21a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      </svg>
    ),
    label: 'Pan-India dispatch',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20M6 15h2M11 15h2" />
      </svg>
    ),
    label: 'Trade credit available',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3-2.3v6h-6l2.3-2.3A7 7 0 0 0 12 5a7 7 0 1 0 7 7" />
      </svg>
    ),
    label: 'Easy DOA returns',
  },
]

function CategoryIcon({ slug, className }: { slug: string; className?: string }) {
  const s = slug.toLowerCase()
  if (s.includes('module') || s.includes('panel') || s.includes('solar-m')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2.5" y="2.5" width="15" height="15" rx="1" />
        <line x1="10" y1="2.5" x2="10" y2="17.5" />
        <line x1="2.5" y1="10" x2="17.5" y2="10" />
        <line x1="6.25" y1="2.5" x2="6.25" y2="17.5" opacity="0.5" />
        <line x1="13.75" y1="2.5" x2="13.75" y2="17.5" opacity="0.5" />
      </svg>
    )
  }
  if (s.includes('inverter')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="2.5" y="2.5" width="15" height="15" rx="1.5" />
        <rect x="5" y="5" width="10" height="3.5" rx="0.5" fill="currentColor" stroke="none" />
        <circle cx="6.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="9" cy="13" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="11.5" cy="13" r="0.7" fill="currentColor" stroke="none" />
        <circle cx="14" cy="13" r="0.7" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  if (s.includes('batter')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="4" y="5" width="12" height="13" rx="0.5" />
        <rect x="6.5" y="2.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
        <rect x="11" y="2.5" width="2.5" height="2.5" fill="currentColor" stroke="none" />
        <line x1="4" y1="10" x2="16" y2="10" />
        <line x1="4" y1="14" x2="16" y2="14" />
      </svg>
    )
  }
  if (s.includes('cable') || s.includes('wire') || s.includes('connector')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M3 6 Q5 4, 7 6 T11 6 T15 6 T17 8" />
        <path d="M3 14 Q5 12, 7 14 T11 14 T15 14 T17 12" />
      </svg>
    )
  }
  if (s.includes('struct') || s.includes('mount') || s.includes('rack')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
        <line x1="2.5" y1="16" x2="17.5" y2="16" />
        <line x1="6" y1="16" x2="6" y2="11" />
        <line x1="14.5" y1="16" x2="14.5" y2="4.5" />
        <line x1="6" y1="11" x2="14.5" y2="4.5" />
        <line x1="10" y1="13" x2="10" y2="7.5" />
      </svg>
    )
  }
  if (s.includes('kit')) {
    return (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
        <rect x="1.5" y="2.5" width="8" height="8" rx="0.5" />
        <line x1="5.5" y1="2.5" x2="5.5" y2="10.5" />
        <line x1="1.5" y1="6.5" x2="9.5" y2="6.5" />
        <rect x="11.5" y="8.5" width="7" height="9" rx="0.5" />
        <line x1="13" y1="11" x2="17" y2="11" />
        <circle cx="14" cy="15" r="0.6" fill="currentColor" stroke="none" />
        <circle cx="16" cy="15" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    )
  }
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="2.5" y="5" width="15" height="10" rx="1" />
      <line x1="6" y1="7.5" x2="6" y2="12.5" />
      <line x1="9" y1="7.5" x2="9" y2="12.5" />
      <line x1="12" y1="7.5" x2="12" y2="12.5" />
      <line x1="15" y1="7.5" x2="15" y2="12.5" />
    </svg>
  )
}

function ShopHeader({
  query,
  setQuery,
  brandCount,
  skuCount,
}: {
  query: string
  setQuery: (q: string) => void
  brandCount: number
  skuCount: number
}) {
  return (
    <>
      {/* Topbar */}
      <div className="shop-topbar">
        <div className="container-site shop-topbar-inner">
          <span className="shop-topbar-tag">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
              <circle cx="12" cy="12" r="4" />
            </svg>
            Trade catalogue · For installers, EPCs &amp; MSMEs
          </span>
          <div className="shop-topbar-links">
            <a href="tel:+918810405990">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.72 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.35 1.85.59 2.81.72A2 2 0 0 1 22 16.92z" />
              </svg>
              +91 88104 05990
            </a>
            <a href="/#contact">Help &amp; Support</a>
            <a href="/" className="shop-topbar-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
              Garv Urja main site
            </a>
          </div>
        </div>
      </div>

      {/* Main header — sticky */}
      <header className="shop-header">
        <div className="container-site shop-header-inner">
          <a href="/shop" className="shop-header-logo">
            <span className="shop-logo-dot" />
            <span className="shop-logo-name">Garv Urja</span>
            <span className="shop-logo-sub">Catalogue</span>
          </a>

          <div className="shop-header-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for modules, inverters, batteries…"
              aria-label="Search products"
            />
            <span className="shop-header-search-meta">
              {skuCount} SKUs · {brandCount} brands
            </span>
          </div>

          <div className="shop-header-actions">
            <a href="/#contact" className="shop-header-cta">
              Get a Quote
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <polyline points="9 6 15 12 9 18" />
              </svg>
            </a>
          </div>
        </div>
      </header>
    </>
  )
}

type SortOption = 'featured' | 'name-asc' | 'name-desc'
type ViewMode = 'grid' | 'list'

// Filter facets — derive distinct values for a spec key from products
type FacetSpec = {
  key: string
  title: string
  // optional formatter for value display
  formatLabel?: (raw: string) => string
}

const SPEC_FACETS: FacetSpec[] = [
  { key: 'cell_type', title: 'Cell Technology' },
  { key: 'config', title: 'Configuration' },
  { key: 'type', title: 'Type' },
  { key: 'phase', title: 'Phase' },
  { key: 'dcr', title: 'DCR Status', formatLabel: v => (v === 'true' ? 'DCR (Subsidy)' : 'Non-DCR') },
  { key: 'wattage', title: 'Wattage', formatLabel: v => `${v} W` },
  { key: 'capacity', title: 'Capacity', formatLabel: v => v },
  { key: 'warranty_perf', title: 'Performance Warranty', formatLabel: v => `${v} years` },
]

function computeFacetCounts(products: Product[], key: string): Map<string, number> {
  const counts = new Map<string, number>()
  for (const p of products) {
    const raw = p.specs?.[key]
    if (raw == null || raw === '') continue
    const v = String(raw)
    counts.set(v, (counts.get(v) ?? 0) + 1)
  }
  return counts
}

export default function ShopClient({
  products,
  categories,
  brands,
}: {
  products: Product[]
  categories: Category[]
  brands: Brand[]
}) {
  const [selectedBrands, setSelectedBrands] = useState<Set<string>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [specFilters, setSpecFilters] = useState<Record<string, Set<string>>>({})
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('featured')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [brandsExpanded, setBrandsExpanded] = useState(false)
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set())
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Products filtered by category first — drives sidebar facets
  const productsInCategory = useMemo(
    () => (activeCategory ? products.filter(p => p.category?.slug === activeCategory) : products),
    [products, activeCategory],
  )

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of productsInCategory) {
      if (p.brand?.slug) counts[p.brand.slug] = (counts[p.brand.slug] ?? 0) + 1
    }
    return counts
  }, [productsInCategory])

  // Brands present overall (for the banner)
  const brandCountsAll = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of products) {
      if (p.brand?.slug) counts[p.brand.slug] = (counts[p.brand.slug] ?? 0) + 1
    }
    return counts
  }, [products])

  const brandsWithProducts = useMemo(
    () =>
      brands
        .filter(b => (brandCountsAll[b.slug] ?? 0) > 0)
        .sort((a, b) => (brandCountsAll[b.slug] ?? 0) - (brandCountsAll[a.slug] ?? 0)),
    [brands, brandCountsAll],
  )

  const sidebarBrands = useMemo(
    () =>
      brandsWithProducts
        .map(b => ({ ...b, count: brandCounts[b.slug] ?? 0 }))
        .sort((a, b) => b.count - a.count),
    [brandsWithProducts, brandCounts],
  )

  // Active spec facets — only render groups that have ≥2 distinct values
  const activeSpecFacets = useMemo(
    () =>
      SPEC_FACETS.map(facet => ({
        ...facet,
        counts: computeFacetCounts(productsInCategory, facet.key),
      })).filter(facet => facet.counts.size >= 2),
    [productsInCategory],
  )

  function toggleBrand(slug: string) {
    setSelectedBrands(prev => {
      const next = new Set(prev)
      next.has(slug) ? next.delete(slug) : next.add(slug)
      return next
    })
  }

  function toggleSpec(key: string, value: string) {
    setSpecFilters(prev => {
      const current = new Set(prev[key] ?? new Set<string>())
      current.has(value) ? current.delete(value) : current.add(value)
      const next = { ...prev, [key]: current }
      if (current.size === 0) delete next[key]
      return next
    })
  }

  function toggleGroup(id: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function resetFilters() {
    setSelectedBrands(new Set())
    setActiveCategory(null)
    setSpecFilters({})
    setQuery('')
  }

  const filtered = useMemo(() => {
    let result = productsInCategory
    if (selectedBrands.size > 0) {
      result = result.filter(p => p.brand?.slug != null && selectedBrands.has(p.brand.slug))
    }
    for (const [key, values] of Object.entries(specFilters)) {
      if (values.size === 0) continue
      result = result.filter(p => values.has(String(p.specs?.[key] ?? '')))
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          (p.brand?.name.toLowerCase().includes(q) ?? false),
      )
    }
    if (sortBy === 'name-asc') return [...result].sort((a, b) => a.name.localeCompare(b.name))
    if (sortBy === 'name-desc') return [...result].sort((a, b) => b.name.localeCompare(a.name))
    return result
  }, [productsInCategory, selectedBrands, specFilters, query, sortBy])

  const activeSpecCount = Object.values(specFilters).reduce((sum, set) => sum + set.size, 0)
  const totalActiveFilters = selectedBrands.size + activeSpecCount + (query ? 1 : 0)
  const hasFilters = totalActiveFilters > 0 || activeCategory !== null

  const visibleBrands = brandsExpanded ? sidebarBrands : sidebarBrands.slice(0, 6)

  return (
    <>
      <ShopHeader
        query={query}
        setQuery={setQuery}
        brandCount={brandsWithProducts.length}
        skuCount={products.length}
      />

      {/* Trust strip */}
      <div className="shop-trust-strip">
        <div className="container-site shop-trust-inner">
          {TRUST_ITEMS.map((item, i) => (
            <div key={i} className="shop-trust-item">
              {item.icon}
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* Brands banner */}
      {brandsWithProducts.length > 0 && (
        <section className="shop-brands-banner">
          <div className="container-site">
            <div className="shop-brands-header">
              <div>
                <p className="shop-brands-label">
                  Trusted suppliers · {brandsWithProducts.length} manufacturer
                  {brandsWithProducts.length !== 1 ? 's' : ''}
                </p>
                <h2 className="shop-brands-headline">
                  Genuine solar equipment from India&apos;s{' '}
                  <em>leading manufacturers</em>
                </h2>
              </div>
            </div>
            <div className="shop-brands-track">
              {brandsWithProducts.map(brand => (
                <button
                  key={brand.id}
                  type="button"
                  className={`shop-brand-card${selectedBrands.has(brand.slug) ? ' active' : ''}`}
                  onClick={() => toggleBrand(brand.slug)}
                  aria-pressed={selectedBrands.has(brand.slug)}
                >
                  <span className="shop-brand-name">{brand.name}</span>
                  <span className="shop-brand-count">
                    {brandCountsAll[brand.slug]} SKU
                    {brandCountsAll[brand.slug] !== 1 ? 's' : ''}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Meta row */}
      <div className="shop-meta-row">
        <div className="container-site shop-meta-inner">
          <div className="shop-crumb">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/shop">Shop</a>
            <span>/</span>
            <h1>
              {activeCategory
                ? categories.find(c => c.slug === activeCategory)?.name ?? 'Products'
                : 'All Products'}
            </h1>
          </div>
          <div className="shop-meta-info">
            <strong>{products.length}</strong> SKUs ·{' '}
            <strong>{brandsWithProducts.length}</strong> brand
            {brandsWithProducts.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Categories row — sticky */}
      <div className="shop-cats-wrap">
        <div className="container-site shop-cats-inner">
          <span className="shop-cats-label">Browse by</span>
          <div className="shop-cats-scroll">
            <button
              type="button"
              className={`shop-cat-pill${!activeCategory ? ' active' : ''}`}
              onClick={() => setActiveCategory(null)}
            >
              Shop All
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`shop-cat-pill${activeCategory === cat.slug ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat.slug)}
              >
                <CategoryIcon slug={cat.slug} className="shop-cat-icon" />
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Page body */}
      <div className="container-site shop-page-body">
        <div className="shop-layout">
          {/* Sidebar */}
          <aside className={`shop-sidebar${mobileFiltersOpen ? ' mobile-open' : ''}`}>
            <button
              type="button"
              className="shop-mobile-filter-close"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close filters"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="shop-sidebar-title">
              Filters
              {hasFilters && (
                <small onClick={resetFilters} role="button" tabIndex={0}>
                  Clear all
                </small>
              )}
            </div>

            {/* Brand */}
            {sidebarBrands.length > 0 && (
              <div className={`shop-filter-group${collapsedGroups.has('brand') ? ' collapsed' : ''}`}>
                <button
                  type="button"
                  className="shop-filter-group-header"
                  onClick={() => toggleGroup('brand')}
                >
                  <span className="shop-filter-group-title">
                    Brand{selectedBrands.size > 0 && ` · ${selectedBrands.size}`}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="shop-filter-group-body">
                  {visibleBrands.map(brand => {
                    const isOn = selectedBrands.has(brand.slug)
                    const disabled = brand.count === 0
                    return (
                      <div
                        key={brand.id}
                        className="shop-filter-option"
                        onClick={() => !disabled && toggleBrand(brand.slug)}
                        role="checkbox"
                        aria-checked={isOn}
                        aria-disabled={disabled}
                        tabIndex={disabled ? -1 : 0}
                        onKeyDown={e => {
                          if ((e.key === ' ' || e.key === 'Enter') && !disabled) {
                            e.preventDefault()
                            toggleBrand(brand.slug)
                          }
                        }}
                        style={disabled ? { opacity: 0.45, cursor: 'not-allowed' } : undefined}
                      >
                        <div className="shop-filter-option-left">
                          <div className={`shop-filter-checkbox${isOn ? ' checked' : ''}`} />
                          <span>{brand.name}</span>
                        </div>
                        <span className="shop-filter-count">{brand.count}</span>
                      </div>
                    )
                  })}
                  {sidebarBrands.length > 6 && (
                    <button
                      type="button"
                      className="shop-show-more"
                      onClick={() => setBrandsExpanded(e => !e)}
                    >
                      {brandsExpanded
                        ? 'Show less'
                        : `Show ${sidebarBrands.length - 6} more →`}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Dynamic spec facets */}
            {activeSpecFacets.map(facet => (
              <div
                key={facet.key}
                className={`shop-filter-group${collapsedGroups.has(facet.key) ? ' collapsed' : ''}`}
              >
                <button
                  type="button"
                  className="shop-filter-group-header"
                  onClick={() => toggleGroup(facet.key)}
                >
                  <span className="shop-filter-group-title">
                    {facet.title}
                    {(specFilters[facet.key]?.size ?? 0) > 0 &&
                      ` · ${specFilters[facet.key]?.size}`}
                  </span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div className="shop-filter-group-body">
                  {[...facet.counts.entries()]
                    .sort((a, b) => {
                      // Numeric values sort numerically; otherwise alphabetically
                      const an = Number(a[0])
                      const bn = Number(b[0])
                      if (!isNaN(an) && !isNaN(bn)) return an - bn
                      return a[0].localeCompare(b[0])
                    })
                    .map(([value, count]) => {
                      const isOn = specFilters[facet.key]?.has(value) ?? false
                      const label = facet.formatLabel ? facet.formatLabel(value) : value
                      return (
                        <div
                          key={value}
                          className="shop-filter-option"
                          onClick={() => toggleSpec(facet.key, value)}
                          role="checkbox"
                          aria-checked={isOn}
                          tabIndex={0}
                          onKeyDown={e => {
                            if (e.key === ' ' || e.key === 'Enter') {
                              e.preventDefault()
                              toggleSpec(facet.key, value)
                            }
                          }}
                        >
                          <div className="shop-filter-option-left">
                            <div className={`shop-filter-checkbox${isOn ? ' checked' : ''}`} />
                            <span>{label}</span>
                          </div>
                          <span className="shop-filter-count">{count}</span>
                        </div>
                      )
                    })}
                </div>
              </div>
            ))}
          </aside>

          {/* Main content */}
          <main className="shop-main">
            {/* Toolbar */}
            <div className="shop-toolbar">
              <p className="shop-result-count">
                Showing <strong>{filtered.length}</strong> of{' '}
                <strong>{productsInCategory.length}</strong> products
              </p>

              <div className="shop-toolbar-right">
                <button
                  type="button"
                  className="shop-mobile-filter-btn"
                  onClick={() => setMobileFiltersOpen(true)}
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6" />
                    <line x1="7" y1="12" x2="17" y2="12" />
                    <line x1="10" y1="18" x2="14" y2="18" />
                  </svg>
                  Filters
                  {totalActiveFilters > 0 && ` · ${totalActiveFilters}`}
                </button>

                <div className="shop-view-toggle" role="group" aria-label="View mode">
                  <button
                    type="button"
                    className={viewMode === 'grid' ? 'active' : ''}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                    aria-pressed={viewMode === 'grid'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="7" height="7" />
                      <rect x="14" y="3" width="7" height="7" />
                      <rect x="3" y="14" width="7" height="7" />
                      <rect x="14" y="14" width="7" height="7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className={viewMode === 'list' ? 'active' : ''}
                    onClick={() => setViewMode('list')}
                    title="List view"
                    aria-pressed={viewMode === 'list'}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="8" y1="6" x2="21" y2="6" />
                      <line x1="8" y1="12" x2="21" y2="12" />
                      <line x1="8" y1="18" x2="21" y2="18" />
                      <line x1="3" y1="6" x2="3.01" y2="6" />
                      <line x1="3" y1="12" x2="3.01" y2="12" />
                      <line x1="3" y1="18" x2="3.01" y2="18" />
                    </svg>
                  </button>
                </div>

                <select
                  className="shop-sort-select"
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort products"
                >
                  <option value="featured">Sort: Featured</option>
                  <option value="name-asc">Name A–Z</option>
                  <option value="name-desc">Name Z–A</option>
                </select>
              </div>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="shop-active-filters">
                <span className="shop-active-filters-label">Filters</span>

                {activeCategory &&
                  (() => {
                    const cat = categories.find(c => c.slug === activeCategory)
                    return cat ? (
                      <span className="shop-filter-chip">
                        {cat.name}
                        <button
                          type="button"
                          onClick={() => setActiveCategory(null)}
                          aria-label="Remove category filter"
                        >
                          ×
                        </button>
                      </span>
                    ) : null
                  })()}

                {[...selectedBrands].map(slug => {
                  const brand = brands.find(b => b.slug === slug)
                  return brand ? (
                    <span key={`brand-${slug}`} className="shop-filter-chip">
                      {brand.name}
                      <button
                        type="button"
                        onClick={() => toggleBrand(slug)}
                        aria-label={`Remove ${brand.name} filter`}
                      >
                        ×
                      </button>
                    </span>
                  ) : null
                })}

                {Object.entries(specFilters).flatMap(([key, values]) => {
                  const facet = SPEC_FACETS.find(f => f.key === key)
                  return [...values].map(value => (
                    <span key={`${key}-${value}`} className="shop-filter-chip">
                      {facet?.formatLabel ? facet.formatLabel(value) : value}
                      <button
                        type="button"
                        onClick={() => toggleSpec(key, value)}
                        aria-label={`Remove ${value} filter`}
                      >
                        ×
                      </button>
                    </span>
                  ))
                })}

                {query && (
                  <span className="shop-filter-chip">
                    &ldquo;{query}&rdquo;
                    <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                      ×
                    </button>
                  </span>
                )}

                <button type="button" className="shop-clear-all" onClick={resetFilters}>
                  Clear all
                </button>
              </div>
            )}

            {/* Product grid */}
            <div className={`product-grid${viewMode === 'list' ? ' product-grid-list' : ''}`}>
              {filtered.length > 0 ? (
                filtered.map(product => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))
              ) : (
                <p className="shop-empty lede">No products match your filters.</p>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
