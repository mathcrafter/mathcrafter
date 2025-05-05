# MathCrafterZ

A math learning game where players solve math problems to mine resources, craft tools, and explore biomes.

## Technology Stack

- **Next.js**: React framework for production
- **TypeScript**: For type safety
- **CSS Modules**: For component-scoped styling
- **React Hooks**: For state management
- **PWA Support**: For offline gameplay capabilities

## Features

- Solve math problems to mine biomes
- Different pickaxes with varying strengths and critical hit chances
- Multiple biomes with different available blocks
- Inventory system for blocks and tools
- Block mining with configurable chance (25% by default)
- Score calculation based on pickaxe strength and critical values
- Quick inventory showing both pickaxes and blocks
- Craft pickaxes using blocks collected from biomes

## Block Mining

When the player correctly answers a math problem, there's a 25% chance (configurable) that they will mine a block from the current biome. The mined block will be:

1. Visually displayed on the biome with a floating animation
2. Added to the player's block inventory
3. Shown with a notification in the top-right corner
4. Displayed in the blocks row of the quick inventory

Each biome has its own set of available blocks:
- Plains: dirt, wood, clay, pumpkin
- Desert: sand, glass, sandstone, cactus
- More biomes to be added...

## Crafting Pickaxes

In the pickaxe shop, players can craft new pickaxes using blocks they've collected:

1. Each pickaxe requires a specific type and amount of blocks (e.g., wood pickaxe requires 25 wood)
2. The buy button is disabled if the player doesn't have enough blocks
3. When purchasing, the required blocks are consumed from the inventory

## Score Calculation

When correctly answering a math problem:
- Score = Pickaxe Strength * 10 + 1000 * Critical Chance
- This score is displayed as a flash animation on the biome panel
- The score is added to the player's total picks

## Configuration

The block mining chance can be configured using the setup script:

```bash
# Install dependencies and set up configuration
./scripts/install_deps.sh --block-mining-chance=0.3

# Or just run the config script directly
./scripts/setupConfig.sh --block-mining-chance=0.5
```

The default block mining chance is 25% (0.25).

## Quick Inventory

The quick inventory shows both pickaxes and blocks:
- Pickaxes row: Shows up to 8 pickaxes with durability bars
- Blocks row: Shows up to 8 blocks with quantity counters

## Offline Capabilities

MathCrafterZ can be played offline after the initial load. The game uses Progressive Web App (PWA) technology to cache assets and enable offline gameplay:

1. Install the PWA dependencies:
   ```bash
   ./scripts/setup_next_offline.sh
   ```

2. Generate PWA icons (requires a source icon):
   ```bash
   ./scripts/generate_pwa_icons.sh
   ```

3. Test the offline functionality:
   ```bash
   ./scripts/test_offline.sh
   ```
   
4. To use the game offline:
   - Visit the game in a modern browser
   - The game assets will be cached automatically
   - You can then play without an internet connection
   - On mobile devices, you can add the game to your home screen for an app-like experience

## Google Analytics Integration

MathCrafterZ includes Google Analytics 4 integration to track user interactions and improve the game experience:

1. Set up your Google Analytics account:
   - Create a new property in Google Analytics
   - Set up a new web data stream
   - Copy your Measurement ID (starts with G-)

2. Configure the environment variable:
   ```bash
   # Create or edit your .env.local file
   echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" > .env.local
   # Replace G-XXXXXXXXXX with your actual measurement ID
   ```

3. Key tracked events:
   - Page views: Automatically tracked when users navigate between pages
   - Biome selection: When users select a new biome
   - Biome unlocking: When users unlock a new biome
   - More events can be added as needed

## Development

1. Install dependencies:
   ```bash
   ./scripts/install_deps.sh
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
mathcrafterz/
├── public/            # Static assets
│   └── assets/        # Game assets (images)
├── src/
│   ├── components/    # React components
│   ├── controllers/   # Game controllers
│   ├── models/        # Game models
│   ├── pages/         # Next.js pages
│   ├── stores/        # Data stores
│   ├── styles/        # CSS styles
│   ├── utils/         # Utility functions
│   └── config/        # Game configuration
├── scripts/           # Utility scripts
│   ├── install_deps.sh  # Dependency installation
│   └── setupConfig.sh   # Configuration setup
├── .gitignore         # Git ignore file
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies
├── README.md          # Project documentation
└── tsconfig.json      # TypeScript configuration
```

## Future Enhancements

- Implement API routes for storing high scores
- Add authentication to track individual player progress
- Use static site generation for landing pages
- Implement server-side rendering for dynamic content
- Add more advanced biomes and game mechanics
- Add crafting system using collected blocks 

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages when code is pushed to the master branch.

### Automatic Deployment

1. Whenever changes are pushed to the master branch, a GitHub Actions workflow will:
   - Build the Next.js application
   - Export it as static HTML/CSS/JS
   - Deploy it to the gh-pages branch
   - Make it available at https://[username].github.io/[repository-name]/

2. To enable GitHub Pages:
   - Go to your repository settings
   - Navigate to "Pages"
   - Set the source branch to "gh-pages"
   - Save the configuration

### Manual Setup

You can also manually prepare the repository for GitHub Pages deployment:

```bash
# Install dependencies for scripts and set up GitHub Pages configuration
./scripts/install_deps.sh --setup-github-pages
```

This script will:
- Create a `.nojekyll` file to prevent GitHub Pages from ignoring files starting with underscores
- Update `next.config.js` to support static exports
- Configure path prefixes for GitHub Pages hosting 