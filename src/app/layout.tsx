import type { Metadata } from 'next'
import '@fontsource-variable/inter'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/Toaster'

export const metadata: Metadata = {
  title: 'Lab Store · E-commerce com microserviços',
  description: 'Loja de demonstração: API Gateway, serviços de itens, pedidos e usuários, cada um com seu banco.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
