'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { CheckCircle2, Loader2, MapPin } from 'lucide-react'
import { api, enviar } from '@/lib/api'
import type { Pedido, Usuario } from '@/lib/types'
import { useCart, totalCarrinho } from '@/lib/store'
import { brl, imagem } from '@/lib/format'
import { RequireAuth } from '@/components/RequireAuth'
import { FRETE, FRETE_GRATIS, Resumo } from '@/components/Resumo'

function Checkout() {
  const router = useRouter()
  const { linhas, limpar } = useCart()
  const [endereco, setEndereco] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState('')
  const [pedido, setPedido] = useState<Pedido | null>(null)

  useEffect(() => {
    api<Usuario>('/usuarios/me').then((u) => setEndereco(u.endereco || '')).catch(() => {})
  }, [])

  useEffect(() => {
    if (linhas.length === 0 && !pedido) router.replace('/carrinho')
  }, [linhas.length, pedido, router])

  if (pedido)
    return (
      <div className="container-loja max-w-2xl py-16">
        <div className="card p-8 text-center">
          <CheckCircle2 className="mx-auto h-14 w-14 text-emerald-500" />
          <h1 className="mt-4 text-2xl font-bold">Pedido #{pedido.id} confirmado!</h1>
          <p className="mt-2 text-gray-500">Total de {brl(pedido.valor_total)}. O estoque já foi reservado para você.</p>
          <div className="mt-8 flex justify-center gap-3">
            <Link href="/pedidos" className="btn-primary">Ver meus pedidos</Link>
            <Link href="/produtos" className="btn-outline">Continuar comprando</Link>
          </div>
        </div>
      </div>
    )

  const subtotal = totalCarrinho(linhas)
  const frete = subtotal >= FRETE_GRATIS ? 0 : FRETE

  const finalizar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      const novo = await api<Pedido>(
        '/pedidos',
        enviar('POST', { itens: linhas.map((l) => ({ item_id: l.id, quantidade: l.quantidade })), endereco_entrega: endereco }),
      )
      setPedido(novo)
      limpar()
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="container-loja py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Fechar pedido</h1>
      <form onSubmit={finalizar} className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="card p-6">
            <h2 className="flex items-center gap-2 text-lg font-bold"><MapPin className="h-5 w-5 text-brand-600" /> Endereço de entrega</h2>
            <textarea required rows={3} value={endereco} onChange={(e) => setEndereco(e.target.value)} placeholder="Rua, número, bairro, cidade/UF" className="input mt-4" />
          </section>
          <section className="card divide-y divide-gray-100">
            {linhas.map((l) => (
              <div key={l.id} className="flex items-center gap-4 p-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imagem(l.imagem)} alt="" className="h-14 w-14 rounded-lg object-cover" />
                <p className="flex-1 text-sm font-medium">{l.quantidade}× {l.nome}</p>
                <p className="text-sm font-semibold">{brl(l.preco * l.quantidade)}</p>
              </div>
            ))}
          </section>
        </div>
        <Resumo subtotal={subtotal} frete={frete}>
          {erro && <p className="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{erro}</p>}
          <button disabled={enviando} className="btn-primary mt-6 w-full py-3 text-base">
            {enviando ? <><Loader2 className="h-5 w-5 animate-spin" /> Confirmando…</> : 'Confirmar pedido'}
          </button>
          <p className="mt-3 text-center text-xs text-gray-500">Os preços são confirmados pelo servidor com base no catálogo.</p>
        </Resumo>
      </form>
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <Checkout />
    </RequireAuth>
  )
}
