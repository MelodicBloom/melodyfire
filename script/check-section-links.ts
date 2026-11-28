import { readdirSync, readFileSync } from 'node:fs';
import { extname, join, relative } from 'node:path';

import ts from 'typescript';

const root = join(process.cwd(), 'client', 'src');
const violations: string[] = [];

function scan(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) scan(path);
    else if (['.ts', '.tsx'].includes(extname(path))) {
      const source = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
      function visit(node: ts.Node) {
        if (ts.isJsxAttribute(node) && node.name.getText(source) === 'href') {
          const initializer = node.initializer;
          const value = initializer && ts.isJsxExpression(initializer) ? initializer.expression : initializer;
          if (value && ts.isStringLiteralLike(value) && value.text.startsWith('#') && value.text.length > 1) {
            const { line } = source.getLineAndCharacterOfPosition(node.getStart(source));
            violations.push(`${relative(process.cwd(), path)}:${line + 1}`);
          }
        }
        ts.forEachChild(node, visit);
      }
      visit(source);
    }
  }
}

scan(root);
if (violations.length) {
  console.error(`Native fragment links break hash routing:\n${violations.join('\n')}`);
  process.exit(1);
}
console.log('No native fragment links found in client source.');
