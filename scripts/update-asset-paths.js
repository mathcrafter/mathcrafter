#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('Starting asset path update script...');

// Function to recursively find all files with .tsx or .ts extension
function findFiles(directory, extensions) {
    let results = [];

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory() && file !== 'node_modules' && file !== '.next' && file !== 'out') {
            results = results.concat(findFiles(filePath, extensions));
        } else if (stat.isFile() && extensions.includes(path.extname(filePath))) {
            results.push(filePath);
        }
    }

    return results;
}

// Function to update asset paths in a file
function updateAssetPaths(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Check if the file already imports the getAssetPath function
    const hasImport = content.includes("import { getAssetPath }") ||
        content.includes("import {getAssetPath}");

    // Match patterns like src="/assets/..." or src={'/assets/...'}
    const patterns = [
        { regex: /src=["']\/(assets\/[^"']+)["']/g, replacement: 'src={getAssetPath(\'/$1\')}' },
        { regex: /src={\s*["']\/(assets\/[^"']+)["']\s*}/g, replacement: 'src={getAssetPath(\'/$1\')}' }
    ];

    for (const pattern of patterns) {
        if (pattern.regex.test(content)) {
            content = content.replace(pattern.regex, pattern.replacement);
            modified = true;
        }
    }

    // If we modified the file and it doesn't have the import, add it
    if (modified && !hasImport) {
        // Find a good place to add the import
        // This is a simple approach - in a real script you might want to use a proper TS/JS parser
        const importLines = content.match(/import.*from.*/g) || [];
        if (importLines.length > 0) {
            const lastImport = importLines[importLines.length - 1];
            const lastImportIndex = content.lastIndexOf(lastImport) + lastImport.length;

            const beforeImport = content.substring(0, lastImportIndex);
            const afterImport = content.substring(lastImportIndex);

            content = beforeImport + '\nimport { getAssetPath } from \'../utils/assetPath\';' + afterImport;
        } else {
            // If no imports found, add at the beginning after any shebang or comments
            content = 'import { getAssetPath } from \'../utils/assetPath\';\n\n' + content;
        }

        console.log(`Added import to ${filePath}`);
    }

    if (modified) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated asset paths in ${filePath}`);
        return true;
    }

    return false;
}

// Find all potential files to update
const srcDir = path.join(process.cwd(), 'src');
const files = findFiles(srcDir, ['.tsx', '.ts', '.jsx', '.js']);

console.log(`Found ${files.length} files to check`);

// Update asset paths in all files
let updatedCount = 0;
for (const file of files) {
    const updated = updateAssetPaths(file);
    if (updated) {
        updatedCount++;
    }
}

console.log(`Updated ${updatedCount} files with asset path fixes`);
console.log('Asset path update complete!'); 