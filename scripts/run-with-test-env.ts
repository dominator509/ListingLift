import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { config } from 'dotenv';

if (existsSync('.env.test')) {
  config({ path: '.env.test', override: false });
}

config({ override: false });

const [, , command, ...args] = process.argv;

if (!command) {
  console.error('Usage: tsx scripts/run-with-test-env.ts <command> [args...]');
  process.exit(1);
}

const result = spawnSync(command, args, {
  stdio: 'inherit',
  shell: true,
  env: process.env,
});

if (result.error) {
  console.error(result.error);
  process.exit(1);
}

process.exit(result.status ?? 0);
