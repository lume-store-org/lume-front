'use client'

import { useEffect, useState } from 'react'
import { KeyRound, UserRound } from 'lucide-react'
import { api, send } from '@/lib/api'
import type { User } from '@/lib/types'
import { useAuth } from '@/lib/store'
import { RequireAuth } from '@/components/RequireAuth'
import { notify } from '@/components/Toaster'

function Account() {
  const updateUser = useAuth((s) => s.updateUser)
  const [profile, setProfile] = useState({ name: '', email: '', address: '', phone: '' })
  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' })

  useEffect(() => {
    api<User>('/users/me').then((u) => setProfile({ name: u.name, email: u.email, address: u.address || '', phone: u.phone || '' }))
  }, [])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      updateUser(await api<User>('/users/me', send('PUT', profile)))
      notify('Dados atualizados')
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await api('/users/me/password', send('PATCH', passwords))
      setPasswords({ current_password: '', new_password: '' })
      notify('Senha alterada')
    } catch (err) {
      notify((err as Error).message, 'error')
    }
  }

  const field = (k: keyof typeof profile) => ({ value: profile[k], onChange: (e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, [k]: e.target.value }) })

  return (
    <div className="container-store max-w-3xl py-10">
      <h1 className="text-3xl font-semibold tracking-tight">Minha conta</h1>
      <form onSubmit={save} className="card mt-8 space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><UserRound className="h-5 w-5" /> Dados pessoais</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Nome</label><input className="input" {...field('name')} /></div>
          <div><label className="label">E-mail</label><input type="email" className="input" {...field('email')} /></div>
          <div><label className="label">Telefone</label><input className="input" {...field('phone')} /></div>
          <div className="sm:col-span-2"><label className="label">Endereço</label><input className="input" {...field('address')} /></div>
        </div>
        <button className="btn-primary">Salvar alterações</button>
      </form>
      <form onSubmit={changePassword} className="card mt-6 space-y-4 p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold"><KeyRound className="h-5 w-5" /> Trocar senha</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Senha atual</label><input required type="password" className="input" value={passwords.current_password} onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })} /></div>
          <div><label className="label">Nova senha</label><input required type="password" minLength={6} className="input" value={passwords.new_password} onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })} /></div>
        </div>
        <button className="btn-outline">Alterar senha</button>
      </form>
    </div>
  )
}

export default function Page() {
  return (
    <RequireAuth>
      <Account />
    </RequireAuth>
  )
}
