import { brl } from '@/lib/format'

export const FREE_SHIPPING_MIN = 299
export const SHIPPING_FEE = 29.9

export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIPPING_MIN || subtotal === 0 ? 0 : SHIPPING_FEE)

export function OrderSummary({ subtotal, children }: { subtotal: number; children?: React.ReactNode }) {
  const shipping = shippingFor(subtotal)
  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-semibold">Resumo</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-gray-500">Subtotal</dt><dd className="font-medium">{brl(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-gray-500">Frete</dt>
          <dd className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-medium'}>{shipping === 0 ? 'Grátis' : brl(shipping)}</dd>
        </div>
        {shipping > 0 && <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">Faltam {brl(FREE_SHIPPING_MIN - subtotal)} para o frete grátis</p>}
        <div className="flex justify-between border-t border-gray-100 pt-3 text-base"><dt className="font-semibold">Total</dt><dd className="font-semibold">{brl(subtotal + shipping)}</dd></div>
      </dl>
      {children}
    </aside>
  )
}
