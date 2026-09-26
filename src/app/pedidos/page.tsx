'use client'

import { useEffect, useState } from 'react'
import { Package } from 'lucide-react'
import { api, enviar } from '@/lib/api'
import type { Pedido } from '@/lib/types'
import { RequireAuth } from '@/components/RequireAuth'
import { PedidoCard } from '@/components/PedidoCard'
import { Empty } from '@/components/Empty'
import { avisar } from '@/components/Toaster'

function MeusPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[] | null>(null)
  const carregar = () => api<{ pedidos: Pedido[] }>('/pedidos').then((r) => setPedidos(r.pedidos)).catch(() => setPedidos([]))
  useEffect(() => {
    carregar()
  }, [])

  const cancelar = async (id: number) => {
    try {
      await api(`/pedidos/${id}`, enviar('DELETE'))
      avisar(`Pedido #${id} cancelado`)
      carregar()
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  return (
    <div className="container-loja max-w-4xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Meus pedidos</h1>
      <div className="mt-8 space-y-4">
        {pedidos === null && <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />}
        {pedidos?.length === 0 && <Empty icon={Package} titulo="Nenhum pedido ainda" texto="Quando você comprar algo, ele aparece aqui." acao={{ href: '/produtos', label: 'Ver produtos' }} />}
        {pedidos?.map((p) => (
          <PedidoCard
            key={p.id}
            pedido={p}
            acoes={
              ['pendente', 'pago'].includes(p.status) && (
                <button onClick={() => cancelar(p.id)} className="btn-outline shrink-0 text-rose-600 hover:border-rose-300 hover:bg-rose-50">
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
      <MeusPedidos />
    </RequireAuth>
  )
}
