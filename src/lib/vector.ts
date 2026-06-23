export const VECTOR_DIM = 768; // Workers AI bge-base-en-v1.5 (free) / OpenAI text-embedding-3-small (optional)

export function toVectorInput(text: string): string {
  return text
    .toLowerCase()
    .replace(/\n/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export interface FnVectorize {
  query(vector: number[], options: { topK: number; filter?: Record<string, string> }): Promise<{ matches: Array<{ id: string; score: number; metadata?: Record<string, unknown> }> }>;
  insert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  upsert(vectors: Array<{ id: string; values: number[]; metadata?: Record<string, unknown> }>): Promise<void>;
  deleteByIds(ids: string[]): Promise<void>;
  describe(): Promise<{ dimensions: number; metric: string; count: number }>;
}
