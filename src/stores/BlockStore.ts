import { Block } from "@/models/Block";
import { Store } from "./Store";

export class BlockStore extends Store<Block> {
    constructor(blocks: Block[]) {
        super(blocks);
    }
}

const blocks: Block[] = [
    {
        name: "dirt",
        rarity: "Common",
    },
    {
        name: "wood",
        rarity: "Common",
    },
    {
        name: "clay",
        rarity: "Common",
    },
    {
        name: "pumpkin",
        rarity: "Rare",
    },
    {
        name: "sand",
        rarity: "Common",
    },
    {
        name: "cactus",
        rarity: "Common",
    },
    {
        name: "sandstone",
        rarity: "Common",
    },
    {
        name: "glass",
        rarity: "Rare",
    },
    {
        name: "ice",
        rarity: "Common",
    },
    {
        name: "snow",
        rarity: "Common",
    },
    {
        name: "birchwood",
        rarity: "Common",
    },
    {
        name: "sapphire",
        rarity: "Rare",
    },
    {
        name: "winter_candy",
        rarity: "Rare",
    }
]

export const blockStore = new BlockStore(blocks);