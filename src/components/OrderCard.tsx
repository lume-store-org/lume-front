import type { Order } from '@/lib/types'
import { brl, dateTime, imageUrl } from '@/lib/format'
import { StatusBadge } from './StatusBadge'

export function OrderCard({ order, actions }: { order: Order; actions?: React.ReactNode }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-gray-100 bg-gray-50/60 px-5 py-4 text-sm">
        <p className="font-semibold">Pedido #{order.id}</p>
        <p className="text-gray-500">{dateTime(order.created_at)}</p>
        <StatusBadge status={order.status} />
        <p className="ml-auto font-semibold">{brl(order.total)}</p>
      </div>
      <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-wrap gap-3">
          {order.items.map((i) => (
            <div key={i.product_id} className="flex items-center gap-3 rounded-xl bg-gray-50 py-2 pl-2 pr-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(i.image)} alt="" className="h-12 w-12 rounded-lg object-cover" />
              <div className="text-sm">
                <p className="font-medium">{i.name}</p>
                <p className="text-gray-500">{i.quantity}× {brl(i.unit_price)}</p>
              </div>
            </div>
          ))}
        </div>
        {actions}
      </div>
      {order.shipping_address && <p className="border-t border-gray-100 px-5 py-3 text-xs text-gray-500">Entrega: {order.shipping_address}</p>}
    </div>
  )
}
