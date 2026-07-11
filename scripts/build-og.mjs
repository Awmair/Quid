import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve('.');
const mascot = await sharp(resolve(root, 'src/assets/brand/quid-hero.png'))
  .resize({ height: 540, withoutEnlargement: true })
  .png()
  .toBuffer();
const wordmark = await sharp(await readFile(resolve(root, 'src/assets/brand/quid-wordmark.svg')))
  .resize({ width: 210 })
  .png()
  .toBuffer();

const background = Buffer.from(`
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#FBF7EF"/>
  <path d="M865 -50C1088 -20 1255 115 1252 310C1249 497 1118 617 899 686C820 571 803 448 830 323C856 200 897 88 865 -50Z" fill="#E7DAC4"/>
  <circle cx="1042" cy="147" r="92" fill="#A9B5A6" opacity=".42"/>
  <rect x="58" y="454" width="590" height="118" rx="24" fill="#FFFFFF" stroke="#1E3D34" stroke-opacity=".12"/>
  <rect x="86" y="482" width="144" height="62" rx="14" fill="#EEF2ED"/>
  <rect x="248" y="482" width="144" height="62" rx="14" fill="#EEF2ED"/>
  <rect x="410" y="482" width="210" height="62" rx="14" fill="#F2E2D7"/>
  <circle cx="108" cy="514" r="8" fill="#47685B"/>
  <rect x="124" y="505" width="77" height="8" rx="4" fill="#47685B" opacity=".7"/>
  <rect x="124" y="522" width="55" height="6" rx="3" fill="#A9B5A6"/>
  <circle cx="270" cy="514" r="8" fill="#47685B"/>
  <rect x="286" y="505" width="78" height="8" rx="4" fill="#47685B" opacity=".7"/>
  <rect x="286" y="522" width="62" height="6" rx="3" fill="#A9B5A6"/>
  <circle cx="432" cy="514" r="8" fill="#C0714B"/>
  <rect x="448" y="505" width="136" height="8" rx="4" fill="#C0714B" opacity=".7"/>
  <rect x="448" y="522" width="93" height="6" rx="3" fill="#C0714B" opacity=".42"/>
  <text x="58" y="228" fill="#1E3D34" font-family="DejaVu Sans, Arial, sans-serif" font-size="78" font-weight="700" letter-spacing="-3">More tours.</text>
  <text x="58" y="315" fill="#A85D3B" font-family="DejaVu Serif, Georgia, serif" font-size="82" font-weight="600" font-style="italic" letter-spacing="-2">Less chasing.</text>
  <text x="62" y="376" fill="#47685B" font-family="DejaVu Sans, Arial, sans-serif" font-size="25" font-weight="500">The friendly admissions concierge for senior living.</text>
  <text x="62" y="417" fill="#1E3D34" font-family="DejaVu Sans, Arial, sans-serif" font-size="15" font-weight="700" letter-spacing="3">CALM. CAPABLE. CONCIERGE.</text>
</svg>`);

const output = await sharp(background)
  .composite([
    { input: wordmark, left: 58, top: 52 },
    { input: mascot, left: 835, top: 80 },
  ])
  .png({ compressionLevel: 9, palette: true, quality: 94 })
  .toBuffer();

await Promise.all([
  writeFile(resolve(root, 'public/quid-og.png'), output),
  writeFile(resolve(root, 'src/assets/brand/quid-og.png'), output),
]);

console.log('Created public/quid-og.png (1200x630).');
