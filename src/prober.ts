import tls from 'node:tls';

export interface HostInput {
  host: string;
}

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
}

async function fetchTitle(html: string): Promise<string | undefined> {
  const m = /<title[^>]*>([^<]{1,120})<\/title>/i.exec(html);
  return m?.[1]?.trim();
}

export async function probeHost(host: string, timeoutMs = 12000): Promise<AliveResult> {
  const clean = host.replace(/^https?:\/\//, '').split('/')[0];
  const url = `https://${clean}/`;
  const start = Date.now();
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(timeoutMs),
      headers: { 'User-Agent': 'hx-alive-cli/1.0' },
    });
    const text = await res.text();
    let tlsSubject: string | undefined;
    try {
      tlsSubject = await new Promise((resolve) => {
        const s = tls.connect({ host: clean, port: 443, servername: clean, rejectUnauthorized: false }, () => {
          const cert = s.getPeerCertificate();
          s.end();
          const cn = cert.subject?.CN;
          resolve(Array.isArray(cn) ? cn[0] : cn);
        });
        s.setTimeout(5000, () => {
          s.destroy();
          resolve(undefined);
        });
        s.on('error', () => resolve(undefined));
      });
    } catch {
      /* ignore */
    }
    return {
      host: clean,
      url,
      alive: res.status > 0,
      status: res.status,
      title: await fetchTitle(text),
      server: res.headers.get('server') ?? undefined,
      tlsSubject,
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

export async function probeMany(
  hosts: string[],
  concurrency = 32,
): Promise<AliveResult[]> {
  const queue = [...new Set(hosts.map((h) => h.trim()).filter(Boolean))];
  const results: AliveResult[] = [];
  let i = 0;

  async function worker() {
    while (i < queue.length) {
      const idx = i++;
      const h = queue[idx];
      results.push(await probeHost(h));
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, queue.length) }, () => worker());
  await Promise.all(workers);
  return results.sort((a, b) => a.host.localeCompare(b.host));
}
