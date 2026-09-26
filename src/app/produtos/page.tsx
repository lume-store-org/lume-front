'use client'

import { Suspense, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { PackageSearch, Search } from 'lucide-react'
import { api } from '@/lib/api'
import type { Categoria, Item } from '@/lib/types'
import { ProductCard, ProductCardSkeleton } from '@/components/ProductCard'
import { Empty } from '@/components/Empty'

const ORDENS = {
  relevancia: { label: 'Relevância', fn: () => 0 },
  menor: { label: 'Menor preço', fn: (a: Item, b: Item) => a.preco - b.preco },
  maior: { label: 'Maior preço', fn: (a: Item, b: Item) => b.preco - a.preco },
} as const

function Catalogo() {
  const params = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const categoria = params.get('categoria') || ''
  const busca = params.get('busca') || ''
  const [texto, setTexto] = useState(busca)
  const [ordem, setOrdem] = useState<keyof typeof ORDENS>('relevancia')
  const [itens, setItens] = useState<Item[] | null>(null)
  const [categorias, setCategorias] = useState<Categoria[]>([])

  useEffect(() => {
    api<{ categorias: Categoria[] }>('/itens/categorias').then((r) => setCategorias(r.categorias)).catch(() => {})
  }, [])

  useEffect(() => {
    setItens(null)
    setTexto(busca)
    const q = new URLSearchParams()
    if (categoria) q.set('categoria', categoria)
    if (busca) q.set('busca', busca)
    api<{ itens: Item[] }>(`/itens?${q}`).then((r) => setItens(r.itens)).catch(() => setItens([]))
  }, [categoria, busca])

  const navegar = (mudancas: Record<string, string>) => {
    const q = new URLSearchParams(params.toString())
    Object.entries(mudancas).forEach(([k, v]) => (v ? q.set(k, v) : q.delete(k)))
    router.push(`${pathname}?${q}`)
  }

  const lista = itens ? [...itens].sort(ORDENS[ordem].fn) : null

  return (
    <div className="container-loja py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{categoria || 'Todos os produtos'}</h1>
          <p className="mt-1 text-gray-500">
            {lista ? `${lista.length} produto${lista.length === 1 ? '' : 's'}` : 'Carregando…'}
            {busca && <> para “{busca}”</>}
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            navegar({ busca: texto })
          }}
          className="relative w-full sm:w-80"
        >
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Buscar no catálogo" className="input pl-10" />
        </form>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {[{ nome: '', total: 0 }, ...categorias].map((c) => (
          <button
            key={c.nome || 'todas'}
            onClick={() => navegar({ categoria: c.nome })}
            className={`rounded-full px-4 py-2 text-sm font-medium ring-1 transition ${
              categoria === c.nome ? 'bg-ink text-white ring-ink' : 'bg-white text-gray-600 ring-gray-200 hover:ring-gray-300'
            }`}
          >
            {c.nome || 'Todas'}
          </button>
        ))}
        <select
          value={ordem}
          onChange={(e) => setOrdem(e.target.value as keyof typeof ORDENS)}
          className="input ml-auto w-auto rounded-full py-2"
        >
          {Object.entries(ORDENS).map(([k, v]) => (
            <option key={k} value={k}>
              {v.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {lista && lista.length === 0 ? (
          <Empty icon={PackageSearch} titulo="Nenhum produto encontrado" texto="Tente outra busca ou escolha outra categoria." />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
            {lista ? lista.map((item) => <ProductCard key={item.id} item={item} />) : Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Catalogo />
    </Suspense>
  )
}
