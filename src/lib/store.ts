'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Product, User } from './types'

interface AuthState {
  token: string | null
  user: User | null
  signIn: (token: string, user: User) => void
  updateUser: (user: User) => void
  signOut: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: (token, user) => set({ token, user }),
      updateUser: (user) => set({ user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: 'lume-auth' },
  ),
)

export interface CartLine {
  id: number
  name: string
  price: number
  image: string | null
  stock: number
  quantity: number
}

interface CartState {
  lines: CartLine[]
  add: (product: Product, quantity?: number) => void
  setQuantity: (id: number, quantity: number) => void
  remove: (id: number) => void
  clear: () => void
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product, quantity = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.id === product.id)
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.id === product.id ? { ...l, quantity: Math.min(l.quantity + quantity, product.stock) } : l,
              ),
            }
          }
          const { id, name, price, image, stock } = product
          return { lines: [...s.lines, { id, name, price, image, stock, quantity: Math.min(quantity, stock) }] }
        }),
      setQuantity: (id, quantity) =>
        set((s) => ({
          lines: s.lines.map((l) => (l.id === id ? { ...l, quantity: Math.max(1, Math.min(quantity, l.stock)) } : l)),
        })),
      remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
      clear: () => set({ lines: [] }),
    }),
    { name: 'lume-cart' },
  ),
)

export const cartTotal = (lines: CartLine[]) => lines.reduce((t, l) => t + l.price * l.quantity, 0)
export const cartCount = (lines: CartLine[]) => lines.reduce((t, l) => t + l.quantity, 0)
