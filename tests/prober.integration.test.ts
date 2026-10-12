import { probeHost } from '../src/prober.js';

describe('probeHost live', () => {
  it('example.com is alive', async () => {
    const r = await probeHost('example.com');
    expect(r.alive).toBe(true);
    expect(r.status).toBe(200);
  });
});
