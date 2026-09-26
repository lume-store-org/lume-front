'use client'

import { useEffect, useState } from 'react'
import { KeyRound, UserRound } from 'lucide-react'
import { api, enviar } from '@/lib/api'
import type { Usuario } from '@/lib/types'
import { useAuth } from '@/lib/store'
import { RequireAuth } from '@/components/RequireAuth'
import { avisar } from '@/components/Toaster'

function Conta() {
  const atualizarUsuario = useAuth((s) => s.atualizarUsuario)
  const [perfil, setPerfil] = useState({ nome: '', email: '', endereco: '', telefone: '' })
  const [senhas, setSenhas] = useState({ senha_atual: '', nova_senha: '' })

  useEffect(() => {
    api<Usuario>('/usuarios/me').then((u) => setPerfil({ nome: u.nome, email: u.email, endereco: u.endereco || '', telefone: u.telefone || '' }))
  }, [])

  const salvar = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      atualizarUsuario(await api<Usuario>('/usuarios/me', enviar('PUT', perfil)))
      avisar('Dados atualizados')
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  const trocarSenha = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api('/usuarios/me/senha', enviar('PATCH', senhas))
      setSenhas({ senha_atual: '', nova_senha: '' })
      avisar('Senha alterada')
    } catch (err) {
      avisar((err as Error).message, 'erro')
    }
  }

  const campo = (k: keyof typeof perfil) => ({ value: perfil[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPerfil({ ...perfil, [k]: e.target.value }) })

  return (
    <div className="container-loja max-w-3xl py-10">
      <h1 className="text-3xl font-bold tracking-tight">Minha conta</h1>
      <form onSubmit={salvar} className="card mt-8 space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold"><UserRound className="h-5 w-5 text-brand-600" /> Dados pessoais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Nome</label><input className="input" {...campo('nome')} /></div>
          <div><label className="label">E-mail</label><input type="email" className="input" {...campo('email')} /></div>
          <div><label className="label">Telefone</label><input className="input" {...campo('telefone')} /></div>
          <div className="sm:col-span-2"><label className="label">Endereço</label><input className="input" {...campo('endereco')} /></div>
        </div>
        <button className="btn-primary">Salvar alterações</button>
      </form>
      <form onSubmit={trocarSenha} className="card mt-6 space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-bold"><KeyRound className="h-5 w-5 text-brand-600" /> Trocar senha</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Senha atual</label><input required type="password" className="input" value={senhas.senha_atual} onChange={(e) => setSenhas({ ...senhas, senha_atual: e.target.value })} /></div>
          <div><label className="label">Nova senha</label><input required type="password" minLength={6} className="input" value={senhas.nova_senha} onChange={(e) => setSenhas({ ...senhas, nova_senha: e.target.value })} /></div>
        </div>
        <button className="btn-outline">Alterar senha</button>
      </form>
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <Conta />
    </RequireAuth>
  )
}
