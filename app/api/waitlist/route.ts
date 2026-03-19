export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServiceClient } from '@/lib/supabase'

function isValidEmail(email: string): boolean {
  return email.includes('@') && email.includes('.')
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      email?: unknown
      audit_id?: unknown
    }

    if (typeof body.email !== 'string' || !isValidEmail(body.email.trim())) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const email = body.email.trim()
    const auditId =
      typeof body.audit_id === 'string' ? body.audit_id.trim() || null : null

    const supabase = getSupabaseServiceClient()
    const { error } = await supabase.from('waitlist').upsert(
      {
        email,
        audit_id: auditId ?? null,
      },
      {
        onConflict: 'email',
        ignoreDuplicates: true,
      }
    )

    if (error) {
      return NextResponse.json(
        { error: 'Failed to join waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}
