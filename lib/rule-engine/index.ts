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


function mergeProviderResults(
  klarnaResult: AuditResult,
  clearpayResult: AuditResult,
): AuditResult {
  const mergedRules = klarnaResult.rules.map((klarnaRule) => {
    const clearpayRule = clearpayResult.rules.find(
      (r) => r.rule_id === klarnaRule.rule_id,
    )

    if (!clearpayRule) {
      return klarnaRule
    }

    // A rule PASSes if EITHER provider passes
    if (klarnaRule.status === 'PASS' || clearpayRule.status === 'PASS') {
      return { ...klarnaRule, status: 'PASS' as const }
    }

    // Both failed — combine compliant_wording and provider_fix
    const combinedWording = [
      klarnaRule.compliant_wording
        ? `--- FOR KLARNA ---\n${klarnaRule.compliant_wording}`
        : null,
      clearpayRule.compliant_wording
        ? `--- FOR CLEARPAY ---\n${clearpayRule.compliant_wording}`
        : null,
    ]
      .filter(Boolean)
      .join('\n\n')

    const combinedFix = [
      klarnaRule.provider_fix && klarnaRule.provider_fix.length > 0
        ? ['--- KLARNA STEPS ---', ...klarnaRule.provider_fix]
        : null,
      clearpayRule.provider_fix && clearpayRule.provider_fix.length > 0
        ? ['--- CLEARPAY STEPS ---', ...clearpayRule.provider_fix]
        : null,
    ]
      .filter(Boolean)
      .flat() as string[]

    return {
      ...klarnaRule,
      compliant_wording: combinedWording || null,
      provider_fix: combinedFix.length > 0 ? combinedFix : null,
    }
  })

  const score = calculateScore(mergedRules)
  const summary = generateSummary(mergedRules, score)
  const roadmap = getRoadmap(mergedRules)
  const bnpl_detected =
    mergedRules.find((r) => r.rule_id === 'DPC-001')?.status === 'PASS'

  return {
    rules: mergedRules,
    score,
    bnpl_detected,
    provider: 'klarna_clearpay',
    crawl_word_count: klarnaResult.crawl_word_count,
    summary,
    roadmap,
    sources: klarnaResult.sources,
  }
}

export function runRuleEngine(rawText: string, provider: string): AuditResult {
  if (provider === 'klarna_clearpay') {
    const klarnaResult = runRuleEngine(rawText, 'klarna')
    const clearpayResult = runRuleEngine(rawText, 'clearpay')
    return mergeProviderResults(klarnaResult, clearpayResult)
  }

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
