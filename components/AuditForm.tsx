'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const providerOptions = [
  { label: 'Klarna', value: 'klarna' },
  { label: 'Clearpay', value: 'clearpay' },
  { label: 'PayPal Pay in 3', value: 'paypal' },
  { label: 'Other', value: 'other' },
] as const

export default function AuditForm() {
  const router = useRouter()
  const [url, setUrl] = useState('')
  const [provider, setProvider] = useState('klarna')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/create-audit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, bnpl_provider: provider, email }),
      })

      const data = (await response.json()) as {
        audit_id?: string
        error?: string
      }

      if (!response.ok || !data.audit_id) {
        setError(data.error ?? 'Something went wrong')
        return
      }

      router.push(`/processing/${data.audit_id}`)
    } catch {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-lg rounded-xl bg-white p-8 text-left shadow-xl">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="audit-url"
          >
            Checkout or product page URL
          </label>
          <input
            id="audit-url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://mystore.co.uk/products/example"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="audit-provider"
          >
            BNPL Provider
          </label>
          <select
            id="audit-provider"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          >
            {providerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            className="text-sm font-medium text-slate-700"
            htmlFor="audit-email"
          >
            Your email address
          </label>
          <input
            id="audit-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="merchant@yourstore.co.uk"
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-700 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-blue-700 py-4 text-base font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-blue-500"
        >
          {loading ? (
            <>
              <span
                className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"
                aria-hidden="true"
              />
              <span>Running Audit...</span>
            </>
          ) : (
            'Run Compliance Audit →'
          )}
        </button>

        {error ? (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </div>
  )
}
