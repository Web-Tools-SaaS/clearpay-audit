export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase'
import { runRuleEngine } from '@/lib/rule-engine/index'

function isValidUrls(value: unknown): value is string[] {
  return (
    Array.isArray(value) &&
    value.length >= 1 &&
    value.length <= 3 &&
    value.every(
      (item) => typeof item === 'string' && item.startsWith('https://')
    )
  )
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const { urls } = await request.json()

    if (!isValidUrls(urls)) {
      return NextResponse.json({ error: 'Invalid urls' }, { status: 400 })
    }

    const supabase = getSupabaseServiceClient()
    const { data: audit, error } = await supabase
      .from('audits')
      .select('id, status, crawl_content')
      .eq('id', id)
      .single()

    if (error || !audit || audit.status !== 'needs_input') {
      return NextResponse.json({ error: 'Invalid audit state' }, { status: 400 })
    }

    await supabase.from('audits').update({ status: 'processing' }).eq('id', id)

    runExtraCrawlPipeline(id, urls, audit.crawl_content ?? '').catch((err) =>
      console.error('Extra crawl error:', err)
    )

    return NextResponse.json({ status: 'processing' })
  } catch {
    return NextResponse.json({ error: 'Invalid urls' }, { status: 400 })
  }
}

async function runExtraCrawlPipeline(
  auditId: string,
  extraUrls: string[],
  existingText: string
): Promise<void> {
  const supabase = getSupabaseServiceClient()

  try {
    let allExtraText = ''

    for (const url of extraUrls) {
      const response = await fetch(`https://r.jina.ai/${url}`, {
        headers: {
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
          Accept: 'text/plain',
        },
      })

      if (!response.ok) {
        continue
      }

      const pageText = await response.text()
      allExtraText += ` ${pageText}`
    }

    const fullText = `${existingText} ${allExtraText}`
    const wc = fullText.trim().split(/\s+/).length

    if (wc < 400) {
      await supabase
        .from('audits')
        .update({
          status: 'error',
          error_message: 'Insufficient page content after extra URLs submitted',
        })
        .eq('id', auditId)
      return
    }

    const { data: audit, error } = await supabase
      .from('audits')
      .select('bnpl_provider')
      .eq('id', auditId)
      .single()

    if (error || !audit) {
      throw new Error('Audit not found')
    }

    const auditResult = runRuleEngine(fullText, audit.bnpl_provider)

    await supabase
      .from('audits')
      .update({
        status: 'done',
        crawl_content: fullText,
        crawl_status: 'ok',
        extra_urls: extraUrls,
        audit_result: auditResult,
        score: auditResult.score,
      })
      .eq('id', auditId)
  } catch (err) {
    await supabase
      .from('audits')
      .update({
        status: 'error',
        error_message: String(err),
      })
      .eq('id', auditId)
  }
}
