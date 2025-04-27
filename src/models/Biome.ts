import { generateId } from "@/controllers/GameController";
import { biomeStore } from "@/stores/BiomeStore";
import { getAssetPath } from "@/utils/assetPath";

export interface Biome {
    name: string;
    description: string;
    availableBlocks: string[];
    availablePickaxes: string[];
    maxHealth: number;
    cost: {
        amount: number;
        itemType: string;
    } | null;
}

export class PlayerBiome {
    id: string;
    type: string;
    currentHealth: number;

    constructor({ id, type, currentHealth }: { id: string | null, type: string, currentHealth: number | null }) {
        this.id = id || generateId();
        this.type = type;
        this.currentHealth = currentHealth || this.getBiome().maxHealth;
    }

    public getBiome(): Biome {
        return biomeStore.getItemByName(this.type);
    }

    public getImageUrl(): string {
        return `${getAssetPath(`/assets/biomes/${this.getBiome().name.toLowerCase()}.png`)}`;
    }

    public withDamage(amount: number): PlayerBiome {
        return new PlayerBiome({ id: this.id, type: this.type, currentHealth: this.currentHealth - amount });
    }

    public get damagePercent(): number {
        return 100 * this.currentHealth / this.getBiome().maxHealth;
    }
}