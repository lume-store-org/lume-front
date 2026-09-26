'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, DollarSign, Package, Pencil, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { api, enviar } from '@/lib/api'
import type { Item, Pedido, StatusPedido, Usuario } from '@/lib/types'
import { brl, dataHora, imagem } from '@/lib/format'
import { RequireAuth } from '@/components/RequireAuth'
import { StatusBadge } from '@/components/StatusBadge'
import { avisar } from '@/components/Toaster'

const STATUS: StatusPedido[] = ['pendente', 'pago', 'enviado', 'entregue', 'cancelado']
const VAZIO = { nome: '', descricao: '', preco: '', estoque: '', categoria: '', imagem: '', destaque: false }
type Form = typeof VAZIO

function Painel() {
  const [aba, setAba] = useState<'produtos' | 'pedidos'>('produtos')
  const [itens, setItens] = useState<Item[]>([])
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [clientes, setClientes] = useState<Record<number, string>>({})
  const [editando, setEditando] = useState<{ id: number | null; form: Form } | null>(null)

  const carregar = () => {
    api<{ itens: Item[] }>('/itens').then((r) => setItens(r.itens))
    api<{ pedidos: Pedido[] }>('/pedidos').then((r) => setPedidos(r.pedidos))
    api<{ usuarios: Usuario[] }>('/usuarios').then((r) => setClientes(Object.fromEntries(r.usuarios.map((u) => [u.id, u.nome]))))
  }
  useEffect(carregar, [])

  const ativos = pedidos.filter((p) => p.status !== 'cancelado')
  const indicadores = [
    { icon: DollarSign, label: 'Faturamento', valor: brl(ativos.reduce((t, p) => t + p.valor_total, 0)) },
    { icon: ShoppingCart, label: 'Pedidos ativos', valor: ativos.length },
    { icon: Package, label: 'Produtos', valor: itens.length },
    { icon: AlertTriangle, label: 'Estoque baixo (≤ 10)', valor: itens.filter((i) => i.estoque <= 10).length },
  ]

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editando) return
    const corpo = { ...editando.form, preco: Number(editando.form.preco), estoque: Number(editando.form.estoque) }
    try {
      if (editando.id) await api(`/itens/${editando.id}`, enviar('PUT', corpo))
      else await api('/itens', enviar('POST', corpo))
      avisar(editando.id ? 'Produto atualizado' : 'Produto cadastrado')
      setEditando(null)
      carregar()
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  const remover = async (item: Item) => {
    if (!confirm(`Remover "${item.nome}" do catálogo?`)) return
    try {
      await api(`/itens/${item.id}`, enviar('DELETE'))
      avisar('Produto removido')
      carregar()
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  const mudarStatus = async (pedido: Pedido, status: StatusPedido) => {
    try {
      await api(`/pedidos/${pedido.id}/status`, enviar('PATCH', { status }))
      avisar(`Pedido #${pedido.id}: ${status}`)
      carregar()
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  const abrir = (item?: Item) =>
    setEditando({
      id: item?.id ?? null,
      form: item
        ? { nome: item.nome, descricao: item.descricao || '', preco: String(item.preco), estoque: String(item.estoque), categoria: item.categoria || '', imagem: item.imagem || '', destaque: item.destaque }
        : VAZIO,
    })

  return (
    <div className="container-loja py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Painel da loja</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {indicadores.map(({ icon: Icon, label, valor }) => (
          <div key={label} className="card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600"><Icon className="h-5 w-5" /></span>
            <p className="mt-4 text-2xl font-semibold">{valor}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-2 border-b border-gray-200">
        {(['produtos', 'pedidos'] as const).map((a) => (
          <button key={a} onClick={() => setAba(a)} className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold capitalize ${aba === a ? 'border-brand-600 text-brand-600' : 'border-transparent text-gray-500 hover:text-ink'}`}>
            {a}
          </button>
        ))}
        {aba === 'produtos' && (
          <button onClick={() => abrir()} className="btn-primary mb-2 ml-auto py-2"><Plus className="h-4 w-4" /> Novo produto</button>
        )}
      </div>

      {aba === 'produtos' ? (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-5 py-3">Produto</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Preço</th><th className="px-5 py-3">Estoque</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {itens.map((i) => (
                <tr key={i.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imagem(i.imagem)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium">{i.nome}</span>
                      {i.destaque && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">destaque</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{i.categoria}</td>
                  <td className="px-5 py-3 font-semibold">{brl(i.preco)}</td>
                  <td className={`px-5 py-3 font-semibold ${i.estoque <= 10 ? 'text-amber-600' : ''}`}>{i.estoque}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => abrir(i)} className="btn-ghost p-2" title="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remover(i)} className="btn-ghost p-2 hover:text-rose-600" title="Remover"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-5 py-3">Pedido</th><th className="px-5 py-3">Data</th><th className="px-5 py-3">Cliente</th><th className="px-5 py-3">Itens</th><th className="px-5 py-3">Total</th><th className="px-5 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pedidos.map((p) => (
                <tr key={p.id}>
                  <td className="px-5 py-3 font-bold">#{p.id}</td>
                  <td className="px-5 py-3 text-gray-600">{dataHora(p.data)}</td>
                  <td className="px-5 py-3 text-gray-600">{clientes[p.usuario_id] ?? `usuário ${p.usuario_id}`}</td>
                  <td className="px-5 py-3 text-gray-600">{p.itens.reduce((t, i) => t + i.quantidade, 0)}</td>
                  <td className="px-5 py-3 font-semibold">{brl(p.valor_total)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={p.status} />
                      <select value={p.status} onChange={(e) => mudarStatus(p, e.target.value as StatusPedido)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs">
                        {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <form onSubmit={salvar} className="card w-full max-w-lg space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">{editando.id ? 'Editar produto' : 'Novo produto'}</h2>
              <button type="button" onClick={() => setEditando(null)} className="btn-ghost p-2"><X className="h-5 w-5" /></button>
            </div>
            {(['nome', 'categoria', 'imagem'] as const).map((k) => (
              <div key={k}>
                <label className="label capitalize">{k}</label>
                <input required={k === 'nome'} className="input" value={editando.form[k]} placeholder={k === 'imagem' ? '/produtos/placeholder.jpg' : ''} onChange={(e) => setEditando({ ...editando, form: { ...editando.form, [k]: e.target.value } })} />
              </div>
            ))}
            <div>
              <label className="label">Descrição</label>
              <textarea rows={2} className="input" value={editando.form.descricao} onChange={(e) => setEditando({ ...editando, form: { ...editando.form, descricao: e.target.value } })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {(['preco', 'estoque'] as const).map((k) => (
                <div key={k}>
                  <label className="label">{k === 'preco' ? 'Preço (R$)' : 'Estoque'}</label>
                  <input required type="number" min={k === 'preco' ? 0.01 : 0} step={k === 'preco' ? 0.01 : 1} className="input" value={editando.form[k]} onChange={(e) => setEditando({ ...editando, form: { ...editando.form, [k]: e.target.value } })} />
                </div>
              ))}
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={editando.form.destaque} onChange={(e) => setEditando({ ...editando, form: { ...editando.form, destaque: e.target.checked } })} className="h-4 w-4 rounded" />
              Mostrar nos destaques da home
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditando(null)} className="btn-outline">Cancelar</button>
              <button className="btn-primary">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth admin>
      <Painel />
    </RequireAuth>
  )
}
