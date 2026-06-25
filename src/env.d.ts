// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="vite/client" />
/// <reference types="../vendor/integration/types.d.ts" />

// Fontsource packages ship CSS only (no type declarations); declare them so
// side-effect imports type-check under TypeScript 6 strict (ts2882).
declare module '@fontsource-variable/*';
declare module '@fontsource/*';

// Astro virtual module injected by pageContentPlugin — all YAML page data
declare module 'astro:page-content' {
  const content: Record<string, any>;
  export default content;
}

// Astro AI virtual module (used at Cloudflare edge)
declare module '/.astro/ai' {
  export interface Ai {
    run(model: string, input: Record<string, unknown>): Promise<unknown>;
  }
  export const getEmbeddings: (text: string) => Promise<number[]>;
}

// Cloudflare Workers runtime types
declare module 'cloudflare:workers' {
  export const env: Record<string, unknown>;
  export interface WorkerEntrypoint {
    fetch(request: Request): Promise<Response>;
  }
}

// Cloudflare ScheduledEvent for cron triggers
interface ScheduledEvent {
  type: 'scheduled';
  scheduledTime: number;
}

// ─── Cloudflare Runtime Types ──────────────────────────────────

interface FnVectorize {
  query(vector: number[], options: { topK: number; filter?: Record<string, string> }): Promise<{
    matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }>;
  }>;
  insert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  describe(): Promise<{ dimensions: number; metric: string; count: number }>;
}

interface AiTextEmbeddingInput {
  text: string[];
}
interface AiTextEmbeddingOutput {
  data: number[][];
  shape: number[];
}

interface AiChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}
interface AiChatInput {
  messages: AiChatMessage[];
  max_tokens?: number;
  temperature?: number;
}
interface AiChatOutput {
  response: string;
}

declare class Ai {
  run(model: '@cf/baai/bge-base-en-v1.5', input: AiTextEmbeddingInput): Promise<AiTextEmbeddingOutput>;
  run(model: '@cf/meta/llama-3.1-8b-instruct', input: AiChatInput): Promise<AiChatOutput>;
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(key: string, value: string): Promise<void>;
}

declare namespace App {
  interface Locals {
    lang: string;
    locale: string;
    isEN: boolean;
    runtime: {
      env: {
        VECTORIZE: FnVectorize;
        AI: Ai;
        SESSION_SECRET?: string;
        KEYSTATIC_SECRET?: string;
        NODE_ENV?: string;
      };
    };
  }
}
