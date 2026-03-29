'use client'

import { useState } from 'react'
import type { AuditResult } from '@/lib/rule-engine/types'

interface PDFButtonProps {
  auditResult: AuditResult
  auditUrl: string
  bnplProvider: string
  createdAt: string
  score: number
  auditId: string
  isUnlocked: boolean
}

export default function PlaceholderPDFButton({
  auditResult,
  auditUrl,
  bnplProvider,
  createdAt,
  score,
  auditId,
  isUnlocked,
}: PDFButtonProps) {
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleDownload() {
    setGenerating(true)
    setError(null)

    try {
      const { generatePdf } = await import('@/lib/generate-pdf')
      const doc = generatePdf(auditResult, {
        auditUrl,
        bnplProvider,
        createdAt,
        score,
        auditId,
      })
      doc.save(`paylater-audit-${auditId.slice(0, 8)}.pdf`)
    } catch (err) {
      setError('Could not generate PDF. Please try again.')
      console.error('[PDF generation error]', err)
    } finally {
      setGenerating(false)
    }
  }

  // Future payment gate: when isUnlocked is false, show a CTA instead.
  // Right now isUnlocked is always true (see lib/pdf-access.ts).
  if (!isUnlocked) {
    return (
      <button
        type="button"
        className="border border-[#F59E0B] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] transition hover:bg-[#F59E0B] hover:text-black"
      >
        Unlock PDF Report →
      </button>
    )
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => void handleDownload()}
        disabled={generating}
        className="flex items-center gap-2 border border-[#3A3A3A] px-4 py-2 font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1] transition hover:border-white hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {generating ? (
          <>
            <span
              className="h-3 w-3 animate-spin border border-[#3A3A3A] border-t-white"
              aria-hidden="true"
            />
            <span>Generating...</span>
          </>
        ) : (
          'Download PDF Report'
        )}
      </button>
      {error ? (
        <p className="font-mono text-[10px] text-[#EF4444]">{error}</p>
      ) : null}
    </div>
  )
}
