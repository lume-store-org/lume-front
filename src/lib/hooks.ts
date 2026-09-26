'use client'

import { useEffect, useState } from 'react'

/** true after the first render in the browser (avoids mismatches with localStorage) */
export function useHydrated() {
  const [ready, setReady] = useState(false)
  useEffect(() => setReady(true), [])
  return ready
}
