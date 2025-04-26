import { generateId } from "@/controllers/GameController";
import { pickaxeStore } from "@/stores/PickaxeStore";
import { Biome } from "./Biome";

export interface Cost {
    amount: number;
    itemType: string;
}

export interface Pickaxe {
    name: string;
    strength: number;
    critical: number;
    cost: Cost;
    power: string;
    rarity: "Common" | "Uncommon" | "Rare" | "Epic" | "Seasonal" | "Legendary";
    description: string;
    notes: string;
    maxHealth: number;
}

export class PlayerPickaxe {
    id: string;
    type: string;
    health: number;

    constructor({ id, type, health }: { id: string | null, type: string, health: number | null }) {
        this.id = id || generateId();
        this.type = type;

        // If health is null, set to max health from pickaxe definition
        if (health === null) {
            this.health = this.getPickaxe().maxHealth;
        } else {
            this.health = health;
        }
    }

    public getPickaxe(): Pickaxe {
        return pickaxeStore.getItemByName(this.type)
    }

    public getImageUrl(): string {
        return `/assets/pickaxes/${this.getPickaxe().name.toLowerCase()}.png`;
    }

    public getPicks(): number {
        const pickaxeDef = this.getPickaxe();
        let picks = pickaxeDef.strength * 10;
        if (Math.random() < pickaxeDef.critical) {
            picks += 1000 * pickaxeDef.critical;
        }
        return Math.round(picks);
    }

    public getDamageToBiome(biome: Biome): number {
        const pickaxeDef = this.getPickaxe();
        if (Math.random() < pickaxeDef.critical) {
            return 2 * pickaxeDef.strength;
        }
        return pickaxeDef.strength;
    }

    public withDamage(amount: number): PlayerPickaxe {
        // Calculate new health without modifying the original object
        const newHealth = Math.max(0, this.health - amount);

        // Return a new PlayerPickaxe instance with the updated health
        return new PlayerPickaxe({ id: this.id, type: this.type, health: newHealth });
    }
}
