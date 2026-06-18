import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignored = new Set(['node_modules', '.next', '.git', 'coverage']);
const files: string[] = [];

function walk(dir: string) {
  for (const entry of readdirSync(dir)) {
    if (ignored.has(entry)) continue;
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else files.push(relative(root, path));
  }
}

walk(root);
console.log(JSON.stringify({ fileCount: files.length, files: files.sort() }, null, 2));
