import type { Rule, RuleCheckResult } from './types';

const EVIDENCE_WINDOW_SIZE = 120;
const HALF_EVIDENCE_WINDOW_SIZE = Math.floor(EVIDENCE_WINDOW_SIZE / 2);

// Pages with fewer than this many words are too thin to make a reliable FAIL
// determination — return UNCLEAR instead so the score reflects uncertainty,
// not a confirmed absence. The pipeline triggers 'needs_input' at < 400 words,
// so UNCLEAR will mainly appear in edge cases where extra URLs were submitted
// but still produced thin content.
const UNCLEAR_WORD_THRESHOLD = 200;

export function evaluateRule(
  rule: Rule,
  normalisedText: string,
  wordCount: number,
): RuleCheckResult {
  let matched = false;

  if (rule.search_mode === 'ANY') {
    matched = rule.search_strings.some((searchString) =>
      normalisedText.includes(searchString),
    );
  }

  if (rule.search_mode === 'ALL') {
    matched = rule.search_strings.every((searchString) =>
      normalisedText.includes(searchString),
    );
  }

  const firstMatchedString =
    rule.search_strings.find((searchString) =>
      normalisedText.includes(searchString),
    ) ?? null;

  if (rule.invert === true) {
    matched = !matched;
  }

  const rawStatus = matched === true ? 'PASS' : 'FAIL';

  // If the page is too thin to reliably confirm absence of a required string,
  // downgrade a FAIL to UNCLEAR. Inverted rules (DPC-010) are exempt: finding
  // prohibited language on even a thin page is a valid FAIL.
  const status =
    rawStatus === 'FAIL' && !rule.invert && wordCount < UNCLEAR_WORD_THRESHOLD
      ? 'UNCLEAR'
      : rawStatus;

  let evidence = '';

  if (status === 'PASS' && !rule.invert) {
    const matchingString =
      rule.search_strings.find((searchString) =>
        normalisedText.includes(searchString),
      ) ?? '';
    const matchIndex = normalisedText.indexOf(matchingString);
    const windowStart = Math.max(0, matchIndex - HALF_EVIDENCE_WINDOW_SIZE);
    const windowEnd = Math.min(
      normalisedText.length,
      matchIndex + matchingString.length + HALF_EVIDENCE_WINDOW_SIZE,
    );
    const window = normalisedText.slice(windowStart, windowEnd);

    evidence = `Found: "...${window}..."`;
  }

  if (status === 'PASS' && rule.invert === true) {
    evidence = `None of the prohibited promotional phrases were found in ${wordCount} words of crawled content. Page language is compliant.`;
  }

  if (status === 'FAIL' && !rule.invert) {
    evidence = `Not found: engine searched for [${rule.search_strings.join(', ')}] across ${wordCount} words of crawled content.`;
  }

  if (status === 'FAIL' && rule.invert === true) {
    evidence = `Prohibited language detected: "${firstMatchedString}" — this promotional framing is non-compliant under FCA PS26/1 CONC rules on fair, clear and not misleading communications.`;
  }

  if (status === 'UNCLEAR') {
    evidence = `Page content too short (${wordCount} words) to make a reliable determination. The required string(s) [${rule.search_strings.slice(0, 4).join(', ')}${rule.search_strings.length > 4 ? '...' : ''}] were not found, but the page may not have fully loaded. Submit your product or cart page URL for a complete audit.`;
  }

  return {
    rule_id: rule.id,
    category: rule.category,
    severity: rule.severity,
    status,
    requirement: rule.requirement,
    fca_source: rule.fca_source,
    fca_url: rule.fca_url,
    evidence,
    fix_suggestion: status === 'PASS' ? null : rule.fix_suggestion,
  };
}
