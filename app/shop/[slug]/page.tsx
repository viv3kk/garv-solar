import { notFound } from 'next/navigation'
import { createClient } from '../../../lib/supabase/server'
import { Nav, Footer, Eyebrow } from '../../_shared'
import SpecTable from '../../components/spec-table'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('products')
    .select('name, description, brand:brands(name)')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!data) return {}

  const brand = Array.isArray(data.brand) ? data.brand[0] : data.brand
  return {
    title: `${data.name}${brand ? ` — ${brand.name}` : ''} | Garv Urja`,
    description: data.description ?? undefined,
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(
      `id, name, slug, description, specs, primary_image, datasheet_url,
       brand:brands(id, name, slug, logo_url, website),
       category:categories(id, name, slug, parent_id)`,
    )
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (!product) notFound()

  const { data: images } = await supabase
    .from('product_images')
    .select('id, url, sort_order')
    .eq('product_id', product.id)
    .order('sort_order')
    .limit(10)

  const brand = Array.isArray(product.brand) ? product.brand[0] : product.brand
  const category = Array.isArray(product.category)
    ? product.category[0]
    : product.category
  const specs = (product.specs ?? {}) as Record<string, unknown>

  return (
    <>
      <Nav />
      <main>
        <section className="section-pad">
          <div className="container-site">
            {/* Breadcrumb */}
            <nav className="shop-breadcrumb" aria-label="Breadcrumb">
              <a href="/shop">Shop</a>
              {category && (
                <>
                  <span className="shop-breadcrumb-sep">/</span>
                  <a href={`/shop?category=${category.slug}`}>{category.name}</a>
                </>
              )}
              <span className="shop-breadcrumb-sep">/</span>
              <span>{product.name}</span>
            </nav>

            {/* Main layout */}
            <div className="product-detail-layout">
              {/* Image column */}
              <div>
                <div className="product-detail-image-wrap">
                  {product.primary_image ? (
                    <img
                      src={product.primary_image}
                      alt={product.name}
                      className="product-detail-image"
                    />
                  ) : (
                    <div className="product-detail-image-ph" />
                  )}
                </div>

                {images && images.length > 0 && (
                  <div className="product-detail-thumbnails">
                    {images.map(img => (
                      <img
                        key={img.id}
                        src={img.url}
                        alt=""
                        className="product-detail-thumb"
                        loading="lazy"
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Info column */}
              <div>
                {brand && <Eyebrow>{brand.name}</Eyebrow>}
                <h1
                  className="h-section"
                  style={{ margin: 'var(--space-xs) 0 var(--space-sm)' }}
                >
                  {product.name}
                </h1>

                {category && (
                  <p
                    style={{
                      fontSize: '0.85rem',
                      color: 'var(--ink-mute)',
                      marginBottom: 'var(--space-sm)',
                    }}
                  >
                    {category.name}
                  </p>
                )}

                {product.description && (
                  <p
                    className="lede"
                    style={{ marginBottom: 'var(--space-md)' }}
                  >
                    {product.description}
                  </p>
                )}

                <div className="product-detail-actions">
                  <a href="/contact" className="btn-primary">
                    Get Quote
                  </a>
                  {product.datasheet_url && (
                    <a
                      href={product.datasheet_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-ghost"
                    >
                      Datasheet PDF
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Specs */}
            {Object.keys(specs).length > 0 && (
              <div style={{ marginTop: 'var(--space-xl)', maxWidth: '640px' }}>
                <h2
                  className="h-card spec-section-heading"
                >
                  Specifications
                </h2>
                <SpecTable specs={specs} />
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
