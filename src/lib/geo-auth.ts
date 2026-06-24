import { verifySessionToken } from './auth';

const GEO_API_TOKEN_KEY = 'geo_api_token';

function getGeoToken(): string {
  return (import.meta.env as any).GEO_API_TOKEN || '';
}

export function authorizeGeoApi(request: Request): { ok: true } | { ok: false; status: number; error: string } {
  const authHeader = request.headers.get('authorization');
  const geoKey = request.headers.get('x-geo-token');
  const configured = getGeoToken();

  if (!configured) return { ok: true };
  const token = authHeader?.replace(/^Bearer\s+/i, '') || geoKey || '';
  if (token !== configured) {
    return { ok: false, status: 401, error: 'Invalid or missing GEO API token' };
  }
  return { ok: true };
}

export function authorizeGeoDashboard(cookieValue: string | undefined): { ok: true; username: string } | { ok: false; status: number; error: string } {
  if (!cookieValue) {
    return { ok: false, status: 401, error: 'Not authenticated' };
  }
  const session = verifySessionToken(cookieValue);
  if (!session) {
    return { ok: false, status: 401, error: 'Session expired or invalid' };
  }
  return { ok: true, username: session.username };
}
