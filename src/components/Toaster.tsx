'use client'

import { create } from 'zustand'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Toast {
  id: number
  text: string
  kind: 'ok' | 'error'
}

const useToasts = create<{ toasts: Toast[] }>(() => ({ toasts: [] }))

export function notify(text: string, kind: Toast['kind'] = 'ok') {
  const id = Date.now() + Math.random()
  useToasts.setState((s) => ({ toasts: [...s.toasts, { id, text, kind }] }))
  setTimeout(() => useToasts.setState((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3200)
}

export function Toaster() {
  const toasts = useToasts((s) => s.toasts)
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="pointer-events-auto flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg">
          {t.kind === 'ok' ? <CheckCircle2 className="h-5 w-5 text-brand-500" /> : <XCircle className="h-5 w-5 text-rose-400" />}
          {t.text}
        </div>
      ))}
    </div>
  )
}
