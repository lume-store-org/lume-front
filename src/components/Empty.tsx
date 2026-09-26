import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

export function Empty({ icon: Icon, titulo, texto, acao }: { icon: LucideIcon; titulo: string; texto: string; acao?: { href: string; label: string } }) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-bold">{titulo}</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{texto}</p>
      {acao && (
        <Link href={acao.href} className="btn-primary mt-6">
          {acao.label}
        </Link>
      )}
    </div>
  )
}
