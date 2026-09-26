import { Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white">
      <div className="container-loja flex flex-col items-center justify-between gap-3 py-8 text-sm text-slate-500 sm:flex-row">
        <p>
          <span className="font-semibold text-ink">LabStore</span> · loja de demonstração com microserviços (Flask + MySQL +
          Next.js)
        </p>
        <a
          href="https://github.com/studies-org/studies-lab-ecommerce-microservices"
          className="flex items-center gap-2 hover:text-ink"
          target="_blank"
          rel="noreferrer"
        >
          <Github className="h-4 w-4" /> Código no GitHub
        </a>
      </div>
    </footer>
  )
}
