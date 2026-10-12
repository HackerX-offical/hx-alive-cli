import { buildHttpsUrl, normalizeHost } from './normalize-host.js';

describe('normalizeHost', () => {
  it('strips scheme and path', () => {
    expect(normalizeHost('https://Example.com/path')).toBe('example.com');
  });
  it('builds https url', () => {
    expect(buildHttpsUrl('host.test')).toBe('https://host.test/');
  });
});
