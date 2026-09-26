'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Product } from '@/lib/types'
import { brl, imageUrl, installments } from '@/lib/format'
import { useCart } from '@/lib/store'
import { notify } from './Toaster'

export function ProductCard({ product, badge = true }: { product: Product; badge?: boolean }) {
  const add = useCart((s) => s.add)
  const soldOut = product.stock <= 0

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <Link href={`/produtos/${product.id}`} className="block aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(product.image)} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        </Link>
        {badge && product.featured && !soldOut && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">Mais vendido</span>
        )}
        {soldOut ? (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 py-2 text-center text-sm font-medium text-gray-600">Esgotado</span>
        ) : (
          <button
            onClick={() => {
              add(product)
              notify(`${product.name} adicionado ao carrinho`)
            }}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-ink hover:text-white"
            title="Adicionar ao carrinho"
            aria-label={`Adicionar ${product.name} ao carrinho`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-gray-500">{product.category}</p>
        <Link href={`/produtos/${product.id}`} className="mt-0.5 line-clamp-2 font-medium leading-snug text-ink hover:underline">
          {product.name}
        </Link>
        <p className="mt-2 font-semibold text-ink">{brl(product.price)}</p>
        <p className="text-xs text-gray-500">{installments(product.price)}</p>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div>
      <div className="aspect-square animate-pulse rounded-2xl bg-gray-200" />
      <div className="mt-3 space-y-2">
        <div className="h-3 w-16 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
      </div>
    </div>
  )
}
