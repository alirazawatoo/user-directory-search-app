import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDebouncedCallback } from '../useDebouncedCallback'

describe('useDebouncedCallback', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calls the callback once with the last arguments after the delay', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current.run('r')
    vi.advanceTimersByTime(200)
    result.current.run('ro')
    vi.advanceTimersByTime(200)
    result.current.run('ros')

    expect(callback).not.toHaveBeenCalled()
    vi.advanceTimersByTime(300)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith('ros')
  })

  it('cancel drops the pending call', () => {
    const callback = vi.fn()
    const { result } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current.run('x')
    result.current.cancel()
    vi.advanceTimersByTime(1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('does not fire after unmount', () => {
    const callback = vi.fn()
    const { result, unmount } = renderHook(() => useDebouncedCallback(callback, 300))

    result.current.run('x')
    unmount()
    vi.advanceTimersByTime(1000)

    expect(callback).not.toHaveBeenCalled()
  })

  it('uses the latest callback without restarting the timer', () => {
    const first = vi.fn()
    const second = vi.fn()
    const { result, rerender } = renderHook(({ callback }) => useDebouncedCallback(callback, 300), {
      initialProps: { callback: first },
    })

    result.current.run('x')
    rerender({ callback: second })
    vi.advanceTimersByTime(300)

    expect(first).not.toHaveBeenCalled()
    expect(second).toHaveBeenCalledWith('x')
  })
})
