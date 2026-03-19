export const runtime = 'edge'

import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase'
import type { AuditResult } from '@/lib/rule-engine/types'
import PlaceholderPDFButton from '@/components/report/PlaceholderPDFButton'
import RuleAccordion from '@/components/report/RuleAccordion'
import WaitlistForm from '@/components/report/WaitlistForm'

type ReportPageProps = {
  params: Promise<{ id: string }>
}

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      color: '#16a34a',
      ringClass: 'ring-emerald-200',
      bgClass: 'bg-emerald-50',
    }
  }

  if (score >= 60) {
    return {
      color: '#d97706',
      ringClass: 'ring-amber-200',
      bgClass: 'bg-amber-50',
    }
  }

  return {
    color: '#dc2626',
    ringClass: 'ring-red-200',
    bgClass: 'bg-red-50',
  }
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params
  const supabase = getSupabaseServiceClient()
  const { data: audit } = await supabase
    .from('audits')
    .select(
      'id, status, score, crawl_status, audit_result, url, bnpl_provider, created_at'
    )
    .eq('id', id)
    .single()

  if (!audit || audit.status !== 'done') {
    notFound()
  }

  const result = audit.audit_result as AuditResult
  const score = audit.score ?? result.score ?? 0
  const passedCount = result.rules.filter((rule) => rule.status === 'PASS').length
  const failedCount = result.rules.filter((rule) => rule.status === 'FAIL').length
  const scoreTone = getScoreTone(score)
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(new Date(audit.created_at))

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="bg-[#0f172a] text-white">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
          <span className="text-lg font-bold tracking-tight sm:text-xl">
            ClearPay Audit
          </span>
          <PlaceholderPDFButton />
        </div>
      </header>

      <main>
        <section className="bg-white">
          <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-14 sm:px-8 lg:grid-cols-[1.1fr_320px] lg:px-12 lg:py-20">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex max-w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                  <span className="truncate">{audit.url}</span>
                </span>
                <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
                  {audit.bnpl_provider || result.provider}
                </span>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-500">
                Audit completed on {formattedDate}
              </p>
              <h1 className="mt-6 max-w-3xl text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                Your FCA BNPL compliance report
              </h1>
              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-600">
                {result.summary}
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div
                className={`flex h-64 w-64 flex-col items-center justify-center rounded-full ${scoreTone.bgClass} ring-8 ${scoreTone.ringClass}`}
                style={{ color: scoreTone.color }}
              >
                <span className="text-6xl font-bold tracking-tight">{score}</span>
                <span className="mt-2 text-lg font-semibold text-slate-500">
                  /100
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-sky-50">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                Priority fixes
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Your top 3 priority actions
              </h2>
            </div>
            <ol className="mt-10 grid gap-4">
              {result.top_3_fixes.map((fix, index) => (
                <li
                  key={`${index + 1}-${fix}`}
                  className="rounded-2xl border border-slate-200 border-l-4 border-l-blue-600 bg-white p-6 shadow-sm"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-950 text-sm font-bold text-white">
                      {index + 1}
                    </span>
                    <p className="pt-1 text-base leading-7 text-slate-700">{fix}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                  Rule-by-rule review
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                  Full compliance check results
                </h2>
              </div>
              <div className="flex gap-3 text-sm font-semibold">
                <span className="rounded-full bg-emerald-50 px-4 py-2 text-emerald-700">
                  {passedCount} passed
                </span>
                <span className="rounded-full bg-red-50 px-4 py-2 text-red-700">
                  {failedCount} failed
                </span>
              </div>
            </div>

            <div className="mt-10 space-y-4">
              {result.rules.map((rule) => (
                <RuleAccordion key={rule.rule_id} rule={rule} />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-slate-100">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-700">
                FCA references
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                Official FCA Sources
              </h2>
            </div>
            <div className="mt-10 grid gap-4 lg:grid-cols-2">
              {result.sources.map((source) => (
                <article
                  key={source.url}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-slate-950">{source.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {source.description}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-800"
                  >
                    Visit source
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white">
          <div className="mx-auto max-w-3xl px-6 py-8 text-sm leading-7 text-slate-500 sm:px-8 lg:py-10">
            This report is produced by an automated rule-matching engine that
            searches page content for the presence or absence of specific text
            strings required by FCA PS26/1 (Deferred Payment Credit regulation,
            effective 15 July 2026). This report does NOT constitute legal
            advice. It is an informational compliance checklist tool only.
            ClearPay Audit is not authorised or regulated by the FCA.
          </div>
        </section>

        <section className="bg-[#0f172a] text-white">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
                Ongoing monitoring
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Get notified when ongoing monitoring is available
              </h2>
            </div>
            <div className="w-full max-w-xl">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
