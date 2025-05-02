import { blockStore } from "@/stores/BlockStore";
import { getAssetPath } from "@/utils/assetPath";
import { biomeStore } from "@/stores/BiomeStore";
import { Biome } from "./Biome";
import { recipeStore } from "@/stores/RecipeStore";
import { Recipe } from "./Recipe";

export interface Block {
    name: string;
    rarity: "Common" | "Uncommon" | "Rare" | "Legendary";

    // Method to get biomes where this block can be found
    getBiomes?(): Biome[];

    // Method to get recipes that use this block as an ingredient
    getRecipesToCraft?(): Recipe[];
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

    public getRecipesToCraft(): Recipe[] {
        // Get all recipes where this block is used as an ingredient
        return recipeStore.items.filter(recipe =>
            recipe.ingredients.some(ingredient => ingredient.item === this.name)
        );
    }
}