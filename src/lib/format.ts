const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const brl = (value: number) => currency.format(value)

export const installments = (value: number) => `ou 10x de ${brl(value / 10)} sem juros`

export const dateTime = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const imageUrl = (src: string | null) => src || '/produtos/placeholder.jpg'
