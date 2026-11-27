import { readFileSync } from 'node:fs';

const footer = readFileSync(new URL('../client/src/components/Footer.tsx', import.meta.url), 'utf8');
const motion = readFileSync(new URL('../client/src/pages/MotionOraclePage.tsx', import.meta.url), 'utf8');

const request = 'mailto:jennipher@melodicbloom.com?subject=Motion%20Oracle%20Framework%20Request';
const requestLink = [...motion.matchAll(/<a\b([^>]*)>\s*([^<]+?)\s*<\/a>/g)]
  .find(([, attributes]) => attributes.includes(`href="${request}"`));
if (requestLink?.[2] !== 'Request the Framework') {
  throw new Error('Motion Oracle request CTA must say Request the Framework and target the configured framework-request mailto.');
}
if (!footer.includes('https://www.instagram.com/jennipher.laura/')) {
  throw new Error('Footer Instagram link must target @jennipher.laura.');
}
if (/https:\/\/(?:www\.)?instagram\.com\/?(?=["'])/.test(footer)) {
  throw new Error('Generic Instagram homepage/placeholder destination remains.');
}
console.log('PASS: Motion Oracle request CTA and Instagram destination are revision-bound in source.');
