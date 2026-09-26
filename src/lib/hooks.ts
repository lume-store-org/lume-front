'use client'

import { useEffect, useState } from 'react'

/** true depois da primeira renderização no navegador (evita divergência com o localStorage) */
export function useHydrated() {
  const [pronto, setPronto] = useState(false)
  useEffect(() => setPronto(true), [])
  return pronto
}
