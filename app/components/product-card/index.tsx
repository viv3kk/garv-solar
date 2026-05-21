import type { Product } from '../../../types/product'
import { BRAND_MAP } from '../../../lib/brands'

type ViewMode = 'grid' | 'list'

function getSpecChips(product: Product): string[] {
  const s = product.specs
  const cat = product.category?.slug ?? ''
  const chips: string[] = []

  if (s.wattage) chips.push(`${s.wattage} W`)
  else if (s['Power (kW)']) chips.push(`${s['Power (kW)']} kW`)
  else if (s.capacity) {
    chips.push(`${s.capacity} ${cat.includes('inverter') ? 'kW' : 'Ah'}`)
  }

  if (s.cell_type) chips.push(String(s.cell_type))
  else if (s.config) chips.push(String(s.config))
  else if (s.type) chips.push(String(s.type))

  if (s.gauge) chips.push(`${s.gauge} sq mm`)
  if (s.warranty_perf) chips.push(`${s.warranty_perf}-yr warranty`)
  else if (s.phase) chips.push(`${s.phase} phase`)

  return chips.slice(0, 3)
}

function getDcrTag(product: Product): 'DCR' | 'N-DCR' | null {
  const dcr = product.specs?.dcr
  if (typeof dcr !== 'boolean') return null
  return dcr ? 'DCR' : 'N-DCR'
}

function CategoryPlaceholder({ slug }: { slug: string }) {
  const s = slug.toLowerCase()
  if (s.includes('inverter')) {
    return (
      <svg className="product-card-image-ph" viewBox="0 0 100 100" fill="none">
        <rect x="20" y="20" width="60" height="60" rx="4" stroke="var(--ochre-deep)" strokeWidth="1.5" />
        <rect x="28" y="30" width="44" height="14" rx="1.5" fill="var(--ochre)" opacity="0.5" />
        <circle cx="32" cy="58" r="2" fill="var(--ink)" />
        <circle cx="42" cy="58" r="2" fill="var(--ink)" />
        <circle cx="52" cy="58" r="2" fill="var(--ink)" />
        <circle cx="62" cy="58" r="2" fill="var(--ink)" />
        <rect x="28" y="68" width="44" height="3" rx="1.5" fill="var(--ink)" opacity="0.3" />
      </svg>
    )
  }
  if (s.includes('batter')) {
    return (
      <svg className="product-card-image-ph" viewBox="0 0 100 100" fill="none">
        <rect x="28" y="22" width="44" height="58" rx="2" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="36" y="14" width="8" height="8" fill="var(--ink)" />
        <rect x="56" y="14" width="8" height="8" fill="var(--ink)" />
        <line x1="28" y1="42" x2="72" y2="42" stroke="var(--ink)" strokeWidth="1.5" />
        <line x1="28" y1="58" x2="72" y2="58" stroke="var(--ink)" strokeWidth="1.5" />
        <rect x="32" y="48" width="22" height="3" rx="1" fill="var(--ochre)" />
      </svg>
    )
  }
  if (s.includes('cable')) {
    return (
      <svg className="product-card-image-ph" viewBox="0 0 100 100" fill="none">
        <path d="M10 50 Q20 35, 30 50 T50 50 T70 50 T90 50" stroke="var(--ink)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M10 65 Q20 50, 30 65 T50 65 T70 65 T90 65" stroke="var(--ochre)" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    )
  }
  // default — solar panel grid (modules, kits, structure, etc.)
  return (
    <svg className="product-card-image-ph" viewBox="0 0 100 100" fill="none">
      <rect x="14" y="14" width="72" height="72" rx="2" stroke="var(--ink)" strokeWidth="1.5" />
      <line x1="50" y1="14" x2="50" y2="86" stroke="var(--ink)" strokeWidth="1" />
      <line x1="14" y1="50" x2="86" y2="50" stroke="var(--ink)" strokeWidth="1" />
      <line x1="32" y1="14" x2="32" y2="86" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
      <line x1="68" y1="14" x2="68" y2="86" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
      <line x1="14" y1="32" x2="86" y2="32" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
      <line x1="14" y1="68" x2="86" y2="68" stroke="var(--ink)" strokeWidth="0.5" opacity="0.5" />
    </svg>
  )
}

export default function ProductCard({
  product,
  viewMode = 'grid',
}: {
  product: Product
  viewMode?: ViewMode
}) {
  const href = product.slug ? `/shop/${product.slug}` : '#'
  const specChips = getSpecChips(product)
  const dcrTag = getDcrTag(product)
  const catSlug = product.category?.slug ?? ''

  const brandSlug = product.brand?.slug ?? ''
  const logoUrl =
    product.brand?.logo_url ?? BRAND_MAP[brandSlug]?.logoUrl ?? null

  if (viewMode === 'list') {
    return (
      <a href={href} className="product-card">
        <div className="product-card-image">
          {product.primary_image ? (
            <img src={product.primary_image} alt={product.name} loading="lazy" />
          ) : (
            <CategoryPlaceholder slug={catSlug} />
          )}
        </div>
        <div className="product-card-body">
          {product.brand && (
            logoUrl
              ? <img src={logoUrl} alt={product.brand.name} className="product-card-list-brand-logo" loading="lazy" />
              : <span className="product-card-list-brand">{product.brand.name}</span>
          )}
          <p className="product-card-name">{product.name}</p>
          {specChips.length > 0 && (
            <div className="product-card-spec-chips">
              {specChips.map((chip, i) => (
                <span key={i} className="product-card-spec-chip">
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
        <span className="product-card-cta">
          Get Quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
      </a>
    )
  }

  return (
    <a href={href} className="product-card">
      {/* Image with floating brand badge + datasheet */}
      <div className="product-card-image">
        {product.brand && (
          <span className="product-card-brand-badge">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={product.brand.name}
                className="product-card-brand-logo"
                loading="lazy"
              />
            ) : (
              <span className="product-card-brand">{product.brand.name}</span>
            )}
          </span>
        )}
        {product.datasheet_url && (
          <a
            href={product.datasheet_url}
            className="product-card-icon-btn"
            title="Download datasheet"
            onClick={e => e.stopPropagation()}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="12" x2="12" y2="18" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
          </a>
        )}
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} loading="lazy" />
        ) : (
          <CategoryPlaceholder slug={catSlug} />
        )}
      </div>

      {/* Content */}
      <div className="product-card-content">
        {/* Status / tag row */}
        <div className="product-card-status-row">
          <span className="product-card-status">
            <span className="product-card-status-dot" />
            In stock
          </span>
          {dcrTag && (
            <span className={`product-card-dcr-tag ${dcrTag === 'DCR' ? 'dcr' : 'ndcr'}`}>
              {dcrTag}
            </span>
          )}
        </div>

        {/* Name */}
        <p className="product-card-name">{product.name}</p>

        {/* Spec chips */}
        {specChips.length > 0 && (
          <div className="product-card-spec-chips">
            {specChips.map((chip, i) => (
              <span key={i} className="product-card-spec-chip">
                {chip}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <span className="product-card-cta">
          Get Quote
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <polyline points="9 6 15 12 9 18" />
          </svg>
        </span>
      </div>
    </a>
  )
}
