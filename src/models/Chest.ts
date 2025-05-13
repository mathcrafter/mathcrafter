import { pickaxeStore } from "@/stores/PickaxeStore";
import { Block } from "./Block";
import { blockStore } from "@/stores/BlockStore";
import { Pickaxe } from "./Pickaxe";

export interface RewardProps {
    get(): Block | Pickaxe;
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

    public get(): Block | Pickaxe {
        return blockStore.getItemByName(this.name) as Block | Pickaxe;
    }

    public getAmount(): number {
        if (Math.random() < this.chancePercentage) {
            return Math.floor(Math.random() * (this.maxAmount - this.minAmount + 1)) + this.minAmount;
        }

        return 0;
    }
}

export class RandomBlockByRarity implements RewardProps {
    rarity: string;
    amount: number;
    chancePercentage: number;

    constructor(props: { rarity: string, amount: number, chancePercentage: number }) {
        this.rarity = props.rarity;
        this.amount = props.amount;
        this.chancePercentage = props.chancePercentage;
    }

    public get(): Block | Pickaxe {
        const blocks = blockStore.getItemsByRarity(this.rarity);
        return blocks[Math.floor(Math.random() * blocks.length)];
    }

    public getAmount(): number {
        return this.amount;
    }
}

export class RandomPickaxeByRarity implements RewardProps {
    rarity: string;
    chancePercentage: number;

    constructor(props: { rarity: string, chancePercentage: number }) {
        this.rarity = props.rarity;
        this.chancePercentage = props.chancePercentage;
    }

    public get(): Pickaxe | Block {
        const pickaxes = pickaxeStore.getItemsByRarity(this.rarity);
        return pickaxes[Math.floor(Math.random() * pickaxes.length)];
    }

    public getAmount(): number {
        return 1;
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

    public open(): Array<{ block: Block | Pickaxe, amount: number }> {
        return this.rewards.map(reward => ({ block: reward.get(), amount: reward.getAmount() }));
    }
}