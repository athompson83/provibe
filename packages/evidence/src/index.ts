import type { EvidenceRecord, EvidenceState, ProgressClaim } from '../../contracts/src/index.ts';

export function classifyClaimAgainstEvidence(claim: ProgressClaim, evidence: EvidenceRecord[]): EvidenceState {
  const related = evidence.filter((item) => item.subject === claim.statement);
  if (related.some((item) => item.polarity === 'contradicts')) return 'contradicted';
  if (related.some((item) => item.polarity === 'supports')) return 'verified';
  return 'unknown';
}
