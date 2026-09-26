import { Sparkles } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-loja flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row">
        <p className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-brand-600" />
          <span>
            <span className="font-semibold text-ink">Lume Store</span> · tecnologia e estilo num só lugar
          </span>
        </p>
        <p>© {new Date().getFullYear()} Lume Store</p>
      </div>
    </footer>
  )
}
