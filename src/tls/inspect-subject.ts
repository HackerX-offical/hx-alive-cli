import tls from 'node:tls';

export async function inspectTlsCommonName(host: string, timeoutMs = 5000): Promise<string | undefined> {
  return new Promise((resolve) => {
    const s = tls.connect(
      { host, port: 443, servername: host, rejectUnauthorized: false },
      () => {
        const cert = s.getPeerCertificate();
        s.end();
        const cn = cert.subject?.CN;
        resolve(Array.isArray(cn) ? cn[0] : cn);
      },
    );
    s.setTimeout(timeoutMs, () => {
      s.destroy();
      resolve(undefined);
    });
    s.on('error', () => resolve(undefined));
  });
}
