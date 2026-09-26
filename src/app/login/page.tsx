'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { User } from '@/lib/types'
import { useAuth } from '@/lib/store'
import { AuthCard } from '@/components/AuthCard'

function Login() {
  const router = useRouter()
  const back = useSearchParams().get('voltar') || '/'
  const signIn = useAuth((s) => s.signIn)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const r = await api<{ token: string; user: User }>('/auth/login', send('POST', { email, password }))
      signIn(r.token, r.user)
      router.push(back)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard title="Entrar na sua conta" subtitle={<>Ainda não tem conta? <Link href="/cadastro" className="font-semibold text-ink underline underline-offset-4">Cadastre-se</Link></>}>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div>
          <label className="label" htmlFor="email">E-mail</label>
          <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" placeholder="voce@exemplo.com" />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" placeholder="••••••••" />
        </div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button disabled={sending} className="btn-primary w-full py-3">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Entrar'}</button>
      </form>
      <div className="mt-6 rounded-xl bg-gray-100 p-4 text-xs text-gray-600">
        <p className="font-semibold text-gray-700">Contas de teste</p>
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
