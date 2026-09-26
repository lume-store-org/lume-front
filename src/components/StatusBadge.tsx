import type { StatusPedido } from '@/lib/types'

const ESTILO: Record<StatusPedido, string> = {
  pendente: 'bg-amber-50 text-amber-700 ring-amber-200',
  pago: 'bg-sky-50 text-sky-700 ring-sky-200',
  enviado: 'bg-violet-50 text-violet-700 ring-violet-200',
  entregue: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  cancelado: 'bg-slate-100 text-slate-500 ring-slate-200',
}

export function StatusBadge({ status }: { status: StatusPedido }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${ESTILO[status]}`}>
      {status}
    </span>
  )
}
