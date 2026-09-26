'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'

/** Redireciona para o login quem não está autenticado (ou não é admin, quando exigido). */
export function RequireAuth({ admin = false, children }: { admin?: boolean; children: React.ReactNode }) {
  const pronto = useHydrated()
  const usuario = useAuth((s) => s.usuario)
  const router = useRouter()
  const pathname = usePathname()
  const permitido = !!usuario && (!admin || usuario.is_admin)

  useEffect(() => {
    if (!pronto) return
    if (!usuario) router.replace(`/login?voltar=${encodeURIComponent(pathname)}`)
    else if (admin && !usuario.is_admin) router.replace('/')
  }, [pronto, usuario, admin, router, pathname])

  if (!pronto || !permitido) return null
  return <>{children}</>
}
