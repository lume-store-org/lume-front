import type { Metadata } from 'next'
import '@fontsource-variable/outfit'
import './globals.css'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Toaster } from '@/components/Toaster'

export const metadata: Metadata = {
  title: 'Lume Store · Tecnologia e estilo',
  description: 'Smartphones, notebooks, áudio, acessórios e moda com estoque em tempo real.',
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
