'use client'

import { useAuth } from './store'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function api<T>(caminho: string, init: RequestInit = {}): Promise<T> {
  const { token, sair } = useAuth.getState()
  const resp = await fetch(`${API_URL}/api${caminho}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  const dados = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    if (resp.status === 401 && token) sair()
    throw new ApiError(dados.erro || 'Não foi possível completar a ação', resp.status)
  }
  return dados as T
}

export const enviar = (metodo: string, corpo?: unknown): RequestInit => ({
  method: metodo,
  body: corpo === undefined ? undefined : JSON.stringify(corpo),
})
