'use client'

export const runtime = 'edge'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type AuditStatus = {
  id: string
  status: 'queued' | 'processing' | 'needs_input' | 'done' | 'error'
  score: number | null
  crawl_status: string | null
  audit_result: unknown
  error_message?: string | null
}

const processingSteps = [
  'Crawling your page',
  'Running 17 FCA PS26/1 compliance checks',
  'Compiling your report',
] as const

export default function ProcessingPage() {
  const [status, setStatus] = useState<AuditStatus | null>(null)
  const [extraUrls, setExtraUrls] = useState(['', '', ''])
  const [submitting, setSubmitting] = useState(false)
  const [extraError, setExtraError] = useState<string | null>(null)
  const [stepIndex, setStepIndex] = useState(0)
  const [pollingEnabled, setPollingEnabled] = useState(true)
  const params = useParams()
  const id = params.id as string
  const router = useRouter()

  useEffect(() => {
    const interval = window.setInterval(() => {
      setStepIndex((current) => (current + 1) % processingSteps.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!id || !pollingEnabled) {
      return
    }

    let cancelled = false

    const pollStatus = async () => {
      try {
        const response = await fetch(`/api/audit/${id}`, {
          cache: 'no-store',
        })

        const data = (await response.json()) as AuditStatus & { error?: string }

        if (!response.ok) {
          throw new Error(data.error ?? 'Unable to load audit status')
        }

        if (cancelled) {
          return
        }

        setStatus(data)
        setExtraError(null)

        if (data.status === 'done') {
          setPollingEnabled(false)
          router.push(`/report/${id}`)
          return
        }

        if (data.status === 'error' || data.status === 'needs_input') {
          setPollingEnabled(false)
        }
      } catch (error) {
        if (cancelled) {
          return
        }

        setStatus((current) => ({
          id,
          status: 'error',
          score: current?.score ?? null,
          crawl_status: current?.crawl_status ?? null,
          audit_result: current?.audit_result ?? null,
          error_message:
            error instanceof Error ? error.message : 'Unable to load audit status',
        }))
        setPollingEnabled(false)
      }
    }

    void pollStatus()
    const interval = window.setInterval(() => {
      void pollStatus()
    }, 5000)

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [id, pollingEnabled, router])

  const visibleInputCount = useMemo(() => {
    const lastFilledIndex = extraUrls.reduce(
      (latest, value, index) => (value.trim() ? index : latest),
      -1
    )

    return Math.min(3, Math.max(1, lastFilledIndex + 2))
  }, [extraUrls])

  function handleExtraUrlChange(index: number, value: string) {
    setExtraUrls((current) => {
      const next = [...current]
      next[index] = value
      return next
    })
  }

  async function handleExtraSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const urls = extraUrls.map((url) => url.trim()).filter(Boolean)

    if (urls.length === 0) {
      setExtraError('Please add at least one URL to continue the audit.')
      return
    }

    if (urls.some((url) => !url.startsWith('https://'))) {
      setExtraError('Each URL must start with https://')
      return
    }

    setSubmitting(true)
    setExtraError(null)

    try {
      const response = await fetch(`/api/audit/${id}/submit-extra`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls }),
      })

      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to continue the audit')
      }

      setStatus((current) =>
        current
          ? { ...current, status: 'processing', error_message: null }
          : {
              id,
              status: 'processing',
              score: null,
              crawl_status: null,
              audit_result: null,
              error_message: null,
            }
      )
      setPollingEnabled(true)
    } catch (error) {
      setExtraError(
        error instanceof Error ? error.message : 'Unable to continue the audit'
      )
    } finally {
      setSubmitting(false)
    }
  }

  /* ── LOADING ── */
  if (
    status === null ||
    status.status === 'queued' ||
    status.status === 'processing'
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 py-16">
        <div className="mx-auto flex max-w-lg flex-col items-center text-center">

          {/* Terminal-style spinner */}
          <div className="border border-[#3A3A3A] bg-[#0F0F0F] px-8 py-6 w-full max-w-sm">
            <div className="flex items-center gap-3 border-b border-[#2A2A2A] pb-4 mb-6">
              <span className="h-2 w-2 bg-[#EF4444] block" />
              <span className="h-2 w-2 bg-[#F59E0B] block" />
              <span className="h-2 w-2 bg-[#22C55E] block" />
              <span className="font-mono text-[11px] text-[#6B6B6B] ml-2">audit.process</span>
            </div>
            <div className="space-y-2 text-left">
              <p className="font-mono text-xs text-[#A1A1A1]">
                <span className="text-[#22C55E]">$</span> run --rules=17 --engine=ps26-1
              </p>
              <p className="font-mono text-xs text-white flex items-center gap-2">
                <span
                  className="inline-block h-3 w-3 animate-spin border border-[#3A3A3A] border-t-white"
                  aria-hidden="true"
                />
                {processingSteps[stepIndex]}...
              </p>
            </div>
          </div>

          <p className="mt-6 font-mono text-xs text-[#6B6B6B] uppercase tracking-widest">
            Estimated time: 20–45 seconds
          </p>
        </div>
      </main>
    )
  }

  /* ── NEEDS INPUT ── */
  if (status.status === 'needs_input') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 py-16">
        <div className="mx-auto w-full max-w-lg border border-[#3A3A3A] bg-[#0F0F0F] p-8">

          <div className="border-b border-[#2A2A2A] pb-6 mb-6">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#F59E0B]">
              // ADDITIONAL INPUT REQUIRED
            </p>
            <h1 className="mt-3 font-mono text-base font-semibold uppercase tracking-wide text-white">
              Page content insufficient
            </h1>
            <p className="mt-3 text-xs leading-6 text-[#A1A1A1]">
              Your checkout page showed limited content — this is common with Shopify stores
              that require items in the cart. Please provide your product page or cart page
              URLs so we can complete the audit.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleExtraSubmit}>
            {extraUrls.slice(0, visibleInputCount).map((url, index) => (
              <div className="space-y-1.5" key={`extra-url-${index}`}>
                <label
                  className="block font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]"
                  htmlFor={`extra-url-${index}`}
                >
                  {index === 0
                    ? 'Product or cart page URL'
                    : `Additional URL ${String(index + 1).padStart(2, '0')}`}
                </label>
                <input
                  id={`extra-url-${index}`}
                  type="url"
                  value={url}
                  onChange={(event) =>
                    handleExtraUrlChange(index, event.target.value)
                  }
                  placeholder="https://mystore.co.uk/cart"
                  className="w-full border border-[#3A3A3A] bg-[#080808] px-4 py-3 font-mono text-xs text-white placeholder-[#6B6B6B] outline-none transition focus:border-white"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 border border-white bg-white px-4 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#E5E5E5] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span
                    className="h-4 w-4 animate-spin border border-black/20 border-t-black"
                    aria-hidden="true"
                  />
                  <span>Processing...</span>
                </>
              ) : (
                'Continue Audit →'
              )}
            </button>

            {extraError ? (
              <p className="font-mono text-[11px] text-[#EF4444]" role="alert">
                [ERROR] {extraError}
              </p>
            ) : null}
          </form>
        </div>
      </main>
    )
  }

  /* ── ERROR ── */
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#080808] px-6 py-16">
      <div className="mx-auto w-full max-w-lg border border-[#EF4444] bg-[#0F0F0F] p-8">
        <div className="flex items-start gap-4 border-b border-[#2A2A2A] pb-6 mb-6">
          <span className="font-mono text-sm text-[#EF4444] font-bold shrink-0">[!]</span>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#EF4444]">
              // AUDIT FAILED
            </p>
            <h1 className="mt-2 font-mono text-base font-semibold uppercase tracking-wide text-white">
              Something went wrong
            </h1>
            <p className="mt-2 text-xs leading-6 text-[#A1A1A1]">
              {status.error_message ?? 'We could not complete your audit right now.'}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="flex w-full items-center justify-center border border-white bg-white px-4 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#E5E5E5]"
          >
            Try Again →
          </button>
          <a
            className="text-center font-mono text-[11px] text-[#A1A1A1] underline underline-offset-4 decoration-[#3A3A3A] transition hover:text-white"
            href="mailto:support@clearpayaudit.com"
          >
            Contact support
          </a>
        </div>
      </div>
    </main>
  )
                }
