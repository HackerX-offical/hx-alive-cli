import { parseTitleFromHtml } from './parse-title.js';

describe('parseTitleFromHtml', () => {
  it('extracts title', () => {
    expect(parseTitleFromHtml('<html><title>Hello   World</title></html>')).toBe('Hello World');
  });
});
