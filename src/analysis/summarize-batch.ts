import type { AliveResult } from '../types.js';

export interface BatchSummary {
  total: number;
  alive: number;
  dead: number;
  avgLatencyMs: number;
  statusHistogram: Record<string, number>;
}

export function summarizeBatch(results: AliveResult[]): BatchSummary {
  const alive = results.filter((r) => r.alive).length;
  const latencies = results.map((r) => r.latencyMs);
  const avg = latencies.length
    ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length)
    : 0;
  const statusHistogram: Record<string, number> = {};
  for (const r of results) {
    const key = r.statusClass ?? (r.alive ? 'alive' : 'dead');
    statusHistogram[key] = (statusHistogram[key] ?? 0) + 1;
  }
  return {
    total: results.length,
    alive,
    dead: results.length - alive,
    avgLatencyMs: avg,
    statusHistogram,
  };
}
