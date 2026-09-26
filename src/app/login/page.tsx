'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { AuthCard } from '@/components/AuthCard'
import { api, enviar } from '@/lib/api'
import type { Usuario } from '@/lib/types'
import { useAuth } from '@/lib/store'

function Login() {
  const router = useRouter()
  const voltar = useSearchParams().get('voltar') || '/'
  const entrar = useAuth((s) => s.entrar)
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      const r = await api<{ token: string; usuario: Usuario }>('/auth/login', enviar('POST', { email, senha }))
      entrar(r.token, r.usuario)
      router.push(voltar)
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthCard titulo="Entrar na sua conta" subtitulo={<>Ainda não tem conta? <Link href="/cadastro" className="font-semibold text-brand-600">Cadastre-se</Link></>}>
      <form onSubmit={submeter} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="voce@exemplo.com" />
        </div>
        <div>
          <label className="label" htmlFor="senha">Senha</label>
          <input id="senha" type="password" required value={senha} onChange={(e) => setSenha(e.target.value)} className="input" placeholder="••••••••" />
        </div>
        {erro && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{erro}</p>}
        <button disabled={enviando} className="btn-primary w-full py-3">{enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}</button>
      </form>
      <div className="mt-6 rounded-xl bg-slate-100 p-4 text-xs text-slate-600">
        <p className="font-semibold text-slate-700">Contas de teste</p>
        <p className="mt-1">Cliente: cliente@lumestore.dev · senha123</p>
        <p>Admin: admin@lumestore.dev · admin123</p>
      </div>
    </AuthCard>
  )
}

export default function Page() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  )
}
