export type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string | null
  website: string | null
}

export type Category = {
  id: string
  name: string
  slug: string
  parent_id: string | null
}

export type Product = {
  id: string
  sku: string | null
  name: string
  slug: string | null
  brand: Brand | null
  category: Category | null
  description: string | null
  specs: Record<string, unknown>
  primary_image: string | null
  datasheet_url: string | null
  is_active: boolean
}

export type ProductImage = {
  id: string
  url: string
  sort_order: number
  source: string
}
