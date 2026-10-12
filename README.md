# hx-alive-cli

**Mass HTTP/TLS liveness probing** — status, title, banners, cert subject, and latency
at configurable concurrency for authorized surface mapping.

## Why this exists

Recon pipelines produce thousands of hostnames; you need to know which ones respond
before deeper testing. This CLI probes HTTPS endpoints in parallel, classifies
responses, and pipes cleanly from `hx-dns` or flat host lists. Use only on targets
within your engagement scope.

## Features

- Single-host `probe` with JSON or colored terminal output
- `batch` from file or stdin with `--concurrency`, `--live-only`, and optional batch
  summary
- TLS certificate subject extraction and HTTP metadata (status, title, `Server`)
- Work-queue pool for bounded parallelism without overwhelming targets
- Exit code `2` when a single probe finds no live host

## Install

```bash
git clone https://github.com/HackerX-offical/hx-alive-cli.git
cd hx-alive-cli
npm install
npm run build
npm link   # optional: global hx-alive
```

## Quick start

```bash
hx-dns subdomains target.com | hx-alive batch --live-only
hx-alive probe www.target.com --json
hx-alive batch hosts.txt -c 64 --json --summary
```

## Output

| Mode          | Description                                                               |
| ------------- | ------------------------------------------------------------------------- |
| Default       | One line per host: status, title, latency, alive/error coloring           |
| `--json`      | Array of probe objects; with `--summary`, wrapped report with batch stats |
| `--live-only` | Filters to responding hosts before print                                  |
| Exit `2`      | `probe` command: host not alive                                           |

## Develop

```bash
npm run format
npm run build
npm test
npm run test:integration   # optional live probes
npm run format:check
```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for module layout and extension points.

## Ethics

Use only on systems and content you are **authorized** to test. See
[SECURITY.md](./SECURITY.md).

## License

Licensed under the [HackerX License](./LICENSE). Redistributions must retain copyright,
license text, and [NOTICE](./NOTICE) attribution per the license terms.
