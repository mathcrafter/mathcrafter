import { Block } from "./Block";
import { blockStore } from "@/stores/BlockStore";

export interface RewardProps {
    getBlock(): Block;
    getAmount(): number;
}

export class FixedReward implements RewardProps {
    name: string;
    maxAmount: number;
    minAmount: number;
    chancePercentage: number;

    constructor(props: { name: string, maxAmount: number, minAmount: number, chancePercentage: number }) {
        this.name = props.name;
        this.maxAmount = props.maxAmount;
        this.minAmount = props.minAmount;
        this.chancePercentage = props.chancePercentage;
    }

    public getBlock(): Block {
        return blockStore.getItemByName(this.name) as Block;
    }

    public getAmount(): number {
        if (Math.random() < this.chancePercentage) {
            return Math.floor(Math.random() * (this.maxAmount - this.minAmount + 1)) + this.minAmount;
        }

        return 0;
    }
}

export class RandomRewardByRarity implements RewardProps {
    rarity: string;
    amount: number;
    chancePercentage: number;

    constructor(props: { rarity: string, amount: number, chancePercentage: number }) {
        this.rarity = props.rarity;
        this.amount = props.amount;
        this.chancePercentage = props.chancePercentage;
    }

    public getBlock(): Block {
        const blocks = blockStore.getItemsByRarity(this.rarity);
        return blocks[Math.floor(Math.random() * blocks.length)];
    }

    public getAmount(): number {
        return this.amount;
    }
}

export interface ChestProps {
    name: string;
    size: string;
    description: string;
    rewards: Array<RewardProps>;
}

export class Chest implements ChestProps {
    name: string;
    size: string;
    description: string;
    rewards: Array<RewardProps>;

    constructor(props: ChestProps) {
        this.name = props.name;
        this.size = props.size;
        this.description = props.description;
        this.rewards = props.rewards;
    }

    public open(): Array<{ block: Block, amount: number }> {
        return this.rewards.map(reward => ({ block: reward.getBlock(), amount: reward.getAmount() }));
    }
}