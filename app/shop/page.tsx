import { createClient } from '../../lib/supabase/server'
import { Footer } from '../_shared'
import ShopClient from './shop-client'
import type { Product } from '../../types/product'

export const metadata = {
  title: 'Shop Solar Equipment — Garv Urja',
  description:
    'Browse solar panels, inverters, batteries, cables and more from top brands. Get a quote from Garv Urja.',
}

export default async function ShopPage() {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }, { data: brands }] =
    await Promise.all([
      supabase
        .from('products')
        .select(
          'id, name, slug, specs, primary_image, brand:brands(id, name, slug, logo_url), category:categories(id, name, slug, parent_id)',
        )
        .eq('is_active', true)
        .order('name'),
      supabase
        .from('categories')
        .select('id, name, slug')
        .is('parent_id', null)
        .order('name')
        .limit(20),
      supabase
        .from('brands')
        .select('id, name, slug')
        .eq('is_active', true)
        .order('name')
        .limit(100),
    ])

  return (
    <>
      <main>
        <ShopClient
          products={(products ?? []) as unknown as Product[]}
          categories={categories ?? []}
          brands={brands ?? []}
        />
      </main>
      <Footer />
    </>
  )
}
