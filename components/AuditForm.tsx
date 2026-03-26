'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const providerOptions = [
  { label: 'Klarna', value: 'klarna' },
  { label: 'PayLater', value: 'clearpay' },
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
    <div className="mx-auto w-full max-w-lg border border-[#3A3A3A] bg-[#0F0F0F] p-8 text-left">
      <form className="space-y-5" onSubmit={handleSubmit}>

        <div className="space-y-1.5">
          <label
            className="block font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]"
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
            className="w-full border border-[#3A3A3A] bg-[#080808] px-4 py-3 font-mono text-xs text-white placeholder-[#6B6B6B] outline-none transition focus:border-white focus:ring-0"
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="block font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]"
            htmlFor="audit-provider"
          >
            BNPL Provider
          </label>
          <select
            id="audit-provider"
            value={provider}
            onChange={(event) => setProvider(event.target.value)}
            className="w-full border border-[#3A3A3A] bg-[#080808] px-4 py-3 font-mono text-xs text-white outline-none transition focus:border-white focus:ring-0 appearance-none cursor-pointer"
          >
            {providerOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label
            className="block font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]"
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
            className="w-full border border-[#3A3A3A] bg-[#080808] px-4 py-3 font-mono text-xs text-white placeholder-[#6B6B6B] outline-none transition focus:border-white focus:ring-0"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 border border-white bg-white px-4 py-4 font-mono text-xs font-semibold uppercase tracking-widest text-black transition hover:bg-[#E5E5E5] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <span
                className="h-4 w-4 animate-spin border border-black/20 border-t-black"
                aria-hidden="true"
              />
              <span>Initializing Audit...</span>
            </>
          ) : (
            'Initialize Audit →'
          )}
        </button>

        {error ? (
          <p className="font-mono text-[11px] text-[#EF4444]" role="alert">
            [ERROR] {error}
          </p>
        ) : null}

      </form>
    </div>
  )
}
