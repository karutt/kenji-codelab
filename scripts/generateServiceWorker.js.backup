// @ts-nocheck
import fs from 'fs';
import path from 'path';

// Source and target files
const SOURCE_SW_TEMPLATE = path.join(process.cwd(), 'src/sw-template.js');
const TARGET_SW = path.join(process.cwd(), 'public/sw.js');
const SOURCE_MANIFEST = path.join(process.cwd(), 'src/app/manifest.json');
const TARGET_MANIFEST = path.join(process.cwd(), 'public/manifest.json');

// Read the static asset list directly
const staticAssetPath = path.join(process.cwd(), 'src/utils/cache/staticAssetList.ts');
const staticAssetContent = fs.readFileSync(staticAssetPath, 'utf8');

// Parse the STATIC_ASSETS array from the file content using regex
const staticAssetsMatch = staticAssetContent.match(/STATIC_ASSETS\s*=\s*(\[[\s\S]*?\n\])/);
if (!staticAssetsMatch) {
    console.error('Could not find STATIC_ASSETS in the file');
    process.exit(1);
}

const STATIC_ASSETS = JSON.parse(staticAssetsMatch[1].replace(/,\s*$/, ''));

// Read the template
console.log('Reading Service Worker template...');
const swTemplate = fs.readFileSync(SOURCE_SW_TEMPLATE, 'utf8');

// Replace the placeholder with the actual asset list
console.log(`Generating Service Worker with ${STATIC_ASSETS.length} static assets...`);
const staticAssetsJson = JSON.stringify(STATIC_ASSETS, null, 4)
    .replace(/^\[/g, '[\n    ')
    .replace(/\]$/g, '\n]')
    .replace(/,/g, ',\n    ');

const swContent = swTemplate.replace('__STATIC_ASSETS__', staticAssetsJson);

// Write the generated service worker
fs.writeFileSync(TARGET_SW, swContent);
console.log(`Service Worker generated successfully at ${TARGET_SW}`);

// Copy manifest.json to public directory
console.log('Copying manifest.json to public directory...');
fs.copyFileSync(SOURCE_MANIFEST, TARGET_MANIFEST);
console.log(`Manifest copied to ${TARGET_MANIFEST}`);
