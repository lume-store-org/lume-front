import { brl } from '@/lib/format'

export const FRETE_GRATIS = 299
export const FRETE = 29.9

export function Resumo({ subtotal, frete, children }: { subtotal: number; frete: number; children?: React.ReactNode }) {
  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-24">
      <h2 className="text-lg font-bold">Resumo</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex justify-between"><dt className="text-slate-500">Subtotal</dt><dd className="font-medium">{brl(subtotal)}</dd></div>
        <div className="flex justify-between">
          <dt className="text-slate-500">Frete</dt>
          <dd className={frete === 0 ? 'font-semibold text-emerald-600' : 'font-medium'}>{frete === 0 ? 'Grátis' : brl(frete)}</dd>
        </div>
        {frete > 0 && <p className="rounded-lg bg-brand-50 px-3 py-2 text-xs text-brand-700">Faltam {brl(FRETE_GRATIS - subtotal)} para o frete grátis</p>}
        <div className="flex justify-between border-t border-slate-100 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold">{brl(subtotal + frete)}</dd></div>
      </dl>
      {children}
    </aside>
  )
}
