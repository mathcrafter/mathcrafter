#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const manifestPath = path.join(process.cwd(), 'public', 'manifest.json');

console.log(`Updating manifest.json with basePath: ${basePath}`);

try {
    // Read the manifest file
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Fix the icon paths to include the basePath
    if (manifest.icons && Array.isArray(manifest.icons)) {
        manifest.icons = manifest.icons.map(icon => {
            if (icon.src && icon.src.startsWith('/')) {
                icon.src = `${basePath}${icon.src}`;
            }
            return icon;
        });
    }

    // Fix start_url if it exists
    if (manifest.start_url) {
        manifest.start_url = basePath || '.';
    }

    // Write the updated manifest
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('Successfully updated manifest.json');
} catch (error) {
    console.error('Error updating manifest.json:', error);
    process.exit(1);
} 