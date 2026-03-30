// lib/crawler.ts

const CRAWLER_BASE_URL = 'https://api.firecrawl.dev/v1/scrape'
const CRAWLER_API_KEY_ENV = 'FIRECRAWL_API_KEY'

export interface CrawlResult {
  text: string
  ok: boolean
  status: number
}

export async function crawlUrl(url: string): Promise<CrawlResult> {
  const apiKey = process.env[CRAWLER_API_KEY_ENV]
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`
  }

  const response = await fetch(CRAWLER_BASE_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      url,
      formats: ['markdown'],
    }),
  })

  if (!response.ok) {
    return { text: '', ok: false, status: response.status }
  }

  const data = (await response.json()) as {
    success?: boolean
    data?: {
      markdown?: string
    }
  }

  const text = data.data?.markdown

  if (!data.success || !text) {
    return { text: '', ok: false, status: response.status }
  }

  return { text, ok: true, status: response.status }
}
