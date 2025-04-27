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
    {
        name: "martian_soil",
        rarity: "Common",
    },
    {
        name: "granite",
        rarity: "Common",
    },
    {
        name: "carbon_snow",
        rarity: "Uncommon",
    },
    {
        name: "carbon_ice",
        rarity: "Uncommon",
    },
    {
        name: "opal",
        rarity: "Rare",
    },
    {
        name: "alien_crystal",
        rarity: "Legendary",
    },
    {
        name: "magma_block",
        rarity: "Common",
    },
    {
        name: "andesite",
        rarity: "Uncommon",
    },
    {
        name: "rhyolite",
        rarity: "Uncommon",
    },
    {
        name: "pumice",
        rarity: "Uncommon",
    },
    {
        name: "basalt",
        rarity: "Uncommon",
    },
    {
        name: "cinnabar",
        rarity: "Rare",
    },
    {
        name: "volcanic_quartz",
        rarity: "Rare",
    },
    {
        name: "obsidian",
        rarity: "Legendary",
    },
]

/**
["netherrack", "soul_sand", "nether_brick", "nether_quartz", "glowstone_dust", "ruby"]
["nylium", "warp_wart", "blackstone", "malachite", "shroomlight", "ender_dust"]
["brown_mushroom", "red_mushroom", "cursed_earth", "dawn_stone", "dusk_stone", "mucelium", "acacia_wood", "amber", "green_mushroom", "acorn", "circadian_dust"]
["endstone", "purpur", "chorus_plant", "chorus_flower", "endstone_bricks", "amethyst", "enderlium", "ender_essence"]
["sand_of_clock", "clock_gear", "book_of_time", "secret_of_time", "time_stone", "time_key_fragment", "time_key", "circuit_board", "clock_spring"]
 * 
 */
export const blockStore = new BlockStore(blocks);