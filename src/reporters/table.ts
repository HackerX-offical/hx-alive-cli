import type { AliveResult } from '../types.js';

export function formatTableRow(r: AliveResult): string {
  const flag = r.alive ? 'UP' : 'DN';
  return `${flag} ${r.host} ${r.status ?? ''} ${r.tlsSubject ?? ''} ${r.title ?? ''}`.trim();
}
