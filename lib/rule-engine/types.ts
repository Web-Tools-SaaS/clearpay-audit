export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM';

export type RuleResult = 'PASS' | 'FAIL' | 'UNCLEAR';

export type RemediationType =
  | 'THEME_SETTING'
  | 'COPY_CHANGE'
  | 'LENDER_CONFIG'
  | 'LINKED_TERMS_ONLY';

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
  remediation_type: RemediationType;
  regulatory_consequence: string | null;
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
  remediation_type: RemediationType;
  regulatory_consequence: string | null;
  compliant_wording: string | null;
  provider_fix: string[] | null;
}

export interface RemediationRoadmap {
  this_week: string[];
  this_month: string[];
  before_deadline: string[];
}

export interface AuditResult {
  rules: RuleCheckResult[];
  score: number;
  bnpl_detected: boolean;
  provider: string;
  crawl_word_count: number;
  summary: string;
  roadmap: RemediationRoadmap;
  top_3_fixes?: string[];
  sources: SourceReference[];
}

export interface SourceReference {
  title: string;
  url: string;
  description: string;
}
