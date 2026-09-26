'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PackageSearch, Search } from 'lucide-react'
import { api } from '@/lib/api'
import type { Category, Product } from '@/lib/types'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { EmptyState } from '@/components/EmptyState'

const SORTS = {
  relevance: { label: 'Relevância', fn: () => 0 },
  lowest: { label: 'Menor preço', fn: (a: Product, b: Product) => a.price - b.price },
  highest: { label: 'Maior preço', fn: (a: Product, b: Product) => b.price - a.price },
} as const

function Catalog() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const category = params.get('categoria') || ''
  const search = params.get('busca') || ''
  const [text, setText] = useState(search)
  const [sort, setSort] = useState<keyof typeof SORTS>('relevance')
  const [products, setProducts] = useState<Product[] | null>(null)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    api<{ categories: Category[] }>('/products/categories').then((r) => setCategories(r.categories)).catch(() => {})
  }, [])

  useEffect(() => {
    setProducts(null)
    setText(search)
    const q = new URLSearchParams()
    if (category) q.set('category', category)
    if (search) q.set('search', search)
    api<{ products: Product[] }>(`/products?${q}`).then((r) => setProducts(r.products)).catch(() => setProducts([]))
  }, [category, search])

  // The page URL keeps Portuguese params (?categoria=, ?busca=)
  const navigate = (changes: Record<string, string>) => {
    const q = new URLSearchParams(params.toString())
    Object.entries(changes).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)))
    router.push(`${pathname}?${q}`)
  }

  const list = products ? [...products].sort(SORTS[sort].fn) : null

  return (
    <div className="container-store py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{category || 'Todos os produtos'}</h1>
          <p className="mt-1 text-gray-500">
            {list ? `${list.length} produto${list.length === 1 ? '' : 's'}` : 'Carregando…'}
            {search && <> para “{search}”</>}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            navigate({ busca: text })
          }}
          className="relative w-full sm:w-80"
        >
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Buscar no catálogo" className="input pl-10" />
        </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {[{ name: '', total: 0 }, ...categories].map((c) => (
          <button
            key={c.name || 'all'}
            onClick={() => navigate({ categoria: c.name })}
            className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
              category === c.name ? 'bg-ink text-white ring-ink' : 'bg-white text-gray-600 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {c.name || 'Todas'}
          </button>
        ))}
        <select value={sort} onChange={(e) => setSort(e.target.value as keyof typeof SORTS)} className="input ml-auto w-auto rounded-full py-2">
          {Object.entries(SORTS).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {list && list.length === 0 ? (
          <EmptyState icon={PackageSearch} title="Nenhum produto encontrado" text="Tente outra busca ou escolha outra categoria." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {list ? list.map((p) => <ProductCard key={p.id} product={p} />) : Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Catalog />
    </Suspense>
  )
}
