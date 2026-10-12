import type { AliveResult } from '../types.js';
import type { BatchSummary } from '../analysis/summarize-batch.js';

export function toJsonReport(results: AliveResult[], summary?: BatchSummary): string {
  return JSON.stringify(summary ? { summary, results } : results, null, 2);
}
