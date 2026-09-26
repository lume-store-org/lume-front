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

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const { token, signOut } = useAuth.getState()
  const resp = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init.headers,
    },
  })
  const data = await resp.json().catch(() => ({}))
  if (!resp.ok) {
    if (resp.status === 401 && token) signOut()
    throw new ApiError(data.error || 'Não foi possível concluir a ação', resp.status)
  }
  return data as T
}

export const send = (method: string, body?: unknown): RequestInit => ({
  method,
  body: body === undefined ? undefined : JSON.stringify(body),
})
