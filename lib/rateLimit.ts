import LRU from 'lru-cache'

const rateLimitWindowMs = 60 * 1000 // 1 minute
const maxRequests = 10

const cache = new LRU<string, { count: number; lastRequest: number }>({
  max: 5000,
  ttl: rateLimitWindowMs,
})

export function rateLimit(key: string): boolean {
  const now = Date.now()
  const entry = cache.get(key)

  if (!entry) {
    cache.set(key, { count: 1, lastRequest: now })
    return true
  }

  if (now - entry.lastRequest > rateLimitWindowMs) {
    cache.set(key, { count: 1, lastRequest: now })
    return true
  }

  if (entry.count >= maxRequests) {
    return false
  }

  entry.count++
  entry.lastRequest = now
  cache.set(key, entry)
  return true
}
