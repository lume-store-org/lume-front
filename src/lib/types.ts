export interface Item {
  id: number
  nome: string
  descricao: string | null
  preco: number
  estoque: number
  categoria: string | null
  imagem: string | null
  destaque: boolean
}

export interface Categoria {
  nome: string
  total: number
}

export interface Usuario {
  id: number
  nome: string
  email: string
  endereco?: string | null
  telefone?: string | null
  is_admin: boolean
  data_cadastro?: string
}

export type StatusPedido = 'pendente' | 'pago' | 'enviado' | 'entregue' | 'cancelado'

export interface ItemPedido {
  item_id: number
  nome: string
  imagem: string | null
  quantidade: number
  preco_unitario: number
}

export interface Pedido {
  id: number
  usuario_id: number
  data: string
  status: StatusPedido
  endereco_entrega: string | null
  valor_total: number
  itens: ItemPedido[]
}
