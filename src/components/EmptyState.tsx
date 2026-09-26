import Link from 'next/link'
import type { LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  text: string
  action?: { href: string; label: string }
}

export function EmptyState({ icon: Icon, title, text, action }: Props) {
  return (
    <div className="card flex flex-col items-center px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-ink">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="mt-4 text-lg font-semibold">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{text}</p>
      {action && (
        <Link href={action.href} className="btn-primary mt-6">
          {action.label}
        </Link>
      )}
    </div>
  )
}
