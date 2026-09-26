export interface Product {
  id: number
  name: string
  description: string | null
  price: number
  stock: number
  category: string | null
  image: string | null
  featured: boolean
}

export interface Category {
  name: string
  total: number
}

export interface User {
  id: number
  name: string
  email: string
  address?: string | null
  phone?: string | null
  is_admin: boolean
  created_at?: string
}

export type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled'

export interface OrderItem {
  product_id: number
  name: string
  image: string | null
  quantity: number
  unit_price: number
}

export interface Order {
  id: number
  user_id: number
  created_at: string
  status: OrderStatus
  shipping_address: string | null
  total: number
  items: OrderItem[]
}
