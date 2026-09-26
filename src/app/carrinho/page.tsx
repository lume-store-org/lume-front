'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart, cartTotal } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { brl, imageUrl } from '@/lib/format'
import { EmptyState } from '@/components/EmptyState'
import { OrderSummary } from '@/components/OrderSummary'

export default function CartPage() {
  const ready = useHydrated()
  const { lines, setQuantity, remove } = useCart()
  if (!ready) return null

  if (lines.length === 0)
    return (
      <div className="container-store py-16">
        <EmptyState icon={ShoppingBag} title="Seu carrinho está vazio" text="Escolha alguns produtos e eles aparecem aqui." action={{ href: '/produtos', label: 'Ver produtos' }} />
      </div>
    )

  return (
    <div className="container-store py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card divide-y divide-gray-100">
          {lines.map((l) => (
            <div key={l.id} className="flex gap-4 p-4 sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(l.image)} alt={l.name} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link href={`/produtos/${l.id}`} className="font-medium hover:underline">{l.name}</Link>
                  <p className="font-semibold">{brl(l.price * l.quantity)}</p>
                </div>
                <p className="text-sm text-gray-500">{brl(l.price)} cada</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button onClick={() => setQuantity(l.id, l.quantity - 1)} className="p-2 text-gray-600 hover:text-ink" aria-label="Diminuir"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{l.quantity}</span>
                    <button onClick={() => setQuantity(l.id, l.quantity + 1)} className="p-2 text-gray-600 hover:text-ink" aria-label="Aumentar"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => remove(l.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" /> Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <OrderSummary subtotal={cartTotal(lines)}>
          <Link href="/checkout" className="btn-primary mt-6 w-full py-3 text-base">Fechar pedido</Link>
          <Link href="/produtos" className="btn-ghost mt-2 w-full">Continuar comprando</Link>
        </OrderSummary>
      </div>
    </div>
  )
}
