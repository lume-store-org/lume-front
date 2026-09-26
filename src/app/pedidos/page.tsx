'use client'

import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { Order } from '@/lib/types'
import { RequireAuth } from '@/components/RequireAuth'
import { OrderCard } from '@/components/OrderCard'
import { EmptyState } from '@/components/EmptyState'
import { notify } from '@/components/Toaster'

function MyOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const load = () => api<{ orders: Order[] }>('/orders').then((r) => setOrders(r.orders)).catch(() => setOrders([]))
  useEffect(() => {
    load()
  }, [])

  const cancel = async (id: number) => {
    try {
      await api(`/orders/${id}`, send('DELETE'))
      notify(`Pedido #${id} cancelado`)
      load()
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  return (
    <div className="container-store max-w-4xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Meus pedidos</h1>
      <div className="mt-8 space-y-4">
        {orders === null && <div className="h-40 animate-pulse rounded-2xl bg-gray-200" />}
        {orders?.length === 0 && <EmptyState icon={Package} title="Nenhum pedido ainda" text="Quando você comprar algo, ele aparece aqui." action={{ href: '/produtos', label: 'Ver produtos' }} />}
        {orders?.map((o) => (
          <OrderCard
            key={o.id}
            order={o}
            actions={
              ['pending', 'paid'].includes(o.status) && (
                <button onClick={() => cancel(o.id)} className="btn-outline shrink-0 text-rose-600 hover:border-rose-300 hover:bg-rose-50">
                  Cancelar pedido
                </button>
              )
            }
          />
        ))}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <MyOrders />
    </RequireAuth>
  )
}
