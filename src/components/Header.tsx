'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, LogOut, Package, Search, ShoppingBag, Store, User } from 'lucide-react'
import { useAuth, useCart, qtdCarrinho } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { api, enviar } from '@/lib/api'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const pronto = useHydrated()
  const { usuario, sair } = useAuth()
  const qtd = useCart((s) => qtdCarrinho(s.linhas))
  const [busca, setBusca] = useState('')

  const buscar = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/produtos${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`)
  }

  const encerrar = async () => {
    await api('/auth/logout', enviar('POST')).catch(() => {})
    sair()
    router.push('/')
  }

  const link = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${pathname.startsWith(href) ? 'text-brand-600' : 'text-slate-600 hover:text-ink'}`

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="container-loja flex h-16 items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Store className="h-5 w-5" />
          </span>
          <span>
            Lab<span className="text-brand-600">Store</span>
          </span>
        </Link>

        <nav className="hidden items-center md:flex">
          <Link href="/produtos" className={link('/produtos')}>Produtos</Link>
          {pronto && usuario && <Link href="/pedidos" className={link('/pedidos')}>Meus pedidos</Link>}
          {pronto && usuario?.is_admin && <Link href="/admin" className={link('/admin')}>Painel</Link>}
        </nav>

        <form onSubmit={buscar} className="relative ml-auto hidden max-w-sm flex-1 lg:block">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar produtos"
            className="input rounded-full bg-slate-50 py-2 pl-10"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {pronto && usuario ? (
            <>
              <Link href="/conta" className="btn-ghost px-3" title="Minha conta">
                <User className="h-5 w-5" />
                <span className="hidden sm:inline">{usuario.nome.split(' ')[0]}</span>
              </Link>
              {usuario.is_admin && (
                <Link href="/admin" className="btn-ghost px-3 md:hidden" title="Painel">
                  <LayoutDashboard className="h-5 w-5" />
                </Link>
              )}
              <Link href="/pedidos" className="btn-ghost px-3 md:hidden" title="Meus pedidos">
                <Package className="h-5 w-5" />
              </Link>
              <button onClick={encerrar} className="btn-ghost px-3" title="Sair">
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link href="/login" className="btn-ghost px-3">
              <User className="h-5 w-5" /> Entrar
            </Link>
          )}
          <Link href="/carrinho" className="btn-ghost relative px-3" title="Carrinho">
            <ShoppingBag className="h-5 w-5" />
            {pronto && qtd > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
                {qtd}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
