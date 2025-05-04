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
]

export const chestStore = new ChestStore(chests);