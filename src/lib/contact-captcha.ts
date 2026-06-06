import crypto from 'node:crypto';

const COOKIE_NAME = 'vf-captcha';
const COOKIE_TTL_SECONDS = 30 * 60;
const HMAC_SECRET_FALLBACK = 'theworkvigour-astro-tina-cms-captcha-vault';

function getSecret(): string {
  return (
    (import.meta.env as any).SESSION_SECRET ||
    (import.meta.env as any).KEYSTATIC_SECRET ||
    HMAC_SECRET_FALLBACK
  );
}

export interface CaptchaChallenge {
  question: string;
  answer: number;
}

export interface CaptchaCookie {
  v: 1;
  a: number;
  b: number;
  op: '+' | '-';
  exp: number;
  sig: string;
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSecret()).update(payload).digest('base64url');
}

function pickOp(): '+' | '-' {
  return Math.random() < 0.5 ? '+' : '-';
}

function pickNumbers(op: '+' | '-'): { a: number; b: number } {
  if (op === '+') {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    return { a, b };
  }
  const a = Math.floor(Math.random() * 8) + 2;
  const b = Math.floor(Math.random() * (a - 1)) + 1;
  return { a, b };
}

export function generateChallenge(): CaptchaChallenge {
  const op = pickOp();
  const { a, b } = pickNumbers(op);
  const answer = op === '+' ? a + b : a - b;
  const question = `${a} ${op} ${b}`;
  return { question, answer };
}

export function buildCookieValue(challenge: CaptchaChallenge): { value: string; expires: Date } {
  const exp = Math.floor(Date.now() / 1000) + COOKIE_TTL_SECONDS;
  const op = challenge.question.includes('+') ? '+' : '-';
  const [aStr, bStr] = challenge.question.split(/\s+([+-])\s+/);
  const a = Number(aStr);
  const b = Number(bStr);
  const payload = `v1.${a}.${op}.${b}.${exp}`;
  const sig = sign(payload);
  const value = Buffer.from(JSON.stringify({ v: 1, a, b, op, exp, sig } satisfies CaptchaCookie)).toString('base64url');
  return { value, expires: new Date(exp * 1000) };
}

export interface ParsedCookie {
  a: number;
  b: number;
  op: '+' | '-';
  exp: number;
}

function parseCookie(raw: string | null | undefined): ParsedCookie | null {
  if (!raw) return null;
  try {
    const json = Buffer.from(raw, 'base64url').toString('utf-8');
    const obj = JSON.parse(json) as CaptchaCookie;
    if (obj.v !== 1 || typeof obj.a !== 'number' || typeof obj.b !== 'number' || (obj.op !== '+' && obj.op !== '-') || typeof obj.exp !== 'number') return null;
    const payload = `v1.${obj.a}.${obj.op}.${obj.b}.${obj.exp}`;
    const expected = sign(payload);
    if (!crypto.timingSafeEqual(Buffer.from(sigToBytes(expected)), Buffer.from(sigToBytes(obj.sig)))) return null;
    if (Math.floor(Date.now() / 1000) > obj.exp) return null;
    return { a: obj.a, b: obj.b, op: obj.op, exp: obj.exp };
  } catch {
    return null;
  }
}

function sigToBytes(s: string): Uint8Array {
  const buf = Buffer.from(s, 'base64url');
  return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
}

export function verifyAnswer(cookieRaw: string | null | undefined, submitted: unknown): boolean {
  const parsed = parseCookie(cookieRaw);
  if (!parsed) return false;
  const expected = parsed.op === '+' ? parsed.a + parsed.b : parsed.a - parsed.b;
  const got = Number(String(submitted ?? '').trim());
  if (!Number.isFinite(got)) return false;
  return got === expected;
}

export function cookieName(): string {
  return COOKIE_NAME;
}

export function cookieTtlSeconds(): number {
  return COOKIE_TTL_SECONDS;
}
