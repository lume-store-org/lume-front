'use client'

import { useEffect, useState } from 'react'
import { AlertTriangle, DollarSign, Package, Pencil, Plus, ShoppingCart, Trash2, X } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { Order, OrderStatus, Product, User } from '@/lib/types'
import { brl, dateTime, imageUrl } from '@/lib/format'
import { RequireAuth } from '@/components/RequireAuth'
import { STATUS_LABEL, StatusBadge } from '@/components/StatusBadge'
import { notify } from '@/components/Toaster'

const STATUSES = Object.keys(STATUS_LABEL) as OrderStatus[]
const EMPTY_FORM = { name: '', description: '', price: '', stock: '', category: '', image: '', featured: false }
type ProductForm = typeof EMPTY_FORM

const TEXT_FIELDS: { key: 'name' | 'category' | 'image'; label: string }[] = [
  { key: 'name', label: 'Nome' },
  { key: 'category', label: 'Categoria' },
  { key: 'image', label: 'Imagem' },
]

function AdminPanel() {
  const [tab, setTab] = useState<'products' | 'orders'>('products')
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Record<number, string>>({})
  const [editing, setEditing] = useState<{ id: number | null; form: ProductForm } | null>(null)

  const load = () => {
    api<{ products: Product[] }>('/products').then((r) => setProducts(r.products))
    api<{ orders: Order[] }>('/orders').then((r) => setOrders(r.orders))
    api<{ users: User[] }>('/users').then((r) => setCustomers(Object.fromEntries(r.users.map((u) => [u.id, u.name]))))
  }
  useEffect(load, [])

  const active = orders.filter((o) => o.status !== 'cancelled')
  const metrics = [
    { icon: DollarSign, label: 'Faturamento', value: brl(active.reduce((t, o) => t + o.total, 0)) },
    { icon: ShoppingCart, label: 'Pedidos ativos', value: active.length },
    { icon: Package, label: 'Produtos', value: products.length },
    { icon: AlertTriangle, label: 'Estoque baixo (≤ 10)', value: products.filter((p) => p.stock <= 10).length },
  ]

  const setField = (key: keyof ProductForm, value: string | boolean) =>
    editing && setEditing({ ...editing, form: { ...editing.form, [key]: value } })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    const body = { ...editing.form, price: Number(editing.form.price), stock: Number(editing.form.stock) }
    try {
      if (editing.id) await api(`/products/${editing.id}`, send('PUT', body))
      else await api('/products', send('POST', body))
      notify(editing.id ? 'Produto atualizado' : 'Produto cadastrado')
      setEditing(null)
      load()
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  const remove = async (product: Product) => {
    if (!confirm(`Remover "${product.name}" do catálogo?`)) return
    try {
      await api(`/products/${product.id}`, send('DELETE'))
      notify('Produto removido')
      load()
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  const changeStatus = async (order: Order, status: OrderStatus) => {
    try {
      await api(`/orders/${order.id}/status`, send('PATCH', { status }))
      notify(`Pedido #${order.id}: ${STATUS_LABEL[status].toLowerCase()}`)
      load()
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  const open = (product?: Product) =>
    setEditing({
      id: product?.id ?? null,
      form: product
        ? { name: product.name, description: product.description || '', price: String(product.price), stock: String(product.stock), category: product.category || '', image: product.image || '', featured: product.featured }
        : EMPTY_FORM,
    })

  return (
    <div className="container-store py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Painel da loja</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card p-5">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 text-ink"><Icon className="h-5 w-5" /></span>
            <p className="mt-4 text-2xl font-semibold">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center gap-2 border-b border-gray-200">
        {([['products', 'Produtos'], ['orders', 'Pedidos']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold ${tab === key ? 'border-brand-500 text-ink' : 'border-transparent text-gray-500 hover:text-ink'}`}>
            {label}
          </button>
        ))}
        {tab === 'products' && (
          <button onClick={() => open()} className="btn-primary mb-2 ml-auto py-2"><Plus className="h-4 w-4" /> Novo produto</button>
        )}
      </div>

      {tab === 'products' ? (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500">
              <tr><th className="px-5 py-3">Produto</th><th className="px-5 py-3">Categoria</th><th className="px-5 py-3">Preço</th><th className="px-5 py-3">Estoque</th><th className="px-5 py-3" /></tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/60">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={imageUrl(p.image)} alt="" className="h-10 w-10 rounded-lg object-cover" />
                      <span className="font-medium">{p.name}</span>
                      {p.featured && <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-semibold text-brand-700">destaque</span>}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-gray-600">{p.category}</td>
                  <td className="px-5 py-3 font-semibold">{brl(p.price)}</td>
                  <td className={`px-5 py-3 font-semibold ${p.stock <= 10 ? 'text-amber-700' : ''}`}>{p.stock}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => open(p)} className="btn-ghost p-2" title="Editar"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => remove(p)} className="btn-ghost p-2 hover:text-rose-600" title="Remover"><Trash2 className="h-4 w-4" /></button>
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
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-5 py-3 font-semibold">#{o.id}</td>
                  <td className="px-5 py-3 text-gray-600">{dateTime(o.created_at)}</td>
                  <td className="px-5 py-3 text-gray-600">{customers[o.user_id] ?? `Cliente ${o.user_id}`}</td>
                  <td className="px-5 py-3 text-gray-600">{o.items.reduce((t, i) => t + i.quantity, 0)}</td>
                  <td className="px-5 py-3 font-semibold">{brl(o.total)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={o.status} />
                      <select value={o.status} onChange={(e) => changeStatus(o, e.target.value as OrderStatus)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs">
                        {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm">
          <form onSubmit={save} className="card w-full max-w-lg space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{editing.id ? 'Editar produto' : 'Novo produto'}</h2>
              <button type="button" onClick={() => setEditing(null)} className="btn-ghost p-2" aria-label="Fechar"><X className="h-5 w-5" /></button>
            </div>
            {TEXT_FIELDS.map(({ key, label }) => (
              <div key={key}>
                <label className="label">{label}</label>
                <input required={key === 'name'} className="input" value={editing.form[key]} placeholder={key === 'image' ? '/produtos/placeholder.jpg' : ''} onChange={(e) => setField(key, e.target.value)} />
              </div>
            ))}
            <div>
              <label className="label">Descrição</label>
              <textarea rows={2} className="input" value={editing.form.description} onChange={(e) => setField('description', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Preço (R$)</label>
                <input required type="number" min={0.01} step={0.01} className="input" value={editing.form.price} onChange={(e) => setField('price', e.target.value)} />
              </div>
              <div>
                <label className="label">Estoque</label>
                <input required type="number" min={0} step={1} className="input" value={editing.form.stock} onChange={(e) => setField('stock', e.target.value)} />
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" checked={editing.form.featured} onChange={(e) => setField('featured', e.target.checked)} className="h-4 w-4 rounded" />
              Mostrar nos mais vendidos da home
            </label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditing(null)} className="btn-outline">Cancelar</button>
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
      <AdminPanel />
    </RequireAuth>
  )
}
