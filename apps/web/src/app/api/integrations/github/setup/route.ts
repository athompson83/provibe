import { NextResponse } from 'next/server';
import { buildGitHubUserAuthorizationUrl, signIntegrationState, verifyIntegrationState } from '@provibe/provider-github';
import { getAuthenticatedUserId } from '../../../../../lib/supabase/server';
import { createPkcePair, requireGitHubIntegrationConfig } from '../../../../../lib/github/integration';

const PKCE_COOKIE = '__Host-provibe-github-pkce';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const installationId = url.searchParams.get('installation_id');
  const incomingState = url.searchParams.get('state');
  const config = requireGitHubIntegrationConfig();
  const state = incomingState ? verifyIntegrationState(incomingState, config.stateSecret) : null;
  const userId = await getAuthenticatedUserId();
  if (!installationId || !state || !userId || state.userId !== userId) return NextResponse.json({ error: 'Untrusted GitHub installation callback.' }, { status: 400 });

  const authorizationState = signIntegrationState({ ...state, installationId, expiresAt: Math.floor(Date.now() / 1000) + 600 }, config.stateSecret);
  const pkce = createPkcePair();
  const target = buildGitHubUserAuthorizationUrl({ clientId: config.clientId, state: authorizationState, redirectUri: config.callbackUrl, codeChallenge: pkce.challenge });
  const response = NextResponse.redirect(target);
  response.cookies.set(PKCE_COOKIE, pkce.verifier, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 600 });
  return response;
}
