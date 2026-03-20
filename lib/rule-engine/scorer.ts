import type { RuleCheckResult, RemediationRoadmap, Severity } from './types';

const MAX_SCORE = 100;
const TOTAL_CHECK_COUNT = 17;

const SEVERITY_WEIGHTS: Record<Severity, number> = {
  CRITICAL: 20,
  HIGH: 10,
  MEDIUM: 5,
};

const SEVERITY_RANK: Record<Severity, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
};

export function calculateScore(results: RuleCheckResult[]): number {
  let score = MAX_SCORE;

  for (const result of results) {
    const deduction = SEVERITY_WEIGHTS[result.severity];

    if (result.status === 'FAIL') {
      score -= deduction;
    }

    if (result.status === 'UNCLEAR') {
      score -= Math.floor(deduction / 2);
    }
  }

  return Math.max(0, score);
}

export function generateSummary(
  results: RuleCheckResult[],
  score: number,
): string {
  const criticalFails = results.filter(
    (result) => result.status === 'FAIL' && result.severity === 'CRITICAL',
  ).length;
  const highFails = results.filter(
    (result) => result.status === 'FAIL' && result.severity === 'HIGH',
  ).length;
  const mediumFails = results.filter(
    (result) => result.status === 'FAIL' && result.severity === 'MEDIUM',
  ).length;
  const failCount = criticalFails + highFails + mediumFails;
  const passingCount = results.filter((result) => result.status === 'PASS').length;

  if (score >= 80) {
    return `Your checkout passes ${passingCount} of ${TOTAL_CHECK_COUNT} FCA compliance checks with a score of ${score}/100. ${failCount} issue(s) require attention before July 15, 2026.`;
  }

  if (score >= 60) {
    return `Your checkout has ${criticalFails} critical and ${highFails} high-priority compliance gaps (score: ${score}/100). Action required before the FCA's July 15, 2026 Regulation Day.`;
  }

  return `Your checkout has significant compliance gaps (${criticalFails} critical failures, score: ${score}/100). Immediate remediation is required — non-compliance after July 15, 2026 may result in regulatory action.`;
}

export function getRoadmap(results: RuleCheckResult[]): RemediationRoadmap {
  const failing = results.filter(
    (result): result is RuleCheckResult & { fix_suggestion: string } =>
      result.status !== 'PASS' && result.fix_suggestion !== null,
  );

  return {
    this_week: failing
      .filter((r) => r.severity === 'CRITICAL')
      .map((r) => r.fix_suggestion),
    this_month: failing
      .filter((r) => r.severity === 'HIGH')
      .map((r) => r.fix_suggestion),
    before_deadline: failing
      .filter((r) => r.severity === 'MEDIUM')
      .map((r) => r.fix_suggestion),
  };
}
