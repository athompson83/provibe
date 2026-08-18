import { NextResponse } from 'next/server';
import { normalizeVercelWebhook, verifyVercelWebhookSignature } from '@provibe/provider-vercel';
import { createSupabaseAdminClient } from '../../../../../lib/supabase/admin';
import { requireVercelIntegrationConfig } from '../../../../../lib/vercel/integration';

export async function POST(request: Request) {
  const rawBody = await request.text();
  const config = requireVercelIntegrationConfig();
  if (!verifyVercelWebhookSignature(rawBody, request.headers.get('x-vercel-signature'), config.clientSecret)) return NextResponse.json({ error: 'Invalid Vercel webhook signature.' }, { status: 403 });
  let evidence;
  try { evidence = normalizeVercelWebhook(JSON.parse(rawBody)); }
  catch { return NextResponse.json({ accepted: true, ignored: true }); }

  const admin = createSupabaseAdminClient();
  const { data: resources, error: resourceError } = await admin.from('provider_resources').select('workspace_id,project_id').eq('provider','vercel').eq('resource_type','project').eq('external_id', evidence.projectId);
  if (resourceError) return NextResponse.json({ error: 'Vercel resource lookup failed.' }, { status: 500 });
  const rows = (resources ?? []).map((resource) => ({ workspace_id: resource.workspace_id, project_id: resource.project_id, source_kind: 'provider', provider: 'vercel', evidence_kind: evidence.kind, subject: evidence.subject, polarity: evidence.polarity, pointer: evidence.pointer, payload: evidence.payload, confidence: 1, observed_at: evidence.observedAt }));
  if (rows.length > 0) {
    const { error } = await admin.from('evidence_records').insert(rows);
    if (error) return NextResponse.json({ error: 'Vercel evidence persistence failed.' }, { status: 500 });
  }
  return NextResponse.json({ accepted: true, projectsUpdated: rows.length });
}
