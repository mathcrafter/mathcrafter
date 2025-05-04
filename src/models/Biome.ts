import { generateId } from "@/controllers/GameController";
import { biomeStore } from "@/stores/BiomeStore";
import { chestStore } from "@/stores/ChestStore";
import { getAssetPath } from "@/utils/assetPath";
import { Chest } from "./Chest";

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
    chest: string;
}

export class PlayerBiome {
    id: string;
    type: string;
    currentHealth: number;
    chest: string;

    constructor({ id, type, currentHealth, chest }: { id: string | null, type: string, currentHealth: number | null, chest: string | null }) {
        this.id = id || generateId();
        this.type = type;
        this.currentHealth = currentHealth || this.getBiome().maxHealth;
        this.chest = chest || this.getBiome().chest;
    }

    public getBiome(): Biome {
        return biomeStore.getItemByName(this.type);
    }

    public getImageUrl(): string {
        return `${getAssetPath(`/assets/biomes/${this.getBiome().name.toLowerCase()}.png`)}`;
    }

    public withDamage(amount: number): PlayerBiome {
        return new PlayerBiome({ id: this.id, type: this.type, currentHealth: this.currentHealth - amount, chest: this.chest });
    }

    public get damagePercent(): number {
        return 100 * this.currentHealth / this.getBiome().maxHealth;
    }

    public getChest(): Chest {
        const chests = chestStore.getChestsBySize(this.chest);
        return chests[Math.floor(Math.random() * chests.length)];
    }
}