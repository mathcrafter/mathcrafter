# MathZDrillz Scripts

This folder contains utility scripts for the MathZDrillz project.

## Available Scripts

### Store Integrity Checker

Validates the integrity of game stores:
- Checks that pickaxes referenced in the biome store exist in the pickaxe store
- Checks that blocks referenced in the biome store exist in the block store
- Checks that blocks referenced in the pickaxe store exist in the block store

## Usage

To set up dependencies, run:

```bash
cd scripts
nvm use 22
uv pip install
```

To run the store integrity check:

```bash
cd scripts
nvm use 22
npm run check-stores
```

# Common Blocks Feature

This feature adds common blocks to every mine in MathCrafter. Players will receive a mix of biome-specific blocks and common blocks when mining.

## Implementation

The game now uses the existing block rarity attribute to determine which blocks should be common across all biomes:

1. When mining, there's a 15% chance to mine a "Common" rarity block from the current biome
2. If the current biome doesn't have any "Common" rarity blocks, it falls back to a random biome-specific block
3. The rarity is defined in the `BlockStore.ts` file for each block

## How It Works

When a player successfully hits a critical strike with their pickaxe:

1. The game determines whether to mine a common block (15% chance) or a biome-specific block
2. If mining a common block, it searches the biome's available blocks for ones with "Common" rarity
3. If common blocks are found, a random one is selected and added to the player's inventory
4. If no common blocks are found in the current biome, a random biome-specific block is used instead

This ensures players have access to common materials regardless of which biome they're mining, while still preserving the uniqueness of each biome.
