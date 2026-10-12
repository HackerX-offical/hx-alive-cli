# hx-alive-cli

Turns `hx-dns subdomains` output into a **live attack surface**: HTTPS status, page title, `Server` banner, TLS cert CN, latency — at 32+ concurrent workers.

```bash
hx-dns subdomains target.com | hx-alive batch --live-only
hx-alive probe www.target.com --json
```

MIT — HackerX Official
