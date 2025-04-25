# MathCrafterZ

A math learning game where players solve math problems to mine resources, craft tools, and explore biomes.

## Technology Stack

- **Next.js**: React framework for production
- **TypeScript**: For type safety
- **CSS Modules**: For component-scoped styling
- **React Hooks**: For state management

## Features

- Solve math problems to mine biomes
- Different pickaxes with varying strengths and critical hit chances
- Multiple biomes with different available blocks
- Inventory system for blocks and tools
- Block mining with configurable chance (25% by default)
- Score calculation based on pickaxe strength and critical values
- Quick inventory showing both pickaxes and blocks

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