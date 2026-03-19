'use client'

import { useState } from 'react'
import type { RuleCheckResult } from '@/lib/rule-engine/types'

type RuleAccordionProps = {
  rule: RuleCheckResult
}

const severityClasses = {
  CRITICAL: 'bg-red-50 text-red-700 border-red-200',
  HIGH: 'bg-amber-50 text-amber-700 border-amber-200',
  MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
} as const

const statusClasses = {
  PASS: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  FAIL: 'bg-red-50 text-red-700 border-red-200',
  UNCLEAR: 'bg-slate-100 text-slate-700 border-slate-200',
} as const

export default function RuleAccordion({ rule }: RuleAccordionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full flex-col gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
        aria-expanded={expanded}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <span className="text-sm font-bold tracking-[0.16em] text-slate-950">
            {rule.rule_id}
          </span>
          <span className="text-sm text-slate-600">{rule.category}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${severityClasses[rule.severity]}`}
          >
            {rule.severity}
          </span>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] ${statusClasses[rule.status]}`}
          >
            {rule.status}
          </span>
          <span className="text-sm font-medium text-slate-500">
            {expanded ? 'Hide details' : 'View details'}
          </span>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-slate-200 px-5 py-5">
          <div className="grid gap-5">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Requirement
              </h3>
              <p className="mt-2 text-sm leading-7 text-slate-700">{rule.requirement}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                Evidence
              </h3>
              <pre className="mt-2 overflow-x-auto rounded-xl bg-slate-100 p-4 font-mono text-xs leading-6 text-slate-700 whitespace-pre-wrap">
                {rule.evidence}
              </pre>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
                FCA Source
              </h3>
              <a
                href={rule.fca_url}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-semibold text-blue-700 underline decoration-blue-300 underline-offset-4 transition hover:text-blue-800"
              >
                {rule.fca_source}
              </a>
            </div>

            {rule.status === 'FAIL' && rule.fix_suggestion ? (
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-yellow-800">
                  Fix suggestion
                </h3>
                <p className="mt-2 text-sm leading-7 text-yellow-900">
                  {rule.fix_suggestion}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </article>
  )
}
