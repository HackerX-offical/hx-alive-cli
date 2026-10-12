import type { AliveResult, FetchFn } from '../types.js';
import { classifyHttpStatus } from '../analysis/classify-status.js';
import { buildHttpsUrl, normalizeHost } from '../utils/normalize-host.js';
import { parseTitleFromHtml } from '../utils/parse-title.js';
import { inspectTlsCommonName } from '../tls/inspect-subject.js';

export interface ProbeOptions {
  timeoutMs?: number;
  fetchImpl?: FetchFn;
  skipTls?: boolean;
}

export async function probeHost(host: string, options: ProbeOptions = {}): Promise<AliveResult> {
  const clean = normalizeHost(host);
  const url = buildHttpsUrl(clean);
  const fetchFn = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? 12000;
  const start = Date.now();

  if (!clean) {
    return {
      host: '',
      url: '',
      alive: false,
      error: 'empty host',
      latencyMs: 0,
    };
  }

  try {
    const res = await fetchFn(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'User-Agent': 'hx-alive-cli/1.0' },
    });
    const text = await res.text();
    const tlsSubject = options.skipTls ? undefined : await inspectTlsCommonName(clean);
    const statusClass = classifyHttpStatus(res.status);
    return {
      host: clean,
      url,
      alive: res.status > 0,
      status: res.status,
      title: parseTitleFromHtml(text),
      server: res.headers.get('server') ?? undefined,
      tlsSubject,
      statusClass,
      latencyMs: Date.now() - start,
    };
  } catch (err) {
    return {
      host: clean,
      url,
      alive: false,
      error: err instanceof Error ? err.message : String(err),
      latencyMs: Date.now() - start,
    };
  }
}
