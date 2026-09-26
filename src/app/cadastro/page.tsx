'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { User } from '@/lib/types'
import { useAuth } from '@/lib/store'
import { AuthCard } from '@/components/AuthCard'
import { notify } from '@/components/Toaster'

export default function SignUp() {
  const router = useRouter()
  const signIn = useAuth((s) => s.signIn)
  const [form, setForm] = useState({ name: '', email: '', password: '', address: '', phone: '' })
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const field = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }) })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await api<User>('/users', send('POST', form))
      const r = await api<{ token: string; user: User }>('/auth/login', send('POST', { email: form.email, password: form.password }))
      signIn(r.token, r.user)
      notify(`Bem-vindo, ${r.user.name.split(' ')[0]}!`)
      router.push('/produtos')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthCard title="Criar conta" subtitle={<>Já tem conta? <Link href="/login" className="font-semibold text-ink underline underline-offset-4">Entrar</Link></>}>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div><label className="label">Nome</label><input required className="input" placeholder="Seu nome" {...field('name')} /></div>
        <div><label className="label">E-mail</label><input required type="email" className="input" placeholder="voce@exemplo.com" {...field('email')} /></div>
        <div><label className="label">Senha</label><input required type="password" minLength={6} className="input" placeholder="Mínimo de 6 caracteres" {...field('password')} /></div>
        <div><label className="label">Endereço (opcional)</label><input className="input" placeholder="Rua, número, cidade/UF" {...field('address')} /></div>
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <button disabled={sending} className="btn-primary w-full py-3">{sending ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Criar conta'}</button>
      </form>
    </AuthCard>
  )
}
