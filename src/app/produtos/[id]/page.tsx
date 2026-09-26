'use client'

import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronLeft, Minus, PackageX, Plus, ShieldCheck, ShoppingBag, Truck } from 'lucide-react'
import { api } from '@/lib/api'
import type { Product } from '@/lib/types'
import { brl, imageUrl, installments } from '@/lib/format'
import { useCart } from '@/lib/store'
import { notify } from '@/components/Toaster'
import { EmptyState } from '@/components/EmptyState'

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const add = useCart((s) => s.add)
  const [product, setProduct] = useState<Product | null | undefined>(undefined)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    api<Product>(`/products/${id}`).then(setProduct).catch(() => setProduct(null))
  }, [id])

  if (product === null)
    return (
      <div className="container-store py-16">
        <EmptyState icon={PackageX} title="Produto não encontrado" text="Ele pode ter saído do catálogo." action={{ href: '/produtos', label: 'Ver produtos' }} />
      </div>
    )
  if (!product) return <div className="container-store py-16"><div className="h-96 animate-pulse rounded-3xl bg-gray-200" /></div>

  const soldOut = product.stock <= 0
  const buy = (goToCart: boolean) => {
    add(product, quantity)
    if (goToCart) router.push('/carrinho')
    else notify(`${quantity}× ${product.name} no carrinho`)
  }

  return (
    <div className="container-store py-10">
      <Link href="/produtos" className="inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-ink">
        <ChevronLeft className="h-4 w-4" /> Voltar ao catálogo
      </Link>

      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(product.image)} alt={product.name} className="aspect-square w-full object-cover" />
        </div>

        <div className="flex flex-col">
          <Link href={`/produtos?categoria=${encodeURIComponent(product.category || '')}`} className="text-sm font-medium text-gray-500 hover:text-ink">
            {product.category}
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{product.name}</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-600">{product.description}</p>

          <div className="mt-8">
            <p className="text-4xl font-semibold">{brl(product.price)}</p>
            <p className="mt-1 text-gray-500">{installments(product.price)}</p>
          </div>

          <p className={`mt-4 text-sm font-medium ${soldOut ? 'text-rose-600' : product.stock <= 10 ? 'text-amber-700' : 'text-emerald-700'}`}>
            {soldOut ? 'Esgotado' : product.stock <= 10 ? `Últimas ${product.stock} unidades` : `${product.stock} em estoque`}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-xl border border-gray-300 bg-white">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="p-3 text-gray-600 hover:text-ink" disabled={soldOut} aria-label="Diminuir">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-semibold">{quantity}</span>
              <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))} className="p-3 text-gray-600 hover:text-ink" disabled={soldOut} aria-label="Aumentar">
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => buy(true)} disabled={soldOut} className="btn-primary flex-1 py-3 text-base">Comprar agora</button>
            <button onClick={() => buy(false)} disabled={soldOut} className="btn-outline py-3" title="Adicionar ao carrinho">
              <ShoppingBag className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-8 space-y-3 rounded-2xl bg-gray-100 p-5 text-sm text-gray-600">
            <p className="flex items-center gap-3"><Truck className="h-5 w-5 text-ink" /> Frete grátis em compras acima de R$ 299</p>
            <p className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-ink" /> Compra protegida e troca grátis em 30 dias</p>
          </div>
        </div>
      </div>
    </div>
  )
}
