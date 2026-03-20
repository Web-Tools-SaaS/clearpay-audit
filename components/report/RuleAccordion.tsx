'use client'

import { useState } from 'react'
import type { RuleCheckResult } from '@/lib/rule-engine/types'

type RuleAccordionProps = {
  rule: RuleCheckResult
}

const severityClasses = {
  CRITICAL: 'border-[#EF4444] text-[#EF4444]',
  HIGH: 'border-[#F59E0B] text-[#F59E0B]',
  MEDIUM: 'border-[#3B82F6] text-[#3B82F6]',
} as const

const statusClasses = {
  PASS: 'border-[#22C55E] text-[#22C55E]',
  FAIL: 'border-[#EF4444] text-[#EF4444]',
  UNCLEAR: 'border-[#6B6B6B] text-[#6B6B6B]',
} as const

const statusDot = {
  PASS: 'bg-[#22C55E]',
  FAIL: 'bg-[#EF4444]',
  UNCLEAR: 'bg-[#6B6B6B]',
} as const

export default function RuleAccordion({ rule }: RuleAccordionProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article className="border-b border-[#2A2A2A] bg-[#080808]">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full flex-col gap-3 px-4 py-4 text-left transition hover:bg-[#0F0F0F] sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        aria-expanded={expanded}
      >
        {/* Left: ID + Category */}
        <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 flex-1 min-w-0">
          <span className="font-mono text-xs font-semibold tracking-wider text-white w-[180px] shrink-0">
            {rule.rule_id}
          </span>
          <span className="font-mono text-[11px] text-[#A1A1A1] truncate">
            {rule.category}
          </span>
        </div>

        {/* Right: Severity + Status + Toggle */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <span
            className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest ${severityClasses[rule.severity]}`}
          >
            {rule.severity}
          </span>
          <span
            className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5 ${statusClasses[rule.status]}`}
          >
            <span className={`h-1.5 w-1.5 block ${statusDot[rule.status]}`} />
            {rule.status}
          </span>
          <span className="font-mono text-[11px] text-[#6B6B6B]">
            {expanded ? '▲ hide' : '▼ view'}
          </span>
        </div>
      </button>

      {expanded ? (
        <div className="border-t border-[#2A2A2A] bg-[#0F0F0F] px-4 py-5">
          <div className="grid gap-5">

            {/* Requirement */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2">
                REQUIREMENT
              </p>
              <p className="text-xs leading-6 text-[#A1A1A1]">{rule.requirement}</p>
            </div>

            {/* Evidence */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2">
                EVIDENCE
              </p>
              <pre className="overflow-x-auto border border-[#2A2A2A] bg-[#080808] p-4 font-mono text-[11px] leading-5 text-[#A1A1A1] whitespace-pre-wrap">
                {rule.evidence}
              </pre>
            </div>

            {/* FCA Source */}
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#6B6B6B] mb-2">
                FCA SOURCE
              </p>
              <a
                href={rule.fca_url}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-[11px] text-[#A1A1A1] underline underline-offset-4 decoration-[#3A3A3A] transition hover:text-white"
              >
                {rule.fca_source}
              </a>
            </div>

            {/* Fix Suggestion */}
            {rule.status === 'FAIL' && rule.fix_suggestion ? (
              <div className="border-l-2 border-[#F59E0B] pl-4 bg-[#080808] py-4 pr-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#F59E0B] mb-2">
                  FIX SUGGESTION
                </p>
                <p className="text-xs leading-6 text-[#A1A1A1]">
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
