'use client'

import Link from 'next/link'
import { Plus } from 'lucide-react'
import type { Item } from '@/lib/types'
import { brl, imagem, parcelas } from '@/lib/format'
import { useCart } from '@/lib/store'
import { avisar } from './Toaster'

export function ProductCard({ item }: { item: Item }) {
  const adicionar = useCart((s) => s.adicionar)
  const esgotado = item.estoque <= 0

  return (
    <div className="group card flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg">
      <Link href={`/produtos/${item.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imagem(item.imagem)}
          alt={item.nome}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {item.destaque && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-brand-700 shadow-sm">
            Destaque
          </span>
        )}
        {esgotado && (
          <span className="absolute inset-0 flex items-center justify-center bg-white/70 text-sm font-bold text-slate-700">
            Esgotado
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{item.categoria}</p>
        <Link href={`/produtos/${item.id}`} className="mt-1 line-clamp-2 font-semibold leading-snug hover:text-brand-600">
          {item.nome}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <div>
            <p className="text-lg font-bold">{brl(item.preco)}</p>
            <p className="text-xs text-slate-500">{parcelas(item.preco)}</p>
          </div>
          <button
            disabled={esgotado}
            onClick={() => {
              adicionar(item)
              avisar(`${item.nome} no carrinho`)
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition hover:bg-brand-700 disabled:bg-slate-300"
            title="Adicionar ao carrinho"
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="card overflow-hidden">
      <div className="aspect-square animate-pulse bg-slate-200" />
      <div className="space-y-2 p-4">
        <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
        <div className="h-5 w-24 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  )
}
