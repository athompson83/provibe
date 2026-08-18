import test from 'node:test';
import assert from 'node:assert/strict';
import { buildGitHubUserAuthorizationUrl, signIntegrationState, verifyIntegrationState } from './index.ts';

test('signed integration state round-trips project context and expiry', () => {
  const token = signIntegrationState({ userId: 'user-1', workspaceId: 'ws-1', projectId: 'project-1', installationId: '42', expiresAt: 1_800_000_000 }, 'super-secret');
  const result = verifyIntegrationState(token, 'super-secret', 1_700_000_000);
  assert.deepEqual(result, { userId: 'user-1', workspaceId: 'ws-1', projectId: 'project-1', installationId: '42', expiresAt: 1_800_000_000 });
});

test('signed integration state rejects tampering and expiry', () => {
  const token = signIntegrationState({ userId: 'user-1', workspaceId: 'ws-1', projectId: 'project-1', expiresAt: 1_800_000_000 }, 'super-secret');
  assert.equal(verifyIntegrationState(`${token}tampered`, 'super-secret', 1_700_000_000), null);
  assert.equal(verifyIntegrationState(token, 'super-secret', 1_900_000_000), null);
});

test('GitHub user authorization URL requests no unrelated OAuth scopes', () => {
  const url = buildGitHubUserAuthorizationUrl({ clientId: 'Iv1.example', state: 'signed-state' });
  assert.equal(url, 'https://github.com/login/oauth/authorize?client_id=Iv1.example&state=signed-state');
});
