import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const app = await readFile('client/src/App.tsx', 'utf8');
assert.match(app, /lazy\(\(\) => import\('\.\/pages\/HovercraftEvidencePage'\)\)/u);
assert.match(app, /<Route path="\/hovercraft" component=\{HovercraftEvidencePage\}/u);

const footer = await readFile('client/src/components/Footer.tsx', 'utf8');
assert.match(footer, /Hovercraft Evidence['"], href: ['"]\/hovercraft/u, 'Internal navigation must expose the route');

const page = await readFile('client/src/pages/HovercraftEvidencePage.tsx', 'utf8');
assert.match(page, /SectionLink/u, 'In-page navigation must preserve the hash route');
assert.doesNotMatch(page, /href\s*=\s*["']#/u, 'In-page links must not replace the hash-router URL');
assert.match(page, /AURELITH \/ Melodyfire/u);
assert.match(page, /NACRE\/\/OS/u);
assert.match(page, /Observation Ad Pipeline/u);
for (const label of ['Problem', 'Exact contribution', 'Technology', 'Implementation status']) {
  assert.match(page, new RegExp(`>${label}<`, 'u'), `Evidence cards must expose ${label}`);
}
assert.match(page, /TouchDesigner, physical computing, hardware integration, and on-site AV are not represented/u);
assert.match(page, /AURELITH canonical repo\/deployment remains unresolved/u);
assert.match(page, /Private repository · access required/u);
assert.match(page, /job-boards\.greenhouse\.io\/hovercraft\/jobs\/4281732009/u);

const proof = await readFile('client/src/components/hovercraft/HovercraftShaderProof.tsx', 'utf8');
assert.match(proof, /prefers-reduced-motion: reduce/u);
assert.match(proof, /shader['"]\) === ['"]fallback/u, 'QA must be able to force the non-WebGL path');
assert.match(proof, /transferControlToOffscreen/u);
assert.match(proof, /Math\.min\(window\.devicePixelRatio \|\| 1, 1\.5\)/u);
assert.match(proof, /onPointerMove=\{handlePointerMove\}/u);
assert.match(proof, /onKeyDown=\{handleKeyDown\}/u);
assert.match(proof, /ArrowLeft/u);
assert.match(proof, /Static fallback/u);
assert.match(proof, /useRef\(\{ x: 0\.5, y: 0\.5 \}\)/u, 'Transient pointer values must stay in a ref');

const worker = await readFile('client/src/workers/hovercraftShader.worker.ts', 'utf8');
assert.match(worker, /spectral\.mid\.frag/u, 'Shader provenance must be recorded');
assert.match(worker, /requestAnimationFrame\(draw\)/u);
assert.match(worker, /now - lastInputAt > 1400/u, 'The shader must have a defined idle state');
assert.match(worker, /Math\.min\(Math\.max\(nextPixelRatio, 1\), 1\.5\)/u, 'Worker must enforce the DPR cap');
assert.doesNotMatch(worker, /useState/u, 'Frame-loop values must never enter React state');

console.log('hovercraft-evidence:ok');
