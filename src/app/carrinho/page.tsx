'use client'

import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart, totalCarrinho } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'
import { brl, imagem } from '@/lib/format'
import { Empty } from '@/components/Empty'
import { FRETE, FRETE_GRATIS, Resumo } from '@/components/Resumo'

export default function Carrinho() {
  const pronto = useHydrated()
  const { linhas, alterar, remover } = useCart()
  if (!pronto) return null

  const subtotal = totalCarrinho(linhas)
  const frete = subtotal >= FRETE_GRATIS || subtotal === 0 ? 0 : FRETE

  if (linhas.length === 0)
    return (
      <div className="container-loja py-16">
        <Empty icon={ShoppingBag} titulo="Seu carrinho está vazio" texto="Escolha alguns produtos e eles aparecem aqui." acao={{ href: '/produtos', label: 'Ver produtos' }} />
      </div>
    )

  return (
    <div className="container-loja py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Carrinho</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="card divide-y divide-gray-100">
          {linhas.map((l) => (
            <div key={l.id} className="flex gap-4 p-4 sm:p-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagem(l.imagem)} alt={l.nome} className="h-24 w-24 shrink-0 rounded-xl object-cover" />
              <div className="flex flex-1 flex-col">
                <div className="flex justify-between gap-4">
                  <Link href={`/produtos/${l.id}`} className="font-semibold hover:text-brand-600">{l.nome}</Link>
                  <p className="font-bold">{brl(l.preco * l.quantidade)}</p>
                </div>
                <p className="text-sm text-gray-500">{brl(l.preco)} cada</p>
                <div className="mt-auto flex items-center justify-between pt-3">
                  <div className="flex items-center rounded-lg border border-gray-300">
                    <button onClick={() => alterar(l.id, l.quantidade - 1)} className="p-2 text-gray-600 hover:text-ink"><Minus className="h-3.5 w-3.5" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{l.quantidade}</span>
                    <button onClick={() => alterar(l.id, l.quantidade + 1)} className="p-2 text-gray-600 hover:text-ink"><Plus className="h-3.5 w-3.5" /></button>
                  </div>
                  <button onClick={() => remover(l.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-rose-600">
                    <Trash2 className="h-4 w-4" /> Remover
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Resumo subtotal={subtotal} frete={frete}>
          <Link href="/checkout" className="btn-primary mt-6 w-full py-3 text-base">Fechar pedido</Link>
          <Link href="/produtos" className="btn-ghost mt-2 w-full">Continuar comprando</Link>
        </Resumo>
      </div>
    </div>
  )
}
