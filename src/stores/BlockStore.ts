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
    },
    {
        name: "stone",
        rarity: "Common",
    },
    {
        name: "gravel",
        rarity: "Common",
    },
    {
        name: "coal",
        rarity: "Uncommon",
    },
    {
        name: "iron",
        rarity: "Uncommon",
    },
    {
        name: "gold",
        rarity: "Rare",
    },
    {
        name: "diamond",
        rarity: "Legendary",
    },
    {
        name: "redstone",
        rarity: "Rare",
    },
    {
        name: "copper",
        rarity: "Uncommon",
    },
    {
        name: "emerald",
        rarity: "Legendary",
    },
    {
        name: "jasper",
        rarity: "Rare",
    },
    {
        name: "lapis_lazuli",
        rarity: "Rare",
    },
    {
        name: "deepslate",
        rarity: "Uncommon",
    },
    {
        name: "calcite",
        rarity: "Common",
    },
    {
        name: "bedrock",
        rarity: "Legendary",
    },
    {
        name: "red_sand",
        rarity: "Common",
    },
    {
        name: "hardened_clay",
        rarity: "Common",
    },
    {
        name: "red_sandstone",
        rarity: "Common",
    },
    {
        name: "red_cactus",
        rarity: "Uncommon",
    },
    {
        name: "topaz",
        rarity: "Rare",
    },
    {
        name: "tumbleweed",
        rarity: "Common",
    },
    {
        name: "dandelion_seeds",
        rarity: "Common",
    },
    {
        name: "coffee_beans",
        rarity: "Common",
    },
    {
        name: "podzol",
        rarity: "Common",
    },
    {
        name: "jungle_log",
        rarity: "Uncommon",
    },
    {
        name: "orchid_seeds",
        rarity: "Uncommon",
    },
    {
        name: "jade",
        rarity: "Rare",
    },
    {
        name: "coral",
        rarity: "Rare",
    },
    {
        name: "ocean_sand",
        rarity: "Common",
    },
    {
        name: "sponge",
        rarity: "Uncommon",
    },
    {
        name: "live_rock",
        rarity: "Uncommon",
    },
    {
        name: "prismarine",
        rarity: "Rare",
    },
    {
        name: "pearl",
        rarity: "Legendary",
    },
    {
        name: "static",
        rarity: "Common",
    },
    {
        name: "struct",
        rarity: "Common",
    },
    {
        name: "null",
        rarity: "Common",
    },
    {
        name: "enum_crystal",
        rarity: "Rare",
    },
    {
        name: "bool",
        rarity: "Common",
    },
    {
        name: "graviton",
        rarity: "Legendary",
    },
    {
        name: "off_bit",
        rarity: "Legendary",
    },
    {
        name: "on_bit",
        rarity: "Legendary",
    },
    {
        name: "c_sharp",
        rarity: "Legendary",
    },
    {
        name: "moon_rock",
        rarity: "Common",
    },
    {
        name: "aluminum",
        rarity: "Common",
    },
    {
        name: "diorite",
        rarity: "Common",
    },
    {
        name: "lunar_meteorite",
        rarity: "Rare",
    },
    {
        name: "alien_ooze",
        rarity: "Rare",
    },
    {
        name: "cheese",
        rarity: "Common",
    },
]

export const blockStore = new BlockStore(blocks);