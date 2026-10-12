import { toJsonReport } from './json.js';

describe('toJsonReport', () => {
  it('serializes results', () => {
    const j = toJsonReport([{ host: 'a', url: 'u', alive: true, latencyMs: 1 }]);
    expect(JSON.parse(j)).toHaveLength(1);
  });
});
