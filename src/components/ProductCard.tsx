'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import type { Item } from '@/lib/types'
import { brl, imagem, parcelas } from '@/lib/format'
import { useCart } from '@/lib/store'
import { avisar } from './Toaster'

export function ProductCard({ item, selo = true }: { item: Item; selo?: boolean }) {
  const adicionar = useCart((s) => s.adicionar)
  const esgotado = item.estoque <= 0

  return (
    <div className="group flex flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-gray-100">
        <Link href={`/produtos/${item.id}`} className="block aspect-square">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imagem(item.imagem)}
            alt={item.nome}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        {selo && item.destaque && !esgotado && (
          <span className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-ink">
            Mais vendido
          </span>
        )}
        {esgotado ? (
          <span className="absolute inset-x-3 bottom-3 rounded-lg bg-white/95 py-2 text-center text-sm font-medium text-gray-600">
            Esgotado
          </span>
        ) : (
          <button
            onClick={() => {
              adicionar(item)
              avisar(`${item.nome} adicionado ao carrinho`)
            }}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-sm transition hover:bg-ink hover:text-white"
            title="Adicionar ao carrinho"
            aria-label={`Adicionar ${item.nome} ao carrinho`}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
          </button>
        )}
      </div>
      <div className="mt-3 flex flex-1 flex-col">
        <p className="text-xs text-gray-500">{item.categoria}</p>
        <Link href={`/produtos/${item.id}`} className="mt-0.5 line-clamp-2 font-medium leading-snug text-ink hover:underline">
          {item.nome}
        </Link>
        <p className="mt-2 font-semibold text-ink">{brl(item.preco)}</p>
        <p className="text-xs text-gray-500">{parcelas(item.preco)}</p>
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
