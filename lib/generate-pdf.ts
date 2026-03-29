// lib/generate-pdf.ts
// Client-side PDF generation using jsPDF.
// This module is loaded via dynamic import() inside PlaceholderPDFButton
// so jsPDF (~280KB) is never included in the server or edge bundle.
// Do NOT import this file statically from any server component or API route.

import jsPDF from 'jspdf'
import type { AuditResult, RuleCheckResult } from '@/lib/rule-engine/types'

// ── Layout constants (A4, mm) ──────────────────────────────────────────────
const PAGE_WIDTH = 210
const PAGE_HEIGHT = 297
const ML = 18         // margin left
const MR = 192        // margin right (content ends here)
const CW = MR - ML   // content width = 174mm
const MT = 18         // margin top (first content line y)
const MB = 278        // margin bottom (last content line y, footer below)

// ── Colour palette ─────────────────────────────────────────────────────────
const C = {
  green:     '#22C55E',
  amber:     '#F59E0B',
  red:       '#EF4444',
  blue:      '#3B82F6',
  black:     '#111111',
  white:     '#FFFFFF',
  gray:      '#A1A1A1',
  darkgray:  '#6B6B6B',
  lightgray: '#F0F0F0',
  midgray:   '#D0D0D0',
  textbody:  '#404040',
  textmuted: '#808080',
  textdim:   '#B0B0B0',
} as const

// ── Helpers ────────────────────────────────────────────────────────────────

function scoreColor(score: number): string {
  if (score >= 80) return C.green
  if (score >= 60) return C.amber
  return C.red
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'DISCLOSURES DETECTED'
  if (score >= 60) return 'GAPS DETECTED — REVIEW NEEDED'
  return 'SIGNIFICANT GAPS — ACTION REQUIRED'
}

function severityColor(severity: string): string {
  if (severity === 'CRITICAL') return C.red
  if (severity === 'HIGH') return C.amber
  return C.blue
}

function statusColor(status: string): string {
  if (status === 'PASS') return C.green
  if (status === 'FAIL') return C.red
  return C.darkgray
}

function statusLabel(status: string): string {
  if (status === 'PASS') return 'DETECTED'
  if (status === 'FAIL') return 'NOT DETECTED'
  return 'INCONCLUSIVE'
}

// Sort: CRITICAL FAIL → HIGH FAIL → MEDIUM FAIL → UNCLEAR → PASS
function sortRules(rules: RuleCheckResult[]): RuleCheckResult[] {
  const sv: Record<string, number> = { CRITICAL: 0, HIGH: 1, MEDIUM: 2 }
  const st: Record<string, number> = { FAIL: 0, UNCLEAR: 1, PASS: 2 }
  return [...rules].sort((a, b) => {
    const sd = st[a.status] - st[b.status]
    return sd !== 0 ? sd : sv[a.severity] - sv[b.severity]
  })
}

