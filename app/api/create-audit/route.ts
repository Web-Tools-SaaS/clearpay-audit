export const runtime = 'edge'

import { NextRequest, NextResponse, after } from 'next/server'
import { runRuleEngine } from '@/lib/rule-engine/index'
import { getSupabaseServiceClient } from '@/lib/supabase'

const VALID_PROVIDERS = ['klarna', 'clearpay', 'paypal', 'other'] as const

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function isValidProvider(
  provider: string
): provider is (typeof VALID_PROVIDERS)[number] {
  return VALID_PROVIDERS.includes(provider as (typeof VALID_PROVIDERS)[number])
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, url, bnpl_provider } = body

    if (
      !isNonEmptyString(email) ||
      !isNonEmptyString(url) ||
      !isNonEmptyString(bnpl_provider) ||
      !url.startsWith('https://') ||
      !isValidProvider(bnpl_provider) ||
      !isValidEmail(email)
    ) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()
    const { data, error } = await supabase
      .from('audits')
      .insert({
        email,
        url,
        bnpl_provider,
        payment_status: 'paid',
        status: 'processing',
        crawl_status: 'ok',
        crawl_method: 'jina',
      })
      .select('id')
      .single()

    if (error || !data) {
      return NextResponse.json(
        { error: 'Failed to create audit' },
        { status: 500 }
      )
    }

    after(runAuditPipeline(data.id))

    return NextResponse.json({
      audit_id: data.id,
    })
  } catch {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}

async function runAuditPipeline(auditId: string): Promise<void> {
  try {
    const supabase = getSupabaseServiceClient()
    const { data: audit } = await supabase
      .from('audits')
      .select('*')
      .eq('id', auditId)
      .single()

    if (!audit) {
      throw new Error('Audit not found')
    }

    const jinaUrl = `https://r.jina.ai/${audit.url}`
    const crawlRes = await fetch(jinaUrl, {
      headers: {
        Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        Accept: 'text/plain',
      },
    })

    if (!crawlRes.ok) {
      throw new Error(`Jina crawl failed: ${crawlRes.status}`)
    }

    const crawlText = await crawlRes.text()
    const wc = crawlText.trim().split(/\s+/).length

    if (wc < 400) {
      await supabase
        .from('audits')
        .update({
          status: 'needs_input',
          crawl_status: 'cart_gated',
          crawl_content: crawlText,
        })
        .eq('id', auditId)
      return
    }

    const auditResult = runRuleEngine(crawlText, audit.bnpl_provider)

    await supabase
      .from('audits')
      .update({
        status: 'done',
        crawl_content: crawlText,
        crawl_status: 'ok',
        audit_result: auditResult,
        score: auditResult.score,
      })
      .eq('id', auditId)
  } catch (err) {
    const supabase = getSupabaseServiceClient()
    await supabase
      .from('audits')
      .update({
        status: 'error',
        error_message: err instanceof Error ? err.message : String(err),
      })
      .eq('id', auditId)
  }
}
