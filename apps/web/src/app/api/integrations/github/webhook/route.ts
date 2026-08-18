import { NextResponse } from 'next/server';
import { normalizeGitHubWebhook, verifyGitHubWebhookSignature } from '@provibe/provider-github';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { requireGitHubIntegrationConfig } from '../../../../../lib/github/integration';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get('x-hub-signature-256');
  const eventName = request.headers.get('x-github-event');
  const config = requireGitHubIntegrationConfig();
  if (!verifyGitHubWebhookSignature(rawBody, signature, config.webhookSecret)) return NextResponse.json({ error: 'Invalid webhook signature.' }, { status: 401 });
  if (!eventName) return NextResponse.json({ error: 'Missing GitHub event name.' }, { status: 400 });
  if (eventName === 'ping') return NextResponse.json({ ok: true });
  if (eventName !== 'workflow_run') return NextResponse.json({ accepted: true, ignored: true });

  let normalized;
  try { normalized = normalizeGitHubWebhook(eventName, JSON.parse(rawBody)); }
  catch { return NextResponse.json({ error: 'Invalid GitHub webhook payload.' }, { status: 400 }); }

  const supabase = createSupabaseAdminClient();
  const { data: connections, error: connectionError } = await supabase.from('provider_connections').select('id,workspace_id,project_id').eq('provider', 'github').eq('external_account_id', normalized.installationId).eq('state', 'connected');
  if (connectionError) return NextResponse.json({ error: 'Provider lookup failed.' }, { status: 500 });
  const rows = (connections ?? []).filter((row) => row.project_id).map((row) => ({ workspace_id: row.workspace_id, project_id: row.project_id, source_kind: 'provider', provider: 'github', evidence_kind: normalized.kind, subject: normalized.subject, polarity: normalized.polarity, pointer: normalized.pointer, payload: normalized.payload, confidence: 1, observed_at: normalized.observedAt }));
  if (rows.length > 0) {
    const { error } = await supabase.from('evidence_records').insert(rows);
    if (error) return NextResponse.json({ error: 'Evidence persistence failed.' }, { status: 500 });
  }
  return NextResponse.json({ accepted: true, projectsUpdated: rows.length });
}
