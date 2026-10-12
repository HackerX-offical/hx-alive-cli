import { probeHost } from './probe-host.js';

describe('probeHost', () => {
  it('uses injected fetch', async () => {
    const fetchImpl = async () =>
      ({
        status: 200,
        text: async () => '<title>OK</title>',
        headers: { get: () => 'nginx' },
      }) as unknown as Response;

    const r = await probeHost('lab.test', { fetchImpl, skipTls: true });
    expect(r.alive).toBe(true);
    expect(r.title).toBe('OK');
    expect(r.statusClass).toBe('success');
  });

  it('handles empty host', async () => {
    const r = await probeHost('  ', { skipTls: true });
    expect(r.alive).toBe(false);
  });
});