function pageHeader(doc: jsPDF, section: string): void {
  doc.setFillColor(C.lightgray)
  doc.rect(0, 0, PAGE_WIDTH, 11, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(C.darkgray)
  doc.text('PAYLATER AUDIT', ML, 7.5)
  doc.setFont('helvetica', 'normal')
  doc.text(section, MR, 7.5, { align: 'right' })
}

function pageFooter(doc: jsPDF, pageNum: number): void {
  doc.setFillColor(C.lightgray)
  doc.rect(0, PAGE_HEIGHT - 9, PAGE_WIDTH, 9, 'F')
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(6.5)
  doc.setTextColor(C.textmuted)
  doc.text(
    'This report does NOT constitute legal advice. FCA PS26/1 — Deferred Payment Credit Regulation — 15 July 2026',
    ML,
    PAGE_HEIGHT - 3.5
  )
  doc.text(`Page ${pageNum}`, MR, PAGE_HEIGHT - 3.5, { align: 'right' })
}

function hRule(doc: jsPDF, y: number): void {
  doc.setDrawColor(C.midgray)
  doc.setLineWidth(0.25)
  doc.line(ML, y, MR, y)
}

// ── Public interface ───────────────────────────────────────────────────────

export interface PdfMeta {
  auditUrl: string
  bnplProvider: string
  createdAt: string   // already formatted date string, e.g. "29 March 2026"
  score: number
  auditId: string
}

// ── Main export ────────────────────────────────────────────────────────────

export function generatePdf(result: AuditResult, meta: PdfMeta): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  const passCount    = result.rules.filter(r => r.status === 'PASS').length
  const failCount    = result.rules.filter(r => r.status === 'FAIL').length
  const unclearCount = result.rules.filter(r => r.status === 'UNCLEAR').length
  const sortedRules  = sortRules(result.rules)
  const sc           = scoreColor(meta.score)
  const sl           = scoreLabel(meta.score)

  // ── PAGE 1: COVER ─────────────────────────────────────────────────────────

  // Top header bar
  doc.setFillColor(C.black)
  doc.rect(0, 0, PAGE_WIDTH, 13, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(C.white)
  doc.text('PAYLATER AUDIT', ML, 9)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.gray)
  doc.text('FCA PS26/1 — UK BNPL DISCLOSURE CHECKER', MR, 9, { align: 'right' })

  // Report title
  let y = 26
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(C.black)
  doc.text('FCA BNPL Disclosure Coverage Report', ML, y)
  y += 4
  hRule(doc, y)
  y += 8

  // Audit metadata
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8.5)
  doc.setTextColor(C.textbody)

  const urlDisplay = meta.auditUrl.length > 90
    ? meta.auditUrl.slice(0, 87) + '...'
    : meta.auditUrl
  doc.text(`URL:`, ML, y)
  doc.setTextColor(C.darkgray)
  doc.text(urlDisplay, ML + 14, y)
  y += 5

  doc.setTextColor(C.textbody)
  doc.text(`Provider:`, ML, y)
  doc.setTextColor(C.darkgray)
  doc.text(meta.bnplProvider.toUpperCase(), ML + 14, y)
  y += 5

  doc.setTextColor(C.textbody)
  doc.text(`Date:`, ML, y)
  doc.setTextColor(C.darkgray)
  doc.text(meta.createdAt, ML + 14, y)
  y += 10

  // Score panel (left column, 60mm wide)
  const panelX = ML
  const panelY = y
  const panelW = 62
  const panelH = 46

  doc.setDrawColor(sc)
  doc.setLineWidth(2.5)
  doc.line(panelX, panelY, panelX, panelY + panelH)
  doc.setLineWidth(0.3)
  doc.rect(panelX, panelY, panelW, panelH, 'S')

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.textmuted)
  doc.text('DISCLOSURE COVERAGE', panelX + 4, panelY + 7)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(40)
  doc.setTextColor(sc)
  doc.text(String(meta.score), panelX + 5, panelY + 28)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(C.darkgray)
  doc.text('/ 100', panelX + 35, panelY + 28)

  // Score progress bar
  const barX = panelX + 4
  const barY = panelY + 33
  const barTotalW = panelW - 8
  doc.setFillColor(C.midgray)
  doc.rect(barX, barY, barTotalW, 2, 'F')
  doc.setFillColor(sc)
  doc.rect(barX, barY, barTotalW * (meta.score / 100), 2, 'F')

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(sc)
  doc.text(sl, panelX + 4, panelY + 41)

  // Stats panel (right of score panel)
  const statsX = ML + panelW + 8
  const statsY = panelY

  // Detected
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.textmuted)
  doc.text('DETECTED', statsX, statsY + 6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(C.green)
  doc.text(String(passCount), statsX, statsY + 18)

  // Not Detected
  const nd = statsX + 36
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.textmuted)
  doc.text('NOT DETECTED', nd, statsY + 6)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(C.red)
  doc.text(String(failCount), nd, statsY + 18)

  // Inconclusive
  if (unclearCount > 0) {
    const ic = nd + 40
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(C.textmuted)
    doc.text('INCONCLUSIVE', ic, statsY + 6)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(C.darkgray)
    doc.text(String(unclearCount), ic, statsY + 18)
  }

  y = panelY + panelH + 10

  // Summary paragraph
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(C.textbody)
  const summaryLines = doc.splitTextToSize(result.summary, CW)
  doc.text(summaryLines, ML, y)
  y += summaryLines.length * 4.5 + 8

  // Disclaimer notice box
  const noticeH = 20
  doc.setDrawColor(C.midgray)
  doc.setLineWidth(0.3)
  doc.rect(ML, y, CW, noticeH, 'S')
  doc.setDrawColor(C.amber)
  doc.setLineWidth(1.5)
  doc.line(ML, y, ML, y + noticeH)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(7)
  doc.setTextColor(C.amber)
  doc.text('IMPORTANT — NOT LEGAL ADVICE', ML + 4, y + 6)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.textmuted)
  const noticeText = 'This score reflects automated detection of disclosure text strings only. It does not constitute a legal compliance assessment. Verify all findings with a qualified solicitor before relying on this report.'
  const noticeLines = doc.splitTextToSize(noticeText, CW - 8)
  doc.text(noticeLines, ML + 4, y + 12)

  pageFooter(doc, 1)

  // ── PAGE 2: REMEDIATION ROADMAP ────────────────────────────────────────────
  doc.addPage()
  pageHeader(doc, 'REMEDIATION ROADMAP')
  y = MT

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(C.black)
  doc.text('Remediation Roadmap', ML, y)
  y += 4
  hRule(doc, y)
  y += 6

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(C.textmuted)
  doc.text(
    'Fixes grouped by urgency. Complete CRITICAL issues first. HIGH issues before 15 July 2026. MEDIUM issues are Consumer Duty good-practice.',
    ML,
    y
  )
  y += 9

  const critFixes  = result.roadmap?.this_week      ?? []
  const highFixes  = result.roadmap?.this_month     ?? []
  const medFixes   = result.roadmap?.before_deadline ?? []

  y = renderRoadmapSection(doc, y, 'FIX THIS WEEK — CRITICAL', critFixes, C.red)
  y += 5
  y = renderRoadmapSection(doc, y, 'FIX THIS MONTH — HIGH', highFixes, C.amber)
  y += 5
  y = renderRoadmapSection(doc, y, 'BEFORE 15 JULY 2026 — MEDIUM', medFixes, C.blue)

  if (critFixes.length === 0 && highFixes.length === 0 && medFixes.length === 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(C.green)
    doc.text('[OK] No remediation required. All 18 FCA PS26/1 checks detected.', ML, y)
  }

  pageFooter(doc, 2)

  // ── PAGES 3+: FULL RULE RESULTS ────────────────────────────────────────────
  doc.addPage()
  pageHeader(doc, 'FULL RULE RESULTS')
  y = MT

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(C.black)
  doc.text('Full Compliance Check Results', ML, y)
  y += 4
  hRule(doc, y)
  y += 6

  // Column header row
  doc.setFillColor(C.lightgray)
  doc.rect(ML, y, CW, 7, 'F')
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(6.5)
  doc.setTextColor(C.darkgray)
  doc.text('RULE ID',   ML + 2, y + 4.5)
  doc.text('CATEGORY',  ML + 30, y + 4.5)
  doc.text('SEVERITY',  ML + 112, y + 4.5)
  doc.text('STATUS',    ML + 142, y + 4.5)
  y += 9

  let pageNum = 3

  for (const rule of sortedRules) {
    // Calculate block height needed
    const evidenceText  = rule.evidence.length > 350 ? rule.evidence.slice(0, 347) + '...' : rule.evidence
    const evidenceLines = doc.splitTextToSize(evidenceText, CW - 8)
    const hasFix        = rule.status !== 'PASS' && rule.fix_suggestion != null
    const fixText       = hasFix ? (rule.fix_suggestion!.length > 400 ? rule.fix_suggestion!.slice(0, 397) + '...' : rule.fix_suggestion!) : ''
    const fixLines      = hasFix ? doc.splitTextToSize(fixText, CW - 10) : []

    // Row layout: rule info (8mm) + evidence label+lines + fix label+lines + gap
    const blockH = 8 + (evidenceLines.length * 3.8) + (hasFix ? 4 + (fixLines.length * 3.8) : 0) + 5

    if (y + blockH > MB - 5) {
      pageFooter(doc, pageNum)
      pageNum++
      doc.addPage()
      pageHeader(doc, 'FULL RULE RESULTS (CONTINUED)')
      y = MT

      // Repeat column headers on continuation pages
      doc.setFillColor(C.lightgray)
      doc.rect(ML, y, CW, 7, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(C.darkgray)
      doc.text('RULE ID',  ML + 2,   y + 4.5)
      doc.text('CATEGORY', ML + 30,  y + 4.5)
      doc.text('SEVERITY', ML + 112, y + 4.5)
      doc.text('STATUS',   ML + 142, y + 4.5)
      y += 9
    }

    const rsc = statusColor(rule.status)
    const rvc = severityColor(rule.severity)

    // Horizontal rule above each rule row
    hRule(doc, y)

    // Vertical accent bar (left edge, colour-coded by status)
    doc.setDrawColor(rsc)
    doc.setLineWidth(1.2)
    doc.line(ML, y, ML, y + blockH - 2)
    doc.setLineWidth(0.25)

    // Rule ID
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(C.black)
    doc.text(rule.rule_id, ML + 3, y + 5.5)

    // Category (truncated)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(C.textbody)
    const catDisplay = rule.category.length > 42 ? rule.category.slice(0, 39) + '...' : rule.category
    doc.text(catDisplay, ML + 30, y + 5.5)

    // Severity badge
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(rvc)
    doc.text(rule.severity, ML + 113, y + 5.5)

    // Status badge
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(rsc)
    doc.text(statusLabel(rule.status), ML + 143, y + 5.5)

    y += 8

    // FCA Source (small, muted)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(6)
    doc.setTextColor(C.textdim)
    const srcDisplay = rule.fca_source.length > 90 ? rule.fca_source.slice(0, 87) + '...' : rule.fca_source
    doc.text(srcDisplay, ML + 4, y)
    y += 4

    // Evidence
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(6.5)
    doc.setTextColor(C.textmuted)
    doc.text('EVIDENCE', ML + 4, y)
    y += 3.5
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(C.textbody)
    doc.text(evidenceLines, ML + 4, y)
    y += evidenceLines.length * 3.8

    // Fix suggestion (for FAIL and UNCLEAR rules only)
    if (hasFix && fixLines.length > 0) {
      y += 3
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(6.5)
      doc.setTextColor(C.amber)
      doc.text('FIX SUGGESTION', ML + 4, y)
      y += 3.5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(C.textbody)
      doc.text(fixLines, ML + 4, y)
      y += fixLines.length * 3.8
    }

    y += 5
  }

  // ── FINAL PAGE: SOURCES + DISCLAIMER ──────────────────────────────────────
  pageFooter(doc, pageNum)
  pageNum++
  doc.addPage()
  pageHeader(doc, 'FCA SOURCES & DISCLAIMER')
  y = MT

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.setTextColor(C.black)
  doc.text('Official FCA Sources', ML, y)
  y += 4
  hRule(doc, y)
  y += 8

  for (const source of result.sources) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(C.black)
    doc.text(source.title, ML, y)
    y += 4

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(C.textbody)
    const descLines = doc.splitTextToSize(source.description, CW)
    doc.text(descLines, ML, y)
    y += descLines.length * 3.8 + 1.5

    doc.setTextColor(C.blue)
    doc.text(source.url, ML, y)
    y += 8
  }

  hRule(doc, y)
  y += 8

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(C.black)
  doc.text('Mandatory Disclaimer', ML, y)
  y += 5

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(C.textbody)
  const disclaimerText =
    'This report is produced by an automated rule-matching engine that searches page content ' +
    'for the presence or absence of specific text strings required by FCA PS26/1 (Deferred Payment ' +
    'Credit regulation, effective 15 July 2026). This report does NOT constitute legal advice. ' +
    'It is an informational compliance checklist tool only. PayLater Audit is not authorised or ' +
    'regulated by the FCA.'
  const disclaimerLines = doc.splitTextToSize(disclaimerText, CW)
  doc.text(disclaimerLines, ML, y)
  y += disclaimerLines.length * 4 + 10

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7)
  doc.setTextColor(C.textdim)
  doc.text(
    `Generated by PayLater Audit — paylateraudit.com — Audit ID: ${meta.auditId}`,
    ML,
    y
  )

  pageFooter(doc, pageNum)

  return doc
}

