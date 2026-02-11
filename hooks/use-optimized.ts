import { useEffect } from 'react'

/**
 * Performance optimization hook
 * Helps improve page loading speed by deferring non-critical work
 */
export function useOptimized() {
  useEffect(() => {
    // Use requestIdleCallback for non-critical operations
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        // Pre-warm critical assets
        const links = document.querySelectorAll('a[href*="/dashboard"], a[href*="/track"]')
        links.forEach((link) => {
          const href = (link as HTMLAnchorElement).href
          const prefetch = document.createElement('link')
          prefetch.rel = 'prefetch'
          prefetch.href = href
          document.head.appendChild(prefetch)
        })
      })
    }
  }, [])
}

/**
 * Cache decorator for expensive computations
 */
export function memoizeAsync<T>(fn: () => Promise<T>, cacheKey: string): () => Promise<T> {
  let cached: T | null = null
  let promise: Promise<T> | null = null

  return async () => {
    if (cached) return cached
    if (promise) return promise

    promise = fn().then((result) => {
      cached = result
      return result
    })

    return promise
  }
}
