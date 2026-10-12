export interface AliveResult {
  host: string;
  url: string;
  alive: boolean;
  status?: number;
  title?: string;
  server?: string;
  tlsSubject?: string;
  error?: string;
  latencyMs: number;
  statusClass?: 'success' | 'redirect' | 'client-error' | 'server-error' | 'unknown';
}

export type FetchFn = typeof fetch;
