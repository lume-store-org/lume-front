'use client'

import { create } from 'zustand'
import { CheckCircle2, XCircle } from 'lucide-react'

interface Aviso {
  id: number
  texto: string
  tipo: 'ok' | 'erro'
}

const useAvisos = create<{ avisos: Aviso[] }>(() => ({ avisos: [] }))

export function avisar(texto: string, tipo: Aviso['tipo'] = 'ok') {
  const id = Date.now() + Math.random()
  useAvisos.setState((s) => ({ avisos: [...s.avisos, { id, texto, tipo }] }))
  setTimeout(() => useAvisos.setState((s) => ({ avisos: s.avisos.filter((a) => a.id !== id) })), 3200)
}

export function Toaster() {
  const avisos = useAvisos((s) => s.avisos)
  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      {avisos.map((a) => (
        <div
          key={a.id}
          className="pointer-events-auto flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-sm font-medium text-white shadow-lg"
        >
          {a.tipo === 'ok' ? <CheckCircle2 className="h-5 w-5 text-emerald-400" /> : <XCircle className="h-5 w-5 text-rose-400" />}
          {a.texto}
        </div>
      ))}
    </div>
  )
}
