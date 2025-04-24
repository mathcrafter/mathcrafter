import { generateId } from "@/controllers/GameController";
import { biomeStore } from "@/stores/BiomeStore";

export interface Biome {
    name: string;
    description: string;
    availableBlocks: string[];
}

export class PlayerBiome {
    id: string;
    type: string;

    constructor({ id, type }: { id: string | null, type: string }) {
        this.id = id || generateId();
        this.type = type;
    }

    public getBiome(): Biome {
        return biomeStore.getItemByName(this.type);
    }

    public getImageUrl(): string {
        return `/assets/biomes/${this.getBiome().name.toLowerCase()}.webp`;
    }
}