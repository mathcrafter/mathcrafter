import { blockStore } from "@/stores/BlockStore";
import { getAssetPath } from "@/utils/assetPath";

export interface Block {
    name: string;
    rarity: "Common" | "Uncommon" | "Rare" | "Legendary";
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
}