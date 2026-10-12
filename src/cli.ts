#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { Command } from 'commander';
import chalk from 'chalk';
import { probeMany, probeHost } from './prober.js';

const program = new Command();
program.name('hx-alive').description('Mass HTTP/TLS liveness engine').version('1.0.0');

program
  .command('probe')
  .argument('<host>', 'hostname')
  .option('--json', 'JSON')
  .action(async (host: string, opts: { json?: boolean }) => {
    const r = await probeHost(host);
    if (opts.json) console.log(JSON.stringify(r, null, 2));
    else
      console.log(
        r.alive ? chalk.green(`${r.host} ${r.status} ${r.title ?? ''}`) : chalk.red(r.error),
      );
    process.exit(r.alive ? 0 : 2);
  });

program
  .command('batch')
  .description('Probe hosts from file (one per line) or stdin')
  .argument('[file]', 'host list')
  .option('-c, --concurrency <n>', 'workers', '32')
  .option('--json', 'JSON array')
  .option('--live-only', 'Print only responding hosts')
  .action(
    async (
      file: string | undefined,
      opts: { concurrency: string; json?: boolean; liveOnly?: boolean },
    ) => {
      const content = file ? readFileSync(file, 'utf8') : readFileSync(0, 'utf8');
      const hosts = content
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);
      const results = await probeMany(hosts, Number(opts.concurrency));
      const out = opts.liveOnly ? results.filter((r) => r.alive) : results;
      if (opts.json) console.log(JSON.stringify(out, null, 2));
      else
        out.forEach((r) =>
          console.log(`${r.alive ? 'UP' : 'DN'} ${r.host} ${r.status ?? ''} ${r.tlsSubject ?? ''}`),
        );
    },
  );

program.parse();
