import type { Pedido } from '@/lib/types'
import { brl, dataHora, imagem } from '@/lib/format'
import { StatusBadge } from './StatusBadge'

export function PedidoCard({ pedido, acoes }: { pedido: Pedido; acoes?: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-slate-100 bg-slate-50/60 px-5 py-4 text-sm">
        <p className="font-bold">Pedido #{pedido.id}</p>
        <p className="text-slate-500">{dataHora(pedido.data)}</p>
        <StatusBadge status={pedido.status} />
        <p className="ml-auto font-bold">{brl(pedido.valor_total)}</p>
      </div>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-3">
          {pedido.itens.map((i) => (
            <div key={i.item_id} className="flex items-center gap-3 rounded-xl bg-slate-50 py-2 pl-2 pr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem(i.imagem)} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="text-sm">
                <p className="font-medium">{i.nome}</p>
                <p className="text-slate-500">{i.quantidade}× {brl(i.preco_unitario)}</p>
              </div>
            </div>
          ))}
        </div>
        {acoes}
      </div>
      {pedido.endereco_entrega && <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">Entrega: {pedido.endereco_entrega}</p>}
    </div>
  )
}
