import { createClient } from '@supabase/supabase-js'
import { runRuleEngine } from '../lib/rule-engine/index'

const TEST_URLS = [
  'https://REAL_UK_SHOPIFY_STORE_1.co.uk/products/example',
  'https://REAL_UK_SHOPIFY_STORE_2.co.uk/products/example',
  'https://REAL_UK_SHOPIFY_STORE_3.co.uk/products/example',
  'https://REAL_UK_SHOPIFY_STORE_4.co.uk/products/example',
  'https://REAL_UK_SHOPIFY_STORE_5.co.uk/products/example',
] as const

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

type EngineResult = ReturnType<typeof runRuleEngine>

process.on('unhandledRejection', (reason) => {
  const error = reason instanceof Error ? reason : new Error(String(reason))
  console.error(error.stack ?? error)
  process.exit(1)
})

process.on('uncaughtException', (error) => {
  console.error(error.stack ?? error)
  process.exit(1)
})

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

function truncateEvidence(evidence: string): string {
  return evidence.length > 80 ? `${evidence.slice(0, 77)}...` : evidence
}

function pad(value: string, width: number): string {
  if (value.length >= width) {
    return value
  }

  return `${value}${' '.repeat(width - value.length)}`
}

function printRuleTable(result: EngineResult): void {
  const header = [
    pad('rule_id', 18),
    pad('severity', 10),
    pad('status', 8),
    'evidence',
  ].join(' | ')

  const separator = `${'-'.repeat(18)}-|-${'-'.repeat(10)}-|-${'-'.repeat(8)}-|-${'-'.repeat(80)}`

  console.log('Rule results:')
  console.log(header)
  console.log(separator)

  for (const rule of result.rules) {
    console.log(
      [
        pad(rule.rule_id, 18),
        pad(rule.severity, 10),
        pad(rule.status, 8),
        truncateEvidence(rule.evidence),
      ].join(' | '),
    )
  }
}

async function fetchCrawlText(url: string): Promise<string | null> {
  const crawlUrl = `https://r.jina.ai/${url}`
  const response = await fetch(crawlUrl)

  if (!response.ok) {
    console.error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`)
    return null
  }

  return response.text()
}

async function main(): Promise<void> {
  const supabase = createClient(
    requireEnv('NEXT_PUBLIC_SUPABASE_URL', SUPABASE_URL),
    requireEnv('SUPABASE_SERVICE_ROLE_KEY', SUPABASE_SERVICE_ROLE_KEY),
  )

  const resultsByUrl = new Map<string, EngineResult>()

  for (const url of TEST_URLS) {
    const responseText = await fetchCrawlText(url)

    if (responseText === null) {
      continue
    }

    const result1 = runRuleEngine(responseText, 'klarna')

    console.log('')
    console.log(`URL: ${url}`)
    console.log(`Word count: ${result1.crawl_word_count}`)
    console.log(`Score: ${result1.score}/100`)
    console.log(`BNPL detected: ${result1.bnpl_detected}`)
    printRuleTable(result1)

    const result2 = runRuleEngine(responseText, 'klarna')

    if (
      result1.score !== result2.score ||
      JSON.stringify(result1.rules) !== JSON.stringify(result2.rules)
    ) {
      throw new Error(`DETERMINISM FAILURE on ${url}`)
    }

    console.log(`✓ Determinism confirmed for ${url}`)
    resultsByUrl.set(url, result1)
  }

  const firstUrl = TEST_URLS[0]
  const firstResult = resultsByUrl.get(firstUrl)

  if (!firstResult) {
    throw new Error(`Cannot write Supabase test row because no audit result was produced for ${firstUrl}`)
  }

  const { data, error } = await supabase
    .from('audits')
    .insert({
      email: 'test@clearpayaudit.test',
      url: firstUrl,
      bnpl_provider: 'klarna',
      payment_status: 'pending',
      status: 'done',
      audit_result: firstResult,
      score: firstResult.score,
    })
    .select('id')
    .single()

  if (error) {
    throw error
  }

  console.log(`✓ Supabase write confirmed. Audit ID: ${data.id}`)
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error : error)
  process.exit(1)
})
