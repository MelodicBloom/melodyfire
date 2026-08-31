import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const sectionPages = [
  'client/src/pages/RegenerativePage.tsx',
  'client/src/pages/ReedSmithInnovationLabPage.tsx',
  'client/src/pages/ChildrensArtPage.tsx',
  'client/src/pages/PortfolioPage.tsx',
  'client/src/pages/ReversePromptPage.tsx',
];

for (const path of sectionPages) {
  const source = await readFile(path, 'utf8');
  assert.doesNotMatch(source, /href\s*=\s*["']#/u, `${path} must not mutate the hash-router URL for in-page navigation`);
  assert.match(source, /SectionLink/u, `${path} must use route-safe section navigation`);
}

const sectionLink = await readFile('client/src/components/SectionLink.tsx', 'utf8');
assert.match(sectionLink, /prefers-reduced-motion: reduce/u);
assert.match(sectionLink, /target\.focus/u);
assert.match(sectionLink, /event\.preventDefault/u);

const services = await readFile('client/src/pages/ServicesPage.tsx', 'utf8');
assert.doesNotMatch(services, /['"]\/childrens-art['"]/u);
assert.doesNotMatch(services, /href=["']\/portfolio["']/u);
assert.match(services, /cta_href: '\/children-art'/u);
assert.match(services, /href="\/work"/u);

console.log('route-safety:ok');
