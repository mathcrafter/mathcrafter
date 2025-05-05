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
            new FixedReward({ name: "runic", maxAmount: 20, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 5, chancePercentage: 0.7 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 5, chancePercentage: 0.1 })
        ]
    }),
    new Chest({
        name: "silver",
        size: "small",
        description: "A silver chest",
        rewards: [
            new FixedReward({ name: "runic", maxAmount: 30, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 8, chancePercentage: 0.5 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 50, chancePercentage: 1 }),
        ]
    }),
    new Chest({
        name: "gold",
        size: "small",
        description: "A gold chest",
        rewards: [
            new FixedReward({ name: "runic", maxAmount: 40, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 60, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 120, chancePercentage: 1 }),
        ]
    }),
    new Chest({
        name: "diamond",
        size: "small",
        description: "A diamond chest",
        rewards: [
            new FixedReward({ name: "runic", maxAmount: 100, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 100, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 200, chancePercentage: 1 }),
        ]
    }),
    new Chest({
        name: "mythical",
        size: "small",
        description: "A mythical chest",
        rewards: [
            new FixedReward({ name: "runic", maxAmount: 100, minAmount: 1, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Rare", amount: 150, chancePercentage: 1 }),
            new RandomRewardByRarity({ rarity: "Common", amount: 250, chancePercentage: 1 }),
        ]
    })
]

export const chestStore = new ChestStore(chests);