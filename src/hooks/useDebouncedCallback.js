import { useEffect, useMemo, useRef } from 'react'

export function useDebouncedCallback(callback, delay) {
  const callbackRef = useRef(callback)
  const timerRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  })

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return useMemo(() => {
    const cancel = () => clearTimeout(timerRef.current)
    const run = (...args) => {
      cancel()
      timerRef.current = setTimeout(() => callbackRef.current(...args), delay)
    }
    return { run, cancel }
  }, [delay])
}
