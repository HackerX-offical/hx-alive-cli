import type { AliveResult, FetchFn } from '../types.js';
import { probeHost, type ProbeOptions } from './probe-host.js';
import { runPool } from '../pool/work-queue.js';

export async function probeMany(
  hosts: string[],
  concurrency = 32,
  options: ProbeOptions = {},
): Promise<AliveResult[]> {
  const queue = [...new Set(hosts.map((h) => h.trim()).filter(Boolean))];
  const results: AliveResult[] = new Array(queue.length);

  await runPool(queue, concurrency, async (host, index) => {
    results[index] = await probeHost(host, options);
  });

  return results.sort((a, b) => a.host.localeCompare(b.host));
}
