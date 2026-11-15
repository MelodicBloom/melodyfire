import { readFileSync } from 'node:fs';

const footer = readFileSync(new URL('../client/src/components/Footer.tsx', import.meta.url), 'utf8');
const motion = readFileSync(new URL('../client/src/pages/MotionOraclePage.tsx', import.meta.url), 'utf8');

const request = 'mailto:jennipher@melodicbloom.com?subject=Motion%20Oracle%20Framework%20Request';
if (!motion.includes(`href="${request}"`)) {
  throw new Error('Motion Oracle request CTA must target the configured framework-request mailto.');
}
if (!footer.includes('https://www.instagram.com/jennipher.laura/')) {
  throw new Error('Footer Instagram link must target @jennipher.laura.');
}
if (footer.includes('https://instagram.com/') || footer.includes('https://www.instagram.com/\"')) {
  throw new Error('Generic Instagram homepage/placeholder destination remains.');
}
console.log('PASS: Motion Oracle request CTA and Instagram destination are revision-bound in source.');
