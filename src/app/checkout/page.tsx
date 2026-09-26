'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, MapPin } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { Order, User } from '@/lib/types'
import { useCart, cartTotal } from '@/lib/store'
import { brl, imageUrl } from '@/lib/format'
import { RequireAuth } from '@/components/RequireAuth'
import { OrderSummary } from '@/components/OrderSummary'

function Checkout() {
  const router = useRouter()
  const { lines, clear } = useCart()
  const [address, setAddress] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    api<User>('/users/me').then((u) => setAddress(u.address || '')).catch(() => {})
  }, [])

  useEffect(() => {
    if (lines.length === 0 && !order) router.replace('/carrinho')
  }, [lines.length, order, router])

  if (order)
    return (
      <div className="container-store max-w-2xl py-16">
        <div className="card p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-semibold">Pedido #{order.id} confirmado!</h1>
          <p className="mt-2 text-gray-500">Total de {brl(order.total)}. Os produtos já estão reservados para você.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/pedidos" className="btn-primary">Ver meus pedidos</Link>
            <Link href="/produtos" className="btn-outline">Continuar comprando</Link>
          </div>
        </div>
      </div>
    )

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const created = await api<Order>(
        '/orders',
        send('POST', { items: lines.map((l) => ({ product_id: l.id, quantity: l.quantity })), shipping_address: address }),
      )
      setOrder(created)
      clear()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="container-store py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Fechar pedido</h1>
      <form onSubmit={placeOrder} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><MapPin className="h-5 w-5" /> Endereço de entrega</h2>
            <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Rua, número, bairro, cidade/UF" className="input mt-4" />
          </section>
          <section className="card divide-y divide-gray-100">
            {lines.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imageUrl(l.image)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <p className="flex-1 text-sm font-medium">{l.quantity}× {l.name}</p>
                <p className="text-sm font-semibold">{brl(l.price * l.quantity)}</p>
              </div>
            ))}
          </section>
        </div>
        <OrderSummary subtotal={cartTotal(lines)}>
          {error && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
          <button disabled={sending} className="btn-primary mt-6 w-full py-3 text-base">
            {sending ? <><Loader2 className="h-5 w-5 animate-spin" /> Confirmando…</> : 'Confirmar pedido'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">Os preços são confirmados no fechamento do pedido.</p>
        </OrderSummary>
      </form>
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  )
}
