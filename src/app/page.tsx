'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { api } from '@/lib/api'
import type { Categoria, Item } from '@/lib/types'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'

const FOTO_CATEGORIA: Record<string, string> = {
  Eletrônicos: '/produtos/smartphone.jpg',
  Informática: '/produtos/notebook-ultrafino.jpg',
  Áudio: '/produtos/headphone-anc.jpg',
  Acessórios: '/produtos/smartwatch.jpg',
  Moda: '/produtos/tenis-corrida.jpg',
}

export default function Home() {
  const [destaques, setDestaques] = useState<Item[] | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    api<{ itens: Item[] }>('/itens?destaque=true').then((r) => setDestaques(r.itens)).catch(() => setDestaques([]))
    api<{ categorias: Categoria[] }>('/itens/categorias').then((r) => setCategorias(r.categorias)).catch(() => {})
  }, [])

  return (
    <>
      <section className="bg-gray-100">
        <div className="container-loja grid items-center gap-10 py-12 md:grid-cols-[1fr_1.1fr] md:py-16">
          <div className="max-w-lg">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Coleção 2026</p>
            <h1 className="mt-4 text-4xl font-semibold leading-[1.08] tracking-tight text-ink md:text-[3.4rem]">
              Tecnologia que acompanha o seu ritmo.
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-600">
              Fones, smartphones, notebooks e acessórios selecionados, com estoque atualizado a cada pedido.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-6">
              <Link href="/produtos" className="btn-primary px-7 py-3.5 text-base">
                Comprar agora
              </Link>
              <Link href="/produtos?categoria=%C3%81udio" className="group inline-flex items-center gap-1.5 text-base font-medium text-ink">
                Ver áudio
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          <Link href="/produtos/7" className="group relative block overflow-hidden rounded-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/produtos/fone-over-ear.jpg"
              alt="Fone over-ear Bluetooth"
              className="aspect-[5/4] w-full object-cover transition duration-700 group-hover:scale-[1.02]"
            />
            <div className="absolute bottom-5 left-5 rounded-2xl bg-white/95 px-5 py-3 shadow-sm backdrop-blur">
              <p className="text-sm text-gray-500">Fone over-ear Bluetooth</p>
              <p className="font-semibold text-ink">R$ 449,90 · 40 h de bateria</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="container-loja mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Categorias</h2>
          <Link href="/produtos" className="text-sm font-medium text-gray-600 hover:text-ink">
            Ver todos os produtos
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categorias.map((c) => (
            <Link key={c.nome} href={`/produtos?categoria=${encodeURIComponent(c.nome)}`} className="group">
              <div className="overflow-hidden rounded-2xl bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={FOTO_CATEGORIA[c.nome] ?? '/produtos/placeholder.jpg'}
                  alt=""
                  className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <p className="mt-3 font-medium text-ink">{c.nome}</p>
              <p className="text-sm text-gray-500">{c.total} produtos</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-loja mt-16">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">Mais vendidos</h2>
          <Link href="/produtos" className="text-sm font-medium text-gray-600 hover:text-ink">
            Ver tudo
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {destaques === null
            ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
            : destaques.slice(0, 4).map((item) => <ProductCard key={item.id} item={item} selo={false} />)}
        </div>
      </section>
    </>
  )
}
