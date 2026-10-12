export function parseTitleFromHtml(html: string): string | undefined {
  const m = /<title[^>]*>([^<]{1,200})<\/title>/i.exec(html);
  const raw = m?.[1]?.trim();
  if (!raw) return undefined;
  return raw.replace(/\s+/g, ' ');
}
