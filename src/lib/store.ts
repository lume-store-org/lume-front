'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Item, Usuario } from './types'

interface AuthState {
  token: string | null
  usuario: Usuario | null
  entrar: (token: string, usuario: Usuario) => void
  atualizarUsuario: (usuario: Usuario) => void
  sair: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,
      entrar: (token, usuario) => set({ token, usuario }),
      atualizarUsuario: (usuario) => set({ usuario }),
      sair: () => set({ token: null, usuario: null }),
    }),
    { name: 'loja-auth' },
  ),
)

export interface LinhaCarrinho {
  id: number
  nome: string
  preco: number
  imagem: string | null
  estoque: number
  quantidade: number
}

interface CartState {
  linhas: LinhaCarrinho[]
  adicionar: (item: Item, quantidade?: number) => void
  alterar: (id: number, quantidade: number) => void
  remover: (id: number) => void
  limpar: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      linhas: [],
      adicionar: (item, quantidade = 1) =>
        set((s) => {
          const atual = s.linhas.find((l) => l.id === item.id)
          if (atual) {
            return {
              linhas: s.linhas.map((l) =>
                l.id === item.id ? { ...l, quantidade: Math.min(l.quantidade + quantidade, item.estoque) } : l,
              ),
            }
          }
          const { id, nome, preco, imagem, estoque } = item
          return { linhas: [...s.linhas, { id, nome, preco, imagem, estoque, quantidade: Math.min(quantidade, estoque) }] }
        }),
      alterar: (id, quantidade) =>
        set((s) => ({
          linhas: s.linhas.map((l) => (l.id === id ? { ...l, quantidade: Math.max(1, Math.min(quantidade, l.estoque)) } : l)),
        })),
      remover: (id) => set((s) => ({ linhas: s.linhas.filter((l) => l.id !== id) })),
      limpar: () => set({ linhas: [] }),
    }),
    { name: 'loja-carrinho' },
  ),
)

export const totalCarrinho = (linhas: LinhaCarrinho[]) => linhas.reduce((t, l) => t + l.preco * l.quantidade, 0)
export const qtdCarrinho = (linhas: LinhaCarrinho[]) => linhas.reduce((t, l) => t + l.quantidade, 0)
