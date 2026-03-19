export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase'

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  void request

  const { id } = await params

  if (!isNonEmptyString(id)) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const supabase = getSupabaseServiceClient()
  const { data, error } = await supabase
    .from('audits')
    .select('id, status, score, crawl_status, audit_result, error_message')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  return NextResponse.json(data)
}
