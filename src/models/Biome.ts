import { generateId } from "@/controllers/GameController";

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
}