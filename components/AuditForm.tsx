'use client'

import { useState } from 'react'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

const providerOptions = [
  { value: 'clearpay', label: 'Clearpay' },
  { value: 'klarna', label: 'Klarna' },
  { value: 'laybuy', label: 'Laybuy' },
  { value: 'other', label: 'Other BNPL provider' },
] as const

export default function AuditForm() {
  const [url, setUrl] = useState('')
  const [email, setEmail] = useState('')
  const [provider, setProvider] = useState<(typeof providerOptions)[number]['value']>('clearpay')
  const [status, setStatus] = useState<FormState>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/create-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          url,
          bnpl_provider: provider,
        }),
      })

      const data = (await response.json()) as { audit_id?: string; error?: string }

      if (!response.ok || !data.audit_id) {
        throw new Error(data.error || 'Unable to start audit right now.')
      }

      setStatus('success')
      setMessage(`Audit started. Reference: ${data.audit_id}`)
      setUrl('')
      setEmail('')
      setProvider('clearpay')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to start audit right now.'
      )
    }
  }

  return (
    <div className="w-full max-w-3xl rounded-3xl border border-white/10 bg-white p-6 text-left shadow-2xl shadow-slate-950/20 sm:p-8">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 md:grid-cols-[1.6fr_1fr]">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Checkout or product page URL
            </span>
            <input
              type="url"
              name="url"
              inputMode="url"
              autoComplete="url"
              required
              placeholder="https://merchant.co.uk/product"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              BNPL provider
            </span>
            <select
              name="provider"
              value={provider}
              onChange={(event) =>
                setProvider(
                  event.target.value as (typeof providerOptions)[number]['value']
                )
              }
              className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            >
              {providerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-[1.4fr_auto] md:items-end">
          <label className="block">
            <span className="text-sm font-semibold text-slate-800">
              Work email for the PDF report
            </span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="name@merchant.co.uk"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
            />
          </label>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-blue-700 px-6 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {status === 'submitting' ? 'Starting audit...' : 'Start £99 audit'}
          </button>
        </div>
      </form>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          Fixed fee: £99
        </span>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-600">
          FCA clause citations included
        </span>
      </div>

      {message ? (
        <p
          className={`mt-4 rounded-xl px-4 py-3 text-sm ${
            status === 'error'
              ? 'bg-red-50 text-red-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
