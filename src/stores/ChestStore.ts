import { Chest, FixedReward, RandomRewardByRarity } from "@/models/Chest";
import { Store } from "./Store";

export class ChestStore extends Store<Chest> {
    constructor(chests: Chest[]) {
        super(chests);
    }

    public getChestsBySize(size: string): Chest[] {
        return this.items.filter(chest => chest.size === size);
    }
}

const chests: Chest[] = [
    new Chest({
        name: "wooden",
        size: "small",
        description: "A wooden chest",
        rewards: [
            new FixedReward({ name: "runic", maxAmount: 12, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 5, chancePercentage: 0.7 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 5, chancePercentage: 0.1 })
        ]
    }),
    new Chest({
        name: "iron",
        size: "small",
        description: "An iron chest",
        rewards: [
            new RandomRewardByRarity({ rarity: "Common", amount: 5, chancePercentage: 0.7 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 5, chancePercentage: 0.1 })
        ]
    }),
    new Chest({
        name: "silver",
        size: "small",
        description: "A silver chest",
        rewards: [
            new RandomRewardByRarity({ rarity: "Rare", amount: 8, chancePercentage: 0.5 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 50, chancePercentage: 1 }),
        ]
    }),
    new Chest({
        name: "gold",
        size: "small",
        description: "A gold chest",
        rewards: [
            new RandomRewardByRarity({ rarity: "Rare", amount: 60, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 120, chancePercentage: 1 }),
        ]
    }),
]

export const chestStore = new ChestStore(chests);