// lib/crawler.ts
// Crawler abstraction layer. To switch from Jina to another provider:
// 1. Replace CRAWLER_BASE_URL with the new provider's endpoint
// 2. Replace CRAWLER_API_KEY_ENV with the new env var name
// 3. Adjust the headers object if the new provider uses different auth
// No changes needed in any API route.

const CRAWLER_BASE_URL = 'https://r.jina.ai'
const CRAWLER_API_KEY_ENV = 'JINA_API_KEY'

export interface CrawlResult {
  text: string
  ok: boolean
  status: number
}

export async function crawlUrl(url: string): Promise<CrawlResult> {
  const apiKey = process.env[CRAWLER_API_KEY_ENV]
  const headers: Record<string, string> = {
    Accept: 'text/plain',
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  const response = await fetch(`${CRAWLER_BASE_URL}/${url}`, { headers })

  if (!response.ok) {
    return { text: '', ok: false, status: response.status }
  }

  const text = await response.text()
  return { text, ok: true, status: response.status }
}
