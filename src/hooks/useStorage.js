import { useState, useEffect, useCallback } from 'react'

/**
 * Reactive hook that re-renders whenever the given localStorage key changes.
 * Pass a `reader` function that returns the current value from storage.
 */
export function useStorage(reader, deps = []) {
  const [value, setValue] = useState(() => reader())

  const refresh = useCallback(() => {
    setValue(reader())
  }, deps) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    window.addEventListener('storage', refresh)
    return () => window.removeEventListener('storage', refresh)
  }, [refresh])

  return [value, refresh]
}
