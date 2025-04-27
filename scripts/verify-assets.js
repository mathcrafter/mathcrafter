#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Configure the base path (same as in deployment)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
console.log(`Verifying assets with base path: "${basePath}"`);

// Define the output directory
const outDir = path.join(process.cwd(), 'out');

// Function to recursively find all HTML and CSS files
function findFiles(directory, extensions) {
    let results = [];

    if (!fs.existsSync(directory)) {
        console.error(`Directory does not exist: ${directory}`);
        return results;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
        const filePath = path.join(directory, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            results = results.concat(findFiles(filePath, extensions));
        } else if (stat.isFile() && extensions.includes(path.extname(filePath).toLowerCase())) {
            results.push(filePath);
        }
    }

    return results;
}

// Find all HTML and CSS files
const htmlFiles = findFiles(outDir, ['.html']);
const cssFiles = findFiles(outDir, ['.css']);
const jsonFiles = findFiles(outDir, ['.json']);

console.log(`Found ${htmlFiles.length} HTML files, ${cssFiles.length} CSS files, and ${jsonFiles.length} JSON files`);

// Function to check asset references in a file
function checkAssets(filePath, patterns) {
    const content = fs.readFileSync(filePath, 'utf8');
    const relativeFilePath = filePath.replace(outDir, '');
    let issues = [];

    for (const pattern of patterns) {
        const matches = content.match(pattern.regex);
        if (matches) {
            for (const match of matches) {
                const assetPath = match.match(pattern.extractRegex)[1];

                // Check if the asset path has the correct base path
                if (basePath && !assetPath.startsWith(basePath) && !assetPath.startsWith('http')) {
                    issues.push({
                        file: relativeFilePath,
                        assetPath,
                        issue: `Missing base path prefix. Should be: ${basePath}${assetPath}`
                    });
                }
            }
        }
    }

    return issues;
}

// Patterns to look for in HTML files
const htmlPatterns = [
    { regex: /src=["'][^"']*\/assets\/[^"']*["']/g, extractRegex: /src=["']([^"']*)["']/ },
    { regex: /href=["'][^"']*\.(?:css|png|jpg|svg|ico|webp)["']/g, extractRegex: /href=["']([^"']*)["']/ }
];

// Patterns to look for in CSS files
const cssPatterns = [
    { regex: /url\([^)]*\)/g, extractRegex: /url\(['"]*([^'"\)]+)['"]*\)/ }
];

// Patterns to look for in JSON files (like manifest.json)
const jsonPatterns = [
    { regex: /"src":\s*"[^"]*"/g, extractRegex: /"src":\s*"([^"]*)"/ }
];

// Check all files
let allIssues = [];

for (const file of htmlFiles) {
    const issues = checkAssets(file, htmlPatterns);
    allIssues = allIssues.concat(issues);
}

for (const file of cssFiles) {
    const issues = checkAssets(file, cssPatterns);
    allIssues = allIssues.concat(issues);
}

for (const file of jsonFiles) {
    const issues = checkAssets(file, jsonPatterns);
    allIssues = allIssues.concat(issues);
}

// Print results
if (allIssues.length === 0) {
    console.log('✅ No asset path issues found!');
} else {
    console.log(`❌ Found ${allIssues.length} asset path issues:`);
    for (const issue of allIssues) {
        console.log(`  - ${issue.file}: ${issue.assetPath} -> ${issue.issue}`);
    }
}

// Also check manifest.json specifically
const manifestPath = path.join(outDir, 'manifest.json');
if (fs.existsSync(manifestPath)) {
    console.log('\nChecking manifest.json:');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    if (manifest.icons && Array.isArray(manifest.icons)) {
        let manifestIssues = 0;

        for (const icon of manifest.icons) {
            if (icon.src && basePath && !icon.src.startsWith(basePath) && !icon.src.startsWith('http')) {
                console.log(`  - Icon path issue: ${icon.src} should be ${basePath}${icon.src}`);
                manifestIssues++;
            }
        }

        if (manifestIssues === 0) {
            console.log('  ✅ manifest.json icons look good!');
        }
    }
} else {
    console.log('\n❌ manifest.json not found in output directory');
} 