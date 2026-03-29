// lib/pdf-access.ts
// PDF download access gate.
// Currently: all audits are unlocked (free during testing).
// To add payment gating in future — regardless of payment provider:
//   1. Change the single return statement below to check paymentStatus
//   2. Example: return paymentStatus === 'paid'
//   3. No other files need to change.
//
// The paymentStatus value comes from audit.payment_status in Supabase.
// It is already set to 'paid' on all audit rows created by create-audit/route.ts.

export function isPdfUnlocked(paymentStatus: string | null): boolean {
  // Remove this line and replace with payment check when ready:
  void paymentStatus
  return true
}
