# MathCrafter - Next.js Version

This is the Next.js version of MathCrafter, a Minecraft-inspired educational game that helps kids practice their math facts.

## Technology Stack

- **Next.js**: React framework for production
- **TypeScript**: For type safety
- **CSS Modules**: For component-scoped styling
- **React Hooks**: For state management

## Project Structure

```
mathcrafter/
├── public/            # Static assets
│   └── assets/        # Game assets (images)
├── src/
│   ├── components/    # React components
│   ├── pages/         # Next.js pages
│   ├── styles/        # CSS styles
│   └── utils/         # Utility functions and types
├── .gitignore         # Git ignore file
├── next.config.js     # Next.js configuration
├── package.json       # Project dependencies
├── README.md          # Project documentation
└── tsconfig.json      # TypeScript configuration
```

## Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Building for Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Benefits of Next.js

- **React Framework**: Built on React with simplified component development
- **Server-Side Rendering**: Better SEO and initial load performance
- **API Routes**: Easy backend functionality without separate server
- **Static Site Generation**: Can pre-render pages for faster loading
- **Image Optimization**: Automatic image optimization via Next.js
- **TypeScript Support**: Full TypeScript integration
- **Fast Refresh**: Quick feedback during development
- **CSS Modules**: Scoped CSS with no configuration

## Future Enhancements

- Implement API routes for storing high scores
- Add authentication to track individual player progress
- Use static site generation for landing pages
- Implement server-side rendering for dynamic content
- Add more advanced biomes and game mechanics 