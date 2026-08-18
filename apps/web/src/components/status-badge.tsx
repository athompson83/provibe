export type StatusTone = 'verified' | 'observed' | 'reported' | 'contradicted' | 'blocked' | 'unknown' | 'accepted_risk';
const labels: Record<StatusTone, string> = { verified: 'Verified', observed: 'Observed', reported: 'Reported', contradicted: 'Contradicted', blocked: 'Blocked', unknown: 'Unknown', accepted_risk: 'Accepted risk' };
export function StatusBadge({ state }: { state: StatusTone }) { return <span className={`status status-${state}`}>{labels[state]}</span>; }
