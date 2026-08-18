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

const STATUS_TERMS = /\b(pass(?:ed|es)?|success(?:ful|fully)?|deployed|applied|merged|fixed|complete(?:d)?|ready|fail(?:ed|ure)?|blocked|green|red)\b/i;

export function extractReportedClaims(sourceText: string): ProgressClaim[] {
  const statements = sourceText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+\S/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter((line) => STATUS_TERMS.test(line));

  return statements.map((statement, index) => ({
    id: `reported-${index + 1}`,
    statement,
    reportedState: 'reported' as const
  }));
}
