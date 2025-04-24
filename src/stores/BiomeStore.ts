import { Biome } from "@/models/Biome";
import { Store } from "./Store";

export class BiomeStore extends Store<Biome> {
    constructor(biomes: Biome[]) {
        super(biomes);
    }
}


const biomes: Biome[] = [
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

export const biomeStore = new BiomeStore(biomes);