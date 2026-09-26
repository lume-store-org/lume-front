'use client'

import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/store'
import { useHydrated } from '@/lib/hooks'

/** Redirects to login when not authenticated (or not an admin, when required). */
export function RequireAuth({ admin = false, children }: { admin?: boolean; children: React.ReactNode }) {
  const ready = useHydrated()
  const user = useAuth((s) => s.user)
  const router = useRouter()
  const pathname = usePathname()
  const allowed = !!user && (!admin || user.is_admin)

  useEffect(() => {
    if (!ready) return
    if (!user) router.replace(`/login?voltar=${encodeURIComponent(pathname)}`)
    else if (admin && !user.is_admin) router.replace('/')
  }, [ready, user, admin, router, pathname])

  if (!ready || !allowed) return null
  return <>{children}</>
}
