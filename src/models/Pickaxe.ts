import { generateId } from "@/controllers/GameController";
import { pickaxeStore } from "@/stores/PickaxeStore";

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
    rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
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
        this.health = health || this.getPickaxe().maxHealth;
    }

    private getPickaxe(): Pickaxe {
        return pickaxeStore.getItemByName(this.type)
    }

    public getImageUrl(): string {
        return `/assets/pickaxes/${this.getPickaxe().name.toLowerCase()}.webp`;
    }

    public damage(amount: number): PlayerPickaxe {
        var health = this.health -= amount;
        if (health <= 0) {
            health = 0;
        }

        return new PlayerPickaxe({ id: this.id, type: this.type, health: health });
    }
}
