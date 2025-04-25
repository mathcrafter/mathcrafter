import { Biome } from "@/models/Biome";
import { Store } from "./Store";

export class BiomeStore extends Store<Biome> {
    constructor(biomes: Biome[]) {
        super(biomes);
    }
}


const biomes: Biome[] = [
    {
        name: "plains",
        description: "A flat, grassy biome.",
        availableBlocks: ["dirt", "wood", "clay", "pumpkin"],
        maxHealth: 21,
        cost: null,
    },
    {
        name: "desert",
        description: "A dry, sandy biome.",
        availableBlocks: ["sand", "glass", "sandstone", "cactus"],
        maxHealth: 21,
        cost: {
            amount: 1,
            itemType: "pumpkin"
        }
    },
]

export const biomeStore = new BiomeStore(biomes);