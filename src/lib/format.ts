const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export const brl = (valor: number) => moeda.format(valor)

export const parcelas = (valor: number) => `ou 10x de ${brl(valor / 10)} sem juros`

export const dataHora = (iso: string) =>
  new Date(iso).toLocaleString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })

export const imagem = (src: string | null) => src || '/produtos/placeholder.jpg'
