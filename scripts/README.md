# MathCrafter Scripts

This directory contains utility scripts for the MathCrafter game.

## Scripts

### update_hint_cost.js

Updates the hint cost in the game.

Usage:
```bash
nvm use 22 && ./scripts/update_hint_cost.js [new_cost]
```

- `[new_cost]`: Optional. The new cost in picks for using a hint. Default is 500.

Example:
```bash
# Set hint cost to 1000 picks
nvm use 22 && ./scripts/update_hint_cost.js 1000
```

## Development

When creating new scripts:

1. Place all scripts in this directory
2. Make scripts executable with `chmod +x script_name.js`
3. Use the shebang `#!/usr/bin/env node` at the top of each script
4. Use `uv` to manage dependencies for this folder
5. Always prefix the script execution with `nvm use 22`
