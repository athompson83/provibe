import test from 'node:test';
import assert from 'node:assert/strict';
import { buildInstallationUrl, normalizeGitHubWebhook } from './index.ts';

test('buildInstallationUrl preserves signed state without broad OAuth scopes', () => {
  const url = buildInstallationUrl({ appSlug: 'provibe-test', state: 'workspace-1.project-2.signature' });
  assert.equal(url, 'https://github.com/apps/provibe-test/installations/new?state=workspace-1.project-2.signature');
});

test('normalizeGitHubWebhook turns a successful workflow run into supporting provider evidence', () => {
  const evidence = normalizeGitHubWebhook('workflow_run', {
    action: 'completed',
    installation: { id: 42 },
    repository: { full_name: 'athompson83/provibe' },
    workflow_run: {
      id: 991,
      name: 'CI',
      head_sha: 'abc123',
      status: 'completed',
      conclusion: 'success',
      html_url: 'https://github.com/athompson83/provibe/actions/runs/991'
    }
  });

  assert.equal(evidence.installationId, '42');
  assert.equal(evidence.kind, 'github.workflow_run');
  assert.equal(evidence.subject, 'ci:abc123');
  assert.equal(evidence.polarity, 'supports');
  assert.equal(evidence.payload.conclusion, 'success');
});

test('normalizeGitHubWebhook marks failed workflow evidence as contradictory', () => {
  const evidence = normalizeGitHubWebhook('workflow_run', {
    action: 'completed',
    installation: { id: 42 },
    repository: { full_name: 'athompson83/provibe' },
    workflow_run: {
      id: 992,
      name: 'CI',
      head_sha: 'bad999',
      status: 'completed',
      conclusion: 'failure',
      html_url: 'https://github.com/athompson83/provibe/actions/runs/992'
    }
  });

  assert.equal(evidence.polarity, 'contradicts');
  assert.equal(evidence.subject, 'ci:bad999');
});
