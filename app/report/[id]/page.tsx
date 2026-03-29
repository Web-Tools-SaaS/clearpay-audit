export const runtime = 'edge'

import { notFound } from 'next/navigation'
import { getSupabaseServiceClient } from '@/lib/supabase'
import type { AuditResult } from '@/lib/rule-engine/types'
import PlaceholderPDFButton from '@/components/report/PlaceholderPDFButton'
import RuleAccordion from '@/components/report/RuleAccordion'
import WaitlistForm from '@/components/report/WaitlistForm'

type Roadmap = {
  this_week: string[]
  this_month: string[]
  before_deadline: string[]
}

type ReportPageProps = {
  params: Promise<{ id: string }>
}

function getScoreTone(score: number) {
  if (score >= 80) {
    return {
      color: '#22C55E',
      label: 'COMPLIANT',
      borderColor: '#22C55E',
    }
  }

  if (score >= 60) {
    return {
      color: '#F59E0B',
      label: 'AMBER — ACTION REQUIRED',
      borderColor: '#F59E0B',
    }
  }

  return {
    color: '#EF4444',
    label: 'NON-COMPLIANT — IMMEDIATE ACTION',
    borderColor: '#EF4444',
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
  const roadmap = (result as AuditResult & { roadmap?: Partial<Roadmap> }).roadmap
  const score = audit.score ?? result.score ?? 0
  const passedCount = result.rules.filter((rule) => rule.status === 'PASS').length
  const failedCount = result.rules.filter((rule) => rule.status === 'FAIL').length
  const unclearCount = result.rules.filter((rule) => rule.status === 'UNCLEAR').length
  const scoreTone = getScoreTone(score)
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'long',
  }).format(new Date(audit.created_at))

  const scoreBarWidth = `${score}%`
  const dpc001 = result.rules.find((rule) => rule.rule_id === 'DPC-001')
  const showWrongPageWarning = dpc001?.status === 'FAIL' || dpc001?.status === 'UNCLEAR'

  return (
    <div className="min-h-screen bg-[#080808] text-white">

      {/* ── HEADER ── */}
      <header className="border-b border-[#2A2A2A] bg-[#080808]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-6 py-4 sm:px-8 lg:px-12">
          <span className="font-mono text-sm font-semibold uppercase tracking-widest text-white">
            PayLater Audit
          </span>
          <PlaceholderPDFButton />
        </div>
      </header>

      {showWrongPageWarning && (
        <div className="border-b border-[#F59E0B] bg-[#0F0F0F]">
          <div className="mx-auto flex w-full max-w-7xl items-start gap-4 px-6 py-4 sm:px-8 lg:px-12">
            <span className="font-mono text-sm text-[#F59E0B] font-bold shrink-0">[!]</span>
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-widest text-[#F59E0B]">
                No BNPL provider detected on this page
              </p>
              <p className="mt-1 text-xs leading-5 text-[#A1A1A1]">
                This audit did not find Klarna, PayLater, or any BNPL provider on the submitted URL.
                If your store uses BNPL, you may have submitted your homepage, search results, or
                order confirmation page. Re-run the audit using your product page or cart URL where
                the Klarna or PayLater widget appears.
              </p>
            </div>
          </div>
        </div>
      )}

      <main>

        {/* ── SCORE HERO ── */}
        <section className="bg-[#080808] border-b border-[#2A2A2A]">
          <div className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-14 sm:px-8 lg:grid-cols-[1fr_320px] lg:px-12 lg:py-20">

            {/* Meta */}
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="border border-[#3A3A3A] px-3 py-1 font-mono text-[11px] text-[#A1A1A1] truncate max-w-full">
                  {audit.url}
                </span>
                <span className="border border-[#3A3A3A] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1]">
                  {audit.bnpl_provider || result.provider}
                </span>
              </div>
              <p className="font-mono text-[11px] text-[#6B6B6B] uppercase tracking-widest">
                Audit completed {formattedDate}
              </p>
              <h1 className="mt-4 max-w-3xl text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                FCA BNPL Compliance Report
              </h1>
              <p className="mt-4 max-w-2xl text-xs leading-6 text-[#A1A1A1]">
                {result.summary}
              </p>

              {/* Stats row */}
              <div className="mt-8 flex flex-wrap gap-6">
                <div className="border-l-2 border-[#22C55E] pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Passed</p>
                  <p className="font-mono text-xl font-bold text-[#22C55E]">{passedCount}</p>
                </div>
                <div className="border-l-2 border-[#EF4444] pl-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Failed</p>
                  <p className="font-mono text-xl font-bold text-[#EF4444]">{failedCount}</p>
                </div>
                {unclearCount > 0 && (
                  <div className="border-l-2 border-[#6B6B6B] pl-3">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Unclear</p>
                    <p className="font-mono text-xl font-bold text-[#6B6B6B]">{unclearCount}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Score panel */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="border bg-[#0F0F0F] p-8 w-full max-w-[300px] flex flex-col"
                style={{ borderColor: scoreTone.borderColor, borderLeftWidth: '4px' }}
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#A1A1A1] mb-4">
                  COMPLIANCE SCORE
                </p>
                <p
                  className="font-mono text-7xl font-bold leading-none"
                  style={{ color: scoreTone.color }}
                >
                  {score}
                </p>
                <p className="font-mono text-sm text-[#6B6B6B] mt-1">/ 100</p>

                {/* Score bar */}
                <div className="mt-5 h-1 w-full bg-[#2A2A2A]">
                  <div
                    className="h-1"
                    style={{ width: scoreBarWidth, backgroundColor: scoreTone.color }}
                  />
                </div>

                <p
                  className="mt-3 font-mono text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: scoreTone.color }}
                >
                  {scoreTone.label}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── REMEDIATION ROADMAP ── */}
        <section className="bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="max-w-3xl mb-10">
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Remediation Roadmap
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#A1A1A1]">
                Fixes grouped by urgency. Complete CRITICAL issues before launch. HIGH issues must be resolved before 15 July 2026. MEDIUM issues are good-practice disclosures required under the Consumer Duty.
              </p>
            </div>

            <div className="space-y-6">

              {roadmap?.this_week && roadmap.this_week.length > 0 && (
                <div className="border border-[#EF4444]">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#0F0F0F] px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 bg-[#EF4444] block" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[#EF4444] font-semibold">
                        Fix This Week — CRITICAL
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#EF4444]">
                      {roadmap.this_week.length} issue{roadmap.this_week.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-[#2A2A2A]">
                    {roadmap.this_week.map((fix, index) => (
                      <div key={`crit-${index}`} className="flex items-start gap-5 bg-[#080808] p-5">
                        <span className="font-mono text-xs font-bold text-[#EF4444] shrink-0 mt-0.5">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <p className="text-xs leading-6 text-[#A1A1A1]">{fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roadmap?.this_month && roadmap.this_month.length > 0 && (
                <div className="border border-[#F59E0B]">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#0F0F0F] px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 bg-[#F59E0B] block" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[#F59E0B] font-semibold">
                        Fix This Month — HIGH
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#F59E0B]">
                      {roadmap.this_month.length} issue{roadmap.this_month.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-[#2A2A2A]">
                    {roadmap.this_month.map((fix, index) => (
                      <div key={`high-${index}`} className="flex items-start gap-5 bg-[#080808] p-5">
                        <span className="font-mono text-xs font-bold text-[#F59E0B] shrink-0 mt-0.5">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <p className="text-xs leading-6 text-[#A1A1A1]">{fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {roadmap?.before_deadline && roadmap.before_deadline.length > 0 && (
                <div className="border border-[#3B82F6]">
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] bg-[#0F0F0F] px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-1.5 w-1.5 bg-[#3B82F6] block" />
                      <span className="font-mono text-[11px] uppercase tracking-widest text-[#3B82F6] font-semibold">
                        Before 15 July 2026 — MEDIUM
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-[#3B82F6]">
                      {roadmap.before_deadline.length} issue{roadmap.before_deadline.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="divide-y divide-[#2A2A2A]">
                    {roadmap.before_deadline.map((fix, index) => (
                      <div key={`med-${index}`} className="flex items-start gap-5 bg-[#080808] p-5">
                        <span className="font-mono text-xs font-bold text-[#3B82F6] shrink-0 mt-0.5">
                          [{String(index + 1).padStart(2, '0')}]
                        </span>
                        <p className="text-xs leading-6 text-[#A1A1A1]">{fix}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {(!roadmap?.this_week || roadmap.this_week.length === 0) &&
              (!roadmap?.this_month || roadmap.this_month.length === 0) &&
              (!roadmap?.before_deadline || roadmap.before_deadline.length === 0) && (
                <div className="border border-[#22C55E] bg-[#080808] p-6">
                  <p className="font-mono text-xs text-[#22C55E]">
                    [OK] No remediation required. All 17 FCA PS26/1 checks passed.
                  </p>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ── FULL RULE RESULTS ── */}
        <section className="bg-[#080808] border-b border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                  {/* RULE-BY-RULE REVIEW */}
                </p>
                <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                  Full Compliance Check Results
                </h2>
              </div>
              <div className="flex gap-4 font-mono text-[11px]">
                <span className="text-[#22C55E] uppercase tracking-widest">
                  PASS: {passedCount}
                </span>
                <span className="text-[#6B6B6B]">│</span>
                <span className="text-[#EF4444] uppercase tracking-widest">
                  FAIL: {failedCount}
                </span>
                {unclearCount > 0 && (
                  <>
                    <span className="text-[#6B6B6B]">│</span>
                    <span className="text-[#6B6B6B] uppercase tracking-widest">
                      UNCLEAR: {unclearCount}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Ledger header row */}
            <div className="border-b border-[#3A3A3A] pb-2 hidden sm:grid sm:grid-cols-[180px_1fr_100px_90px] gap-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Rule ID</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Category</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Severity</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B]">Status</span>
            </div>

            <div className="space-y-0">
              {result.rules.map((rule) => (
                <RuleAccordion key={rule.rule_id} rule={rule} />
              ))}
            </div>
          </div>
        </section>

        {/* ── FCA SOURCES ── */}
        <section className="bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <div className="mx-auto w-full max-w-7xl px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
            <div className="max-w-3xl mb-10">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                {/* FCA REFERENCES */}
              </p>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
                Official FCA Sources
              </h2>
            </div>
            <div className="divide-y divide-[#2A2A2A] border border-[#2A2A2A]">
              {result.sources.map((source) => (
                <article
                  key={source.url}
                  className="bg-[#080808] p-6"
                >
                  <h3 className="font-mono text-xs font-semibold uppercase tracking-wide text-white">
                    {source.title}
                  </h3>
                  <p className="mt-2 text-xs leading-5 text-[#A1A1A1]">
                    {source.description}
                  </p>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex font-mono text-[11px] text-[#A1A1A1] underline underline-offset-4 decoration-[#3A3A3A] transition hover:text-white"
                  >
                    View source →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCLAIMER ── */}
        <section className="bg-[#080808] border-b border-[#2A2A2A]">
          <div className="mx-auto max-w-3xl px-6 py-8 sm:px-8 lg:py-10">
            <p className="font-mono text-[11px] leading-6 text-[#6B6B6B]">
              This report is produced by an automated rule-matching engine that searches page content for the
              presence or absence of specific text strings required by FCA PS26/1 (Deferred Payment Credit
              regulation, effective 15 July 2026). This report does NOT constitute legal advice. It is an
              informational compliance checklist tool only. PayLater Audit is not authorised or regulated by the FCA.
            </p>
          </div>
        </section>

        {/* ── WAITLIST ── */}
        <section className="bg-[#0F0F0F] border-b border-[#2A2A2A]">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-14 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12 lg:py-16">
            <div className="max-w-2xl">
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#A1A1A1]">
                {/* ONGOING MONITORING */}
              </p>
              <h2 className="mt-3 text-xl font-bold uppercase tracking-tight text-white sm:text-2xl">
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