// ── Roadmap section renderer ───────────────────────────────────────────────

function renderRoadmapSection(
  doc: jsPDF,
  startY: number,
  title: string,
  fixes: string[],
  color: string
): number {
  let y = startY

  // Section title with left accent
  doc.setDrawColor(color)
  doc.setLineWidth(1.5)
  doc.line(ML, y, ML, y + 7)
  doc.setLineWidth(0.25)

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(8.5)
  doc.setTextColor(color)
  doc.text(title, ML + 5, y + 5)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(7.5)
  doc.setTextColor(color)
  doc.text(`${fixes.length} issue${fixes.length !== 1 ? 's' : ''}`, MR, y + 5, { align: 'right' })
  y += 10

  if (fixes.length === 0) {
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(8)
    doc.setTextColor(C.textdim)
    doc.text('No issues in this category.', ML + 5, y)
    y += 7
    return y
  }

  for (let i = 0; i < fixes.length; i++) {
    const fixLines = doc.splitTextToSize(fixes[i], CW - 16)
    const lineH    = fixLines.length * 4 + 3

    // If we're getting close to the bottom, stop and note overflow
    if (y + lineH > MB - 10) {
      doc.setFont('helvetica', 'italic')
      doc.setFontSize(7)
      doc.setTextColor(C.textdim)
      doc.text(
        `…and ${fixes.length - i} more. See full rule results on the following pages.`,
        ML + 5,
        y
      )
      y += 6
      return y
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(color)
    doc.text(`[${String(i + 1).padStart(2, '0')}]`, ML + 5, y)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(C.textbody)
    doc.text(fixLines, ML + 16, y)
    y += lineH
  }

  return y
}
