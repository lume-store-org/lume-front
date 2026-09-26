'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LayoutDashboard, LogOut, Package, Search, ShoppingBag, User } from 'lucide-react'
import { useAuth, useCart, cartCount } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { api, send } from '@/lib/api'

export function Header() {
  const router = useRouter()
  const pathname = usePathname()
  const ready = useHydrated()
  const { user, signOut } = useAuth()
  const count = useCart((s) => cartCount(s.lines))
  const [query, setQuery] = useState('')

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    router.push(`/produtos${query ? `?busca=${encodeURIComponent(query)}` : ''}`)
  }

  const logout = async () => {
    await api('/auth/logout', send('POST')).catch(() => {})
    signOut()
    router.push('/')
  }

  const navLink = (href: string) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      pathname.startsWith(href) ? 'text-ink underline decoration-brand-500 decoration-2 underline-offset-8' : 'text-gray-600 hover:text-ink'
    }`

  return (
    <>
      <div className="bg-ink text-xs text-gray-300">
        <div className="container-store flex h-9 items-center justify-center gap-6 sm:justify-between">
          <p>Frete grátis nas compras acima de R$ 299</p>
          <p className="hidden sm:block">Parcele em até 10x sem juros · Troca grátis em 30 dias</p>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="container-store flex h-16 items-center gap-6">
          <Link href="/" className="shrink-0" aria-label="Lume Store, página inicial">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/marca/logo.svg" alt="Lume Store" className="h-8 w-auto" />
          </Link>

          <nav className="hidden items-center md:flex">
            <Link href="/produtos" className={navLink('/produtos')}>Produtos</Link>
            {ready && user && <Link href="/pedidos" className={navLink('/pedidos')}>Meus pedidos</Link>}
            {ready && user?.is_admin && <Link href="/admin" className={navLink('/admin')}>Painel</Link>}
          </nav>

          <form onSubmit={search} className="relative ml-auto hidden max-w-sm flex-1 lg:block">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar produtos" className="input rounded-full bg-gray-50 py-2 pl-10" />
          </form>

          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            {ready && user ? (
              <>
                <Link href="/conta" className="btn-ghost px-3" title="Minha conta">
                  <User className="h-5 w-5" />
                  <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                </Link>
                {user.is_admin && (
                  <Link href="/admin" className="btn-ghost px-3 md:hidden" title="Painel">
                    <LayoutDashboard className="h-5 w-5" />
                  </Link>
                )}
                <Link href="/pedidos" className="btn-ghost px-3 md:hidden" title="Meus pedidos">
                  <Package className="h-5 w-5" />
                </Link>
                <button onClick={logout} className="btn-ghost px-3" title="Sair">
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
              {ready && count > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-ink">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
