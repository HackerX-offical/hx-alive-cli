import { runPool } from './work-queue.js';

describe('runPool', () => {
  it('runs all items', async () => {
    const seen: number[] = [];
    await runPool([1, 2, 3, 4], 2, async (n) => {
      seen.push(n);
    });
    expect(seen.sort()).toEqual([1, 2, 3, 4]);
  });
});
