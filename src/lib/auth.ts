import crypto from 'node:crypto';
import adminAuthData from '~/data/admin-auth.json';

const SESSION_DURATION = 24 * 60 * 60 * 1000;
const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

function getSecret(): string {
  return (
    (import.meta.env as any).SESSION_SECRET ||
    (import.meta.env as any).KEYSTATIC_SECRET ||
    crypto.randomBytes(32).toString('hex')
  );
}

function getCredentials() {
  const envUser = (import.meta.env as any).ADMIN_USERNAME;
  const envPass = (import.meta.env as any).ADMIN_PASSWORD;

  if (envUser && envPass) {
    return { username: envUser, password: envPass };
  }

  const data = adminAuthData as {
    username?: string;
    password?: string;
    passwordHash?: string;
  };

  if (data.passwordHash && data.username) {
    return { username: data.username, passwordHash: data.passwordHash };
  }
  if (data.username && data.password) {
    return { username: data.username, password: data.password };
  }

  const randomPass = crypto.randomBytes(6).toString('base64');
  return { username: 'Admin', password: randomPass };
}

export function verifyCredentials(inputUsername: string, inputPassword: string): boolean {
  const creds = getCredentials();
  if (inputUsername !== creds.username) return false;
  if ('passwordHash' in creds) {
    return verifyHash(inputPassword, (creds as any).passwordHash);
  }
  return inputPassword === (creds as { password: string }).password;
}

export function createSessionToken(username: string): string {
  const secret = getSecret();
  const expiresAt = Date.now() + SESSION_DURATION;
  const payload = `${username}|${expiresAt}`;
  const hmac = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const token = Buffer.from(`${payload}|${hmac}`).toString('base64url');
  return token;
}

export function verifySessionToken(token: string): { username: string; expiresAt: number } | null {
  try {
    const decoded = Buffer.from(token, 'base64url').toString('utf-8');
    const parts = decoded.split('|');
    if (parts.length !== 3) return null;

    const [username, expiresAtStr, signature] = parts;
    const expiresAt = Number(expiresAtStr);

    if (Date.now() > expiresAt) return null;

    const secret = getSecret();
    const payload = `${username}|${expiresAtStr}`;
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;

    return { username, expiresAt };
  } catch {
    return null;
  }
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(SALT_LENGTH).toString('hex');
  const hash = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyHash(password: string, stored: string): boolean {
  const [salt, hash] = stored.split(':');
  if (!salt || !hash) return false;
  const derived = crypto.scryptSync(password, salt, KEY_LENGTH).toString('hex');
  return derived === hash;
}
