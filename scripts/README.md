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
