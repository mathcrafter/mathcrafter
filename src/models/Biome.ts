export interface Biome {
    name: string;
    description: string;
    availableBlocks: string[];
}

export const biomes: Biome[] = [
    {
        name: "Plains",
        description: "A flat, grassy biome.",
        availableBlocks: ["dirt", "wood", "clay", "pumpkin"]
    },
    {
        name: "Desert",
        description: "A dry, sandy biome.",
        availableBlocks: ["sand", "glass", "sandstone", "cactus"]
    },
]
