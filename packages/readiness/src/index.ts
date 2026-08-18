import type { EvidenceState } from '../../contracts/src/index.ts';
export interface ReadinessControl { id: string; label: string; required: boolean; state: EvidenceState; }
export interface ReadinessResult { score: number; verdict: 'ready' | 'ready_with_accepted_risks' | 'blocked'; blockingControlIds: string[]; }
export function evaluateReadiness(controls: ReadinessControl[]): ReadinessResult {
  if (controls.length === 0) return { score: 0, verdict: 'blocked', blockingControlIds: [] };
  const satisfied = controls.filter((control) => control.state === 'verified' || control.state === 'accepted_risk');
  const blocking = controls.filter((control) => control.required && control.state !== 'verified' && control.state !== 'accepted_risk');
  const hasAcceptedRisk = controls.some((control) => control.state === 'accepted_risk');
  return { score: Math.round((satisfied.length / controls.length) * 100), verdict: blocking.length > 0 ? 'blocked' : hasAcceptedRisk ? 'ready_with_accepted_risks' : 'ready', blockingControlIds: blocking.map((control) => control.id) };
}
