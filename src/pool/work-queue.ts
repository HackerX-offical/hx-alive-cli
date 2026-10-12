/** Fixed worker pool over a shared index — used by batch probing. */
export async function runPool<T>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<void>,
): Promise<void> {
  if (items.length === 0) return;
  let next = 0;
  const limit = Math.max(1, Math.min(concurrency, items.length));

  async function loop() {
    while (true) {
      const idx = next++;
      if (idx >= items.length) break;
      await worker(items[idx], idx);
    }
  }

  await Promise.all(Array.from({ length: limit }, () => loop()));
}
