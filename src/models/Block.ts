import { blockStore } from "@/stores/BlockStore";
import { getAssetPath } from "@/utils/assetPath";
import { biomeStore } from "@/stores/BiomeStore";
import { Biome } from "./Biome";

export interface Block {
    name: string;
    rarity: "Common" | "Uncommon" | "Rare" | "Legendary";

    // Method to get biomes where this block can be found
    getBiomes?(): Biome[];
}

export class PlayerBlock {
    name: string;
    quantity: number;

    constructor({ name, quantity }: { name: string, quantity: number }) {
        this.name = name;
        this.quantity = quantity;
    }

    public getBlock(): Block {
        return blockStore.getItemByName(this.name);
    }

    public getImageUrl(): string {
        return `${getAssetPath(`/assets/blocks/${this.getBlock().name.toLowerCase()}.png`)}`;
    }

    public getBiomes(): Biome[] {
        // Get all biomes where this block is available
        return biomeStore.items.filter(biome =>
            biome.availableBlocks.includes(this.name)
        );
    }
}