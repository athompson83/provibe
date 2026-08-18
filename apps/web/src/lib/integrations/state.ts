import 'server-only';
import { createHmac, timingSafeEqual } from 'node:crypto';

export interface ServerIntegrationState {
  userId: string;
  workspaceId: string;
  projectId: string;
  expiresAt: number;
}

const SHA256_HEX = /^[0-9a-f]{64}$/i;

export function signServerIntegrationState(state: ServerIntegrationState, secret: string): string {
  if (!secret) throw new Error('Integration state secret is required.');
  const payload = Buffer.from(JSON.stringify(state), 'utf8').toString('base64url');
  const mac = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${mac}`;
}

export function verifyServerIntegrationState(token: string, secret: string, now = Math.floor(Date.now() / 1000)): ServerIntegrationState | null {
  const [payload, mac, extra] = token.split('.');
  if (!payload || !mac || extra || !secret || !SHA256_HEX.test(mac)) return null;
  const expected = createHmac('sha256', secret).update(payload).digest('hex');
  if (!timingSafeEqual(Buffer.from(mac, 'hex'), Buffer.from(expected, 'hex'))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as Partial<ServerIntegrationState>;
    if (typeof parsed.userId !== 'string' || typeof parsed.workspaceId !== 'string' || typeof parsed.projectId !== 'string' || typeof parsed.expiresAt !== 'number' || parsed.expiresAt <= now) return null;
    return { userId: parsed.userId, workspaceId: parsed.workspaceId, projectId: parsed.projectId, expiresAt: parsed.expiresAt };
  } catch { return null; }
}
