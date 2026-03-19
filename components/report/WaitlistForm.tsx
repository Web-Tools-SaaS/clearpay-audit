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
      setMessage(data.message ?? 'Thanks — we will let you know when it launches.')
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
        className="min-w-0 flex-1 rounded-lg border border-white/15 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-500"
      >
        {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
      </button>
      {message ? (
        <p
          className={`text-sm ${
            status === 'error' ? 'text-red-300' : 'text-emerald-300'
          } sm:basis-full`}
        >
          {message}
        </p>
      ) : null}
    </form>
  )
}
