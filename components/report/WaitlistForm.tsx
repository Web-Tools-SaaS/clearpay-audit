'use client'

import { useState } from 'react'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = (await response.json()) as { message?: string; error?: string }

      if (!response.ok) {
        throw new Error(data.error ?? 'Unable to join the waitlist right now.')
      }

      setStatus('success')
      setEmail('')
      setMessage(data.message ?? 'Confirmed — we will notify you on launch.')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to join the waitlist right now.'
      )
    }
  }

  return (
    <form className="flex flex-col gap-3 sm:flex-row" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="waitlist-email">
        Email address
      </label>
      <input
        id="waitlist-email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="you@store.co.uk"
        required
        className="min-w-0 flex-1 border border-[#3A3A3A] bg-[#080808] px-4 py-3 font-mono text-xs text-white placeholder-[#6B6B6B] outline-none transition focus:border-white"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="border border-white bg-white px-5 py-3 font-mono text-[11px] font-semibold uppercase tracking-widest text-black transition hover:bg-[#E5E5E5] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === 'loading' ? 'Submitting...' : 'Join Waitlist →'}
      </button>

      {message ? (
        <p
          className={`font-mono text-[11px] sm:basis-full ${
            status === 'error' ? 'text-[#EF4444]' : 'text-[#22C55E]'
          }`}
        >
          {status === 'error' ? '[ERROR] ' : '[OK] '}
          {message}
        </p>
      ) : null}
    </form>
  )
}
