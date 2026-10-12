/** Strip scheme/path/port noise from user input. */
export function normalizeHost(input: string): string {
  const trimmed = input.trim();
  if (!trimmed) return '';
  const withoutScheme = trimmed.replace(/^https?:\/\//i, '');
  return withoutScheme.split('/')[0].split(':')[0].toLowerCase();
}

export function buildHttpsUrl(host: string): string {
  const h = normalizeHost(host);
  return h ? `https://${h}/` : '';
}
