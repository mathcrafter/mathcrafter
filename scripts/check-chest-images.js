#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function checkChestImages() {
    try {
        // Read the ChestStore file to extract chest types
        const chestStorePath = path.join(__dirname, '../src/stores/ChestStore.ts');
        const chestStoreContent = fs.readFileSync(chestStorePath, 'utf8');

        // Extract chest names using regex
        const chestNameRegex = /name: "(\w+)"/g;
        const matches = [...chestStoreContent.matchAll(chestNameRegex)];
        const chestNames = matches.map(match => match[1]);

        console.log('Found chest types in ChestStore:', chestNames);

        // Check if corresponding image files exist
        const chestImagesDir = path.join(__dirname, '../public/assets/chests');

        // Create directory if it doesn't exist
        if (!fs.existsSync(chestImagesDir)) {
            fs.mkdirSync(chestImagesDir, { recursive: true });
            console.log(`Created directory: ${chestImagesDir}`);
        }

        // Check for each chest type
        const missingChests = [];

        chestNames.forEach(chestName => {
            const imagePath = path.join(chestImagesDir, `${chestName}.png`);
            if (!fs.existsSync(imagePath)) {
                missingChests.push(chestName);
            }
        });

        if (missingChests.length === 0) {
            console.log('✅ All chest images exist!');
        } else {
            console.log('❌ Missing chest images:');
            missingChests.forEach(name => {
                console.log(`  - ${name}.png`);
            });
            console.log(`\nPlease add these images to: ${chestImagesDir}`);
        }

    } catch (error) {
        console.error('Error checking chest images:', error);
    }
}

// Run the check
checkChestImages(); 