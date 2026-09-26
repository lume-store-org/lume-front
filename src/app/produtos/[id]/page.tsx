'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, Minus, PackageX, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { api } from '@/lib/api'
import type { Item } from '@/lib/types'
import { brl, imagem, parcelas } from '@/lib/format'
import { useCart } from '@/lib/store'
import { avisar } from '@/components/Toaster'
import { Empty } from '@/components/Empty'

export default function Produto() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const adicionar = useCart((s) => s.adicionar)
  const [item, setItem] = useState<Item | null | undefined>(undefined)
  const [qtd, setQtd] = useState(1)

  useEffect(() => {
    api<Item>(`/itens/${id}`).then(setItem).catch(() => setItem(null))
  }, [id])

  if (item === null)
    return (
      <div className="container-loja py-16">
        <Empty icon={PackageX} titulo="Produto não encontrado" texto="Ele pode ter saído do catálogo." acao={{ href: '/produtos', label: 'Ver produtos' }} />
      </div>
    )
  if (!item) return <div className="container-loja py-16"><div className="h-96 animate-pulse rounded-3xl bg-slate-200" /></div>

  const esgotado = item.estoque <= 0
  const comprar = (irParaCarrinho: boolean) => {
    adicionar(item, qtd)
    if (irParaCarrinho) router.push('/carrinho')
    else avisar(`${qtd}× ${item.nome} no carrinho`)
  }

  return (
    <div className="container-loja py-10">
      <Link href="/produtos" className="inline-flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagem(item.imagem)} alt={item.nome} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <Link href={`/produtos?categoria=${encodeURIComponent(item.categoria || '')}`} className="text-sm font-semibold uppercase tracking-wide text-brand-600">
            {item.categoria}
          </Link>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{item.nome}</h1>
          <p className="mt-4 text-lg leading-relaxed text-slate-600">{item.descricao}</p>

          <div className="mt-8">
            <p className="text-4xl font-extrabold">{brl(item.preco)}</p>
            <p className="mt-1 text-slate-500">{parcelas(item.preco)}</p>
          </div>

          <p className={`mt-4 text-sm font-medium ${esgotado ? 'text-rose-600' : item.estoque <= 10 ? 'text-amber-600' : 'text-emerald-600'}`}>
            {esgotado ? 'Esgotado' : item.estoque <= 10 ? `Últimas ${item.estoque} unidades` : `${item.estoque} em estoque`}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-slate-300 bg-white">
              <button onClick={() => setQtd((q) => Math.max(1, q - 1))} className="p-3 text-slate-600 hover:text-ink" disabled={esgotado}>
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{qtd}</span>
              <button onClick={() => setQtd((q) => Math.min(item.estoque, q + 1))} className="p-3 text-slate-600 hover:text-ink" disabled={esgotado}>
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => comprar(true)} disabled={esgotado} className="btn-primary flex-1 py-3 text-base">
              Comprar agora
            </button>
            <button onClick={() => comprar(false)} disabled={esgotado} className="btn-outline py-3" title="Adicionar ao carrinho">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 space-y-3 rounded-2xl bg-slate-100 p-5 text-sm text-slate-600">
            <p className="flex items-center gap-3"><Truck className="h-5 w-5 text-brand-600" /> Frete grátis em compras acima de R$ 299</p>
            <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-brand-600" /> O preço é confirmado pelo servidor no fechamento do pedido</p>
          </div>
        </div>
      </div>
    </div>
  )
}
