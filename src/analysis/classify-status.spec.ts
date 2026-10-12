import { classifyHttpStatus } from './classify-status.js';

describe('classifyHttpStatus', () => {
  it('maps bands', () => {
    expect(classifyHttpStatus(200)).toBe('success');
    expect(classifyHttpStatus(302)).toBe('redirect');
    expect(classifyHttpStatus(404)).toBe('client-error');
    expect(classifyHttpStatus(503)).toBe('server-error');
  });
});
