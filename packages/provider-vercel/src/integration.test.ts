import test from 'node:test';
import assert from 'node:assert/strict';
import { buildVercelInstallUrl, normalizeVercelWebhook, verifyVercelWebhookSignature } from './index.ts';
import { createHmac } from 'node:crypto';

test('buildVercelInstallUrl carries signed state into the external installation flow', () => {
  assert.equal(buildVercelInstallUrl({ slug: 'provibe', state: 'signed-state' }), 'https://vercel.com/integrations/provibe/new?state=signed-state');
});

test('verifyVercelWebhookSignature validates HMAC-SHA1 over the raw request body', () => {
  const body = JSON.stringify({ type: 'deployment.succeeded' });
  const signature = createHmac('sha1', 'secret').update(body).digest('hex');
  assert.equal(verifyVercelWebhookSignature(body, signature, 'secret'), true);
  assert.equal(verifyVercelWebhookSignature(body, `${signature}junk`, 'secret'), false);
});

test('normalizeVercelWebhook produces supporting evidence for a successful deployment', () => {
  const evidence = normalizeVercelWebhook({
    type: 'deployment.succeeded',
    createdAt: 1787070000000,
    payload: {
      project: { id: 'prj_1', name: 'provibe' },
      deployment: { id: 'dpl_1', url: 'provibe.vercel.app', meta: { githubCommitSha: 'abc123' } },
      team: { id: 'team_1' }
    }
  });
  assert.equal(evidence.projectId, 'prj_1');
  assert.equal(evidence.subject, 'deployment:abc123');
  assert.equal(evidence.polarity, 'supports');
});

test('normalizeVercelWebhook marks deployment errors as contradictory evidence', () => {
  const evidence = normalizeVercelWebhook({
    type: 'deployment.error',
    createdAt: 1787070000000,
    payload: { project: { id: 'prj_1' }, deployment: { id: 'dpl_2', url: 'broken.vercel.app', meta: { githubCommitSha: 'bad999' } } }
  });
  assert.equal(evidence.subject, 'deployment:bad999');
  assert.equal(evidence.polarity, 'contradicts');
});
