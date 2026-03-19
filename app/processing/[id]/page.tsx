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
  'Running 14 FCA compliance checks',
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
          ? {
              ...current,
              status: 'processing',
              error_message: null,
            }
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

  if (
    status === null ||
    status.status === 'queued' ||
    status.status === 'processing'
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-16 text-center text-white">
        <div className="mx-auto flex max-w-xl flex-col items-center">
          <span
            className="h-20 w-20 animate-spin rounded-full border-4 border-white/20 border-t-white"
            aria-hidden="true"
          />
          <h1 className="mt-8 text-3xl font-bold tracking-tight sm:text-4xl">
            Auditing your checkout...
          </h1>
          <p className="mt-4 text-lg text-slate-300">{processingSteps[stepIndex]}</p>
          <p className="mt-3 text-sm text-slate-400">
            This usually takes 20–45 seconds
          </p>
        </div>
      </main>
    )
  }

  if (status.status === 'needs_input') {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-16">
        <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 shadow-lg">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            We need a bit more information
          </h1>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            Your checkout page showed limited content — this is common with
            Shopify stores that require items in the cart. Please provide your
            product page or cart page URLs so we can complete the audit.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleExtraSubmit}>
            {extraUrls.slice(0, visibleInputCount).map((url, index) => (
              <div className="space-y-2" key={`extra-url-${index}`}>
                <label
                  className="text-sm font-medium text-slate-700"
                  htmlFor={`extra-url-${index}`}
                >
                  {index === 0
                    ? 'Product or cart page URL'
                    : `Additional URL ${index + 1}`}
                </label>
                <input
                  id={`extra-url-${index}`}
                  type="url"
                  value={url}
                  onChange={(event) =>
                    handleExtraUrlChange(index, event.target.value)
                  }
                  placeholder="https://mystore.co.uk/cart"
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
                />
              </div>
            ))}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-700 py-4 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500"
            >
              {submitting ? (
                <>
                  <span
                    className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                    aria-hidden="true"
                  />
                  <span>Continuing Audit...</span>
                </>
              ) : (
                'Continue Audit'
              )}
            </button>

            {extraError ? (
              <p className="text-sm text-red-600" role="alert">
                {extraError}
              </p>
            ) : null}
          </form>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-900 px-6 py-16">
      <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-lg">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-2xl text-red-600">
          !
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">
          Something went wrong
        </h1>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          {status.error_message ?? 'We could not complete your audit right now.'}
        </p>
        <a
          className="mt-6 inline-flex text-sm font-semibold text-blue-700 transition hover:text-blue-800"
          href="mailto:support@clearpayaudit.com"
        >
          Contact support
        </a>
        <div className="mt-8">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="inline-flex w-full items-center justify-center rounded-lg bg-blue-700 py-4 text-base font-semibold text-white transition hover:bg-blue-800"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  )
}
