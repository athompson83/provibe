import type { EvidenceRecord, EvidenceState, ProgressClaim } from '../../contracts/src/index.ts';
import { classifyClaimAgainstEvidence } from '../../evidence/src/index.ts';

export interface VerifyProgressInput {
  claim: ProgressClaim;
  evidence: EvidenceRecord[];
  blockers: string[];
  acceptedRisk: boolean;
}

export interface VerificationResult {
  state: EvidenceState;
  reasons: string[];
}

export function verifyProgressClaim(input: VerifyProgressInput): VerificationResult {
  const evidenceState = classifyClaimAgainstEvidence(input.claim, input.evidence);
  if (evidenceState === 'contradicted') return { state: 'contradicted', reasons: ['Observed evidence conflicts with the reported claim.'] };
  if (input.blockers.length > 0) return { state: 'blocked', reasons: input.blockers };
  if (input.acceptedRisk) return { state: 'accepted_risk', reasons: ['The owner explicitly accepted this unresolved risk.'] };
  if (evidenceState === 'verified') return { state: 'verified', reasons: ['Observed evidence supports the claim.'] };
  return { state: 'unknown', reasons: ['No sufficient evidence is currently available.'] };
}
