export type EvidenceState =
  | 'reported'
  | 'observed'
  | 'verified'
  | 'contradicted'
  | 'unknown'
  | 'blocked'
  | 'accepted_risk';

export type EvidenceSource = 'deterministic' | 'provider' | 'reported' | 'inferred' | 'owner';

export interface EvidenceRecord {
  id: string;
  kind: string;
  subject: string;
  source?: EvidenceSource;
  polarity: 'supports' | 'contradicts' | 'neutral';
  observedAt: string;
  pointer?: string;
  confidence?: number;
}

export interface ProgressClaim {
  id: string;
  statement: string;
  reportedState: 'reported';
}

export interface ProjectArtifact {
  id: string;
  kind: string;
  renderedFromRevision: number;
  dependencies: string[];
  stale: boolean;
}

export interface ProjectDecision {
  id: string;
  area: string;
  summary: string;
  decidedAt: string;
}

export interface CanonicalProjectModel {
  id: string;
  name: string;
  revision: number;
  decisions: ProjectDecision[];
  artifacts: ProjectArtifact[];
}

export interface ProviderCapability {
  capability: string;
  state: 'connected' | 'degraded' | 'disconnected' | 'unsupported';
  lastSuccessAt?: string;
  lastAttemptAt?: string;
  errorClass?: string;
}
