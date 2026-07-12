import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const pairs = [
  ['aline-vs-further','Aline','Further'],['aline-vs-ecp','Aline','ECP'],['aline-vs-welcomehome','Aline','WelcomeHome'],['aline-vs-advantage-anywhere','Aline','Advantage Anywhere'],
  ['further-vs-ecp','Further','ECP'],['further-vs-welcomehome','Further','WelcomeHome'],['further-vs-advantage-anywhere','Further','Advantage Anywhere'],
  ['ecp-vs-welcomehome','ECP','WelcomeHome'],['ecp-vs-advantage-anywhere','ECP','Advantage Anywhere'],['welcomehome-vs-advantage-anywhere','WelcomeHome','Advantage Anywhere'],
  ['quid-vs-aline','Quid','Aline'],['quid-vs-further','Quid','Further'],['quid-vs-ecp','Quid','ECP'],['quid-vs-welcomehome','Quid','WelcomeHome'],['quid-vs-advantage-anywhere','Quid','Advantage Anywhere'],
];
const esc = (s) => s.replaceAll('&','&amp;').replaceAll('<','&lt;');
await mkdir('public/comparisons', { recursive:true });
for (const [slug,a,b] of pairs) {
  const size = Math.max(a.length,b.length)>16 ? 68 : 82;
  const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="1200" height="630" fill="#f6f0e5"/><circle cx="1085" cy="95" r="190" fill="#dce6dc"/><circle cx="95" cy="585" r="160" fill="#f0d6c5"/><rect x="62" y="54" width="1076" height="522" rx="34" fill="#fffdf8" stroke="#d9d2c6"/><text x="98" y="118" font-family="Arial,sans-serif" font-size="22" font-weight="700" letter-spacing="4" fill="#a44d2d">2026 COMPARISON</text><text x="98" y="235" font-family="Georgia,serif" font-size="${size}" font-weight="700" fill="#173f35">${esc(a)}</text><text x="98" y="315" font-family="Georgia,serif" font-size="45" font-style="italic" fill="#a44d2d">vs</text><text x="98" y="420" font-family="Georgia,serif" font-size="${size}" font-weight="700" fill="#173f35">${esc(b)}</text><text x="98" y="500" font-family="Arial,sans-serif" font-size="25" fill="#546b64">Senior Living Software Comparison · 2026</text><text x="1000" y="525" font-family="Georgia,serif" font-size="44" font-weight="700" fill="#173f35">Quid</text></svg>`;
  await sharp(Buffer.from(svg)).png({compressionLevel:9}).toFile(`public/comparisons/${slug}.png`);
}
