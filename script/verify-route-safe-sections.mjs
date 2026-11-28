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

for (const path of ['client/src/pages/GenerativeArtPage.tsx', 'client/src/pages/KaleidoscopePage.tsx']) {
  const source = await readFile(path, 'utf8');
  assert.match(source, /<GalleryGrid/u, `${path} must use the shared GalleryGrid`);
  assert.doesNotMatch(source, /href\s*=\s*["']#/u, `${path} must not mutate the hash-router URL`);
  assert.doesNotMatch(source, /column-count|columnCount/u, `${path} must not reintroduce column masonry`);
}
const focusTheater = await readFile('client/src/components/gallery/FocusTheater.tsx', 'utf8');
assert.match(focusTheater, /<dialog/u);
assert.match(focusTheater, /aria-labelledby/u);
const galleryCss = await readFile('client/src/components/gallery/densify.css', 'utf8');
assert.match(galleryCss, /prefers-reduced-motion: reduce/u);
assert.match(galleryCss, /--gg-cols/u);

console.log('route-safety:ok');
