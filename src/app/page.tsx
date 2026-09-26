'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight, Headphones, Laptop, RotateCcw, ShieldCheck, Shirt, Smartphone, Truck, Watch } from 'lucide-react'
import { api } from '@/lib/api'
import type { Categoria, Item } from '@/lib/types'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'

const ICONES: Record<string, typeof Laptop> = {
  Eletrônicos: Smartphone,
  Informática: Laptop,
  Áudio: Headphones,
  Acessórios: Watch,
  Moda: Shirt,
}

const VANTAGENS = [
  { icon: Truck, titulo: 'Frete grátis', texto: 'Em compras acima de R$ 299' },
  { icon: ShieldCheck, titulo: 'Compra segura', texto: 'Sessão protegida por token' },
  { icon: RotateCcw, titulo: 'Cancelamento fácil', texto: 'O estoque volta na hora' },
]

export default function Home() {
  const [destaques, setDestaques] = useState<Item[] | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    api<{ itens: Item[] }>('/itens?destaque=true').then((r) => setDestaques(r.itens)).catch(() => setDestaques([]))
    api<{ categorias: Categoria[] }>('/itens/categorias').then((r) => setCategorias(r.categorias)).catch(() => {})
  }, [])

  return (
    <>
      <section className="relative overflow-hidden bg-ink text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(59,108,246,.45),transparent_55%)]" />
        <div className="container-loja relative grid items-center gap-10 py-16 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-brand-100 ring-1 ring-white/20">
              Novidades da semana
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
              Tecnologia e estilo <span className="text-brand-500">num só lugar</span>
            </h1>
            <p className="mt-4 max-w-md text-lg text-slate-300">
              Smartphones, notebooks, áudio e acessórios com estoque em tempo real e entrega para todo o Brasil.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/produtos" className="btn-primary px-6 py-3 text-base">
                Ver produtos <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/cadastro" className="btn px-6 py-3 text-base text-white ring-1 ring-white/30 hover:bg-white/10">
                Criar conta
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="grid grid-cols-2 gap-4">
              {['/produtos/smartphone.jpg', '/produtos/fone-over-ear.jpg', '/produtos/smartwatch.jpg', '/produtos/tenis-corrida.jpg'].map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  className={`aspect-square w-full rounded-3xl object-cover shadow-2xl ring-1 ring-white/10 ${i % 2 ? 'translate-y-8' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-loja -mt-8 relative z-10">
        <div className="card grid divide-y divide-slate-100 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {VANTAGENS.map(({ icon: Icon, titulo, texto }) => (
            <div key={titulo} className="flex items-center gap-4 p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold">{titulo}</p>
                <p className="text-sm text-slate-500">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container-loja mt-14">
        <h2 className="text-2xl font-bold tracking-tight">Compre por categoria</h2>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c) => {
            const Icon = ICONES[c.nome] ?? Laptop
            return (
              <Link
                key={c.nome}
                href={`/produtos?categoria=${encodeURIComponent(c.nome)}`}
                className="card group flex flex-col items-center gap-3 px-4 py-6 transition hover:border-brand-200 hover:shadow-lg"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition group-hover:bg-brand-600 group-hover:text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-semibold">{c.nome}</span>
                <span className="text-xs text-slate-500">{c.total} produtos</span>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="container-loja mt-14">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Destaques</h2>
          <Link href="/produtos" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
            Ver tudo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {destaques === null
            ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : destaques.map((item) => <ProductCard key={item.id} item={item} />)}
        </div>
      </section>
    </>
  )
}
