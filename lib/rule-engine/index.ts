import { RULES } from './rules'
import { normaliseText, wordCount } from './normalise'
import { evaluateRule } from './evaluateRule'
import { calculateScore, generateSummary, getRoadmap } from './scorer'
import type { AuditResult, SourceReference } from './types'

const SOURCES: SourceReference[] = [
  {
    title: 'FCA PS26/1',
    url: 'https://www.fca.org.uk/publications/policy-statements/ps26-1-regulation-deferred-payment-credit',
    description: 'Final FCA policy statement covering deferred payment credit regulation and implementation expectations.',
  },
  {
    title: 'FCA CONC Sourcebook',
    url: 'https://www.handbook.fca.org.uk/handbook/CONC/',
    description: 'FCA Conduct of Business Sourcebook covering consumer credit rules and financial promotions standards applicable to DPC lenders.',
  },
  {
    title: 'Amendment Order 2025',
    url: 'https://www.legislation.gov.uk/uksi/2025/855/contents/made',
    description: 'UK statutory instrument amending the legal framework for deferred payment credit regulation.',
  },
  {
    title: 'FCA Register',
    url: 'https://register.fca.org.uk/s/',
    description: 'Official FCA register used to confirm firm authorisation and regulatory status.',
  },
  {
    title: 'Consumer Credit Act 1974 s.66A',
    url: 'https://www.legislation.gov.uk/ukpga/1974/39/section/66A',
    description: 'Statutory section covering pre-contract disclosure requirements relevant to consumer credit.',
  },
]

export function runRuleEngine(rawText: string, provider: string): AuditResult {
  const clean = normaliseText(rawText)
  const wc = wordCount(clean)
  const results = RULES.map((rule) => evaluateRule(rule, clean, wc, provider))
  const score = calculateScore(results)
  const summary = generateSummary(results, score)
  const roadmap = getRoadmap(results)
  const bnpl_detected =
    results.find((result) => result.rule_id === 'DPC-001')?.status === 'PASS'

  return {
    rules: results,
    score,
    bnpl_detected,
    provider,
    crawl_word_count: wc,
    summary,
    roadmap,
    sources: SOURCES,
  }
}
