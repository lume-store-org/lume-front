import { Sparkles } from 'lucide-react'

export function AuthCard({ titulo, subtitulo, children }: { titulo: string; subtitulo: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="container-loja flex justify-center py-16">
      <div className="card w-full max-w-md p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 text-white"><Sparkles className="h-6 w-6" /></span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{titulo}</h1>
        <p className="mt-1 text-sm text-slate-500">{subtitulo}</p>
        {children}
      </div>
    </div>
  )
}
