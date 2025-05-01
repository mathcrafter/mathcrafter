# MathCrafter Scripts

This directory contains utility scripts for the MathCrafter project.

## Available Scripts

### `find-unused-css.js`

This script helps identify and remove unused CSS rules from the project's CSS files.

#### Usage

```bash
nvm use 22 && node find-unused-css.js
```

The script will:
1. Scan all CSS files in the `src/styles` directory
2. Find all CSS class names defined in those files
3. Search for references to those class names in the source code
4. Generate cleaned versions of CSS files with unused rules removed
5. Print a report of removed classes

After running the script, review the generated `.cleaned.css` files. If everything looks good, you can replace the original files with the cleaned versions.

```bash
nvm use 22 && mv src/styles/[filename].cleaned.css src/styles/[filename].css
```

## Development

Scripts in this directory use their own dependencies managed with `uv`. To install dependencies:

```bash
nvm use 22
cd scripts
uv pip install -r requirements.txt  # For Python scripts
```
