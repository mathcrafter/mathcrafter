import { blockStore } from '../src/stores/BlockStore';
import { pickaxeStore } from '../src/stores/PickaxeStore';
import { biomeStore } from '../src/stores/BiomeStore';

// Function to check if an item exists in a store
function itemExists(store: any, itemName: string): boolean {
    try {
        return store.map.get(itemName.toLowerCase()) !== undefined;
    } catch (error) {
        return false;
    }
}

// Check that all pickaxes referenced in biomes exist
function checkBiomePickaxes(): void {
    console.log("\n🔍 Checking that pickaxes referenced in biomes exist in pickaxe store...");
    const biomes = biomeStore.items;
    let errors = 0;

    for (const biome of biomes) {
        if (!biome.availablePickaxes) continue;

        for (const pickaxeName of biome.availablePickaxes) {
            if (!itemExists(pickaxeStore, pickaxeName)) {
                console.error(`❌ Error: Pickaxe "${pickaxeName}" referenced in biome "${biome.name}" does not exist in pickaxe store`);
                errors++;
            }
        }
    }

    if (errors === 0) {
        console.log("✅ All pickaxes referenced in biomes exist in pickaxe store");
    } else {
        console.log(`❌ Found ${errors} missing pickaxe references`);
    }
}

// Check that all blocks referenced in biomes exist
function checkBiomeBlocks(): void {
    console.log("\n🔍 Checking that blocks referenced in biomes exist in block store...");
    const biomes = biomeStore.items;
    let errors = 0;

    for (const biome of biomes) {
        if (!biome.availableBlocks) continue;

        for (const blockName of biome.availableBlocks) {
            if (!itemExists(blockStore, blockName)) {
                console.error(`❌ Error: Block "${blockName}" referenced in biome "${biome.name}" does not exist in block store`);
                errors++;
            }
        }

        // Check biome cost block
        if (biome.cost && biome.cost.itemType) {
            if (!itemExists(blockStore, biome.cost.itemType)) {
                console.error(`❌ Error: Cost block "${biome.cost.itemType}" referenced in biome "${biome.name}" does not exist in block store`);
                errors++;
            }
        }
    }

    if (errors === 0) {
        console.log("✅ All blocks referenced in biomes exist in block store");
    } else {
        console.log(`❌ Found ${errors} missing block references in biomes`);
    }
}

// Check that all blocks referenced in pickaxes exist
function checkPickaxeBlocks(): void {
    console.log("\n🔍 Checking that blocks referenced in pickaxes exist in block store...");
    const pickaxes = pickaxeStore.items;
    let errors = 0;

    for (const pickaxe of pickaxes) {
        if (pickaxe.cost && pickaxe.cost.itemType) {
            if (!itemExists(blockStore, pickaxe.cost.itemType)) {
                console.error(`❌ Error: Cost block "${pickaxe.cost.itemType}" referenced in pickaxe "${pickaxe.name}" does not exist in block store`);
                errors++;
            }
        }
    }

    if (errors === 0) {
        console.log("✅ All blocks referenced in pickaxes exist in block store");
    } else {
        console.log(`❌ Found ${errors} missing block references in pickaxes`);
    }
}

// Run all checks
function runAllChecks(): void {
    console.log("🔄 Starting store integrity checks...");

    checkBiomePickaxes();
    checkBiomeBlocks();
    checkPickaxeBlocks();

    console.log("\n✨ Store integrity checks completed");
}

// Execute checks
runAllChecks(); 