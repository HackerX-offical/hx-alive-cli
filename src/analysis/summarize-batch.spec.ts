import { summarizeBatch } from './summarize-batch.js';

describe('summarizeBatch', () => {
  it('counts alive hosts', () => {
    const s = summarizeBatch([
      { host: 'a', url: '', alive: true, latencyMs: 10, statusClass: 'success' },
      { host: 'b', url: '', alive: false, latencyMs: 20, error: 'x' },
    ]);
    expect(s.alive).toBe(1);
    expect(s.dead).toBe(1);
    expect(s.avgLatencyMs).toBe(15);
  });
});
