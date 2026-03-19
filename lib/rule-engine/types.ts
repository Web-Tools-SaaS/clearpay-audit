export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export type RuleResult = 'PASS' | 'FAIL' | 'UNCLEAR';

export interface Rule {
  id: string;
  category: string;
  severity: Severity;
  requirement: string;
  fca_source: string;
  fca_url: string;
  search_strings: string[];
  search_mode: 'ANY' | 'ALL';
  fix_suggestion: string;
  invert?: boolean;
}

export interface RuleCheckResult {
  rule_id: string;
  category: string;
  severity: Severity;
  status: RuleResult;
  requirement: string;
  fca_source: string;
  fca_url: string;
  evidence: string;
  fix_suggestion: string | null;
}

export interface AuditResult {
  rules: RuleCheckResult[];
  score: number;
  bnpl_detected: boolean;
  provider: string;
  crawl_word_count: number;
  summary: string;
  top_3_fixes: string[];
  sources: SourceReference[];
}

export interface SourceReference {
  title: string;
  url: string;
  description: string;
}
