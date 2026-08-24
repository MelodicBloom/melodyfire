import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

const root = join(process.cwd(), 'client', 'src');
const violations: string[] = [];

function scan(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (['.ts', '.tsx'].includes(extname(path))) {
      readFileSync(path, 'utf8').split('\n').forEach((line, index) => {
        if (/href\s*=\s*["']#[^"']+["']/.test(line)) {
          violations.push(`${relative(process.cwd(), path)}:${index + 1}`);
        }
      });
    }
  }
}

scan(root);
if (violations.length) {
  console.error(`Native fragment links break hash routing:\n${violations.join('\n')}`);
  process.exit(1);
}
console.log('No native fragment links found in client source.');
