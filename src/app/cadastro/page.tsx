'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { api, enviar } from '@/lib/api'
import type { Usuario } from '@/lib/types'
import { useAuth } from '@/lib/store'
import { AuthCard } from '@/components/AuthCard'
import { avisar } from '@/components/Toaster'

export default function Cadastro() {
  const router = useRouter()
  const entrar = useAuth((s) => s.entrar)
  const [form, setForm] = useState({ nome: '', email: '', senha: '', endereco: '', telefone: '' })
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const campo = (k: keyof typeof form) => ({ value: form[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value }) })

  const submeter = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setErro('')
    try {
      await api<Usuario>('/usuarios', enviar('POST', form))
      const r = await api<{ token: string; usuario: Usuario }>('/auth/login', enviar('POST', { email: form.email, senha: form.senha }))
      entrar(r.token, r.usuario)
      avisar(`Bem-vindo, ${r.usuario.nome.split(' ')[0]}!`)
      router.push('/produtos')
    } catch (err) {
      setErro((err as Error).message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <AuthCard titulo="Criar conta" subtitulo={<>Já tem conta? <Link href="/login" className="font-semibold text-brand-600">Entrar</Link></>}>
      <form onSubmit={submeter} className="mt-6 space-y-4">
        <div><label className="label">Nome</label><input required className="input" placeholder="Seu nome" {...campo('nome')} /></div>
        <div><label className="label">E-mail</label><input required type="email" className="input" placeholder="voce@exemplo.com" {...campo('email')} /></div>
        <div><label className="label">Senha</label><input required type="password" minLength={6} className="input" placeholder="Mínimo de 6 caracteres" {...campo('senha')} /></div>
        <div><label className="label">Endereço (opcional)</label><input className="input" placeholder="Rua, número, cidade/UF" {...campo('endereco')} /></div>
        {erro && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{erro}</p>}
        <button disabled={enviando} className="btn-primary w-full py-3">{enviando ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Criar conta'}</button>
      </form>
    </AuthCard>
  )
}
