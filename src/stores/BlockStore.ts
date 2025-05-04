import { Block } from "@/models/Block";
import { Store } from "./Store";

export class BlockStore extends Store<Block> {
    constructor(blocks: Block[]) {
        super(blocks);
    }

    public getItemsByRarity(rarity: string): Block[] {
        return this.items.filter(block => block.rarity === rarity) as Block[];
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
    {
        name: "netherrack",
        rarity: "Common",
    },
    {
        name: "soul_sand",
        rarity: "Common",
    },
    {
        name: "nether_brick",
        rarity: "Common",
    },
    {
        name: "nether_quartz",
        rarity: "Rare",
    },
    {
        name: "glowstone_dust",
        rarity: "Common",
    },
    {
        name: "ruby",
        rarity: "Rare",
    },
    {
        name: "nylium",
        rarity: "Common",
    },
    {
        name: "warp_wart",
        rarity: "Common",
    },
    {
        name: "blackstone",
        rarity: "Common",
    },
    {
        name: "malachite",
        rarity: "Rare",
    },
    {
        name: "shroomlight",
        rarity: "Common",
    },
    {
        name: "ender_dust",
        rarity: "Common",
    },
    {
        name: "brown_mushroom",
        rarity: "Common",
    },
    {
        name: "red_mushroom",
        rarity: "Common",
    },
    {
        name: "cursed_earth",
        rarity: "Common",
    },
    {
        name: "dawn_stone",
        rarity: "Common",
    },
    {
        name: "dusk_stone",
        rarity: "Common",
    },
    {
        name: "mycelium",
        rarity: "Common",
    },
    {
        name: "acacia_wood",
        rarity: "Common",
    },
    {
        name: "amber",
        rarity: "Common",
    },
    {
        name: "green_mushroom",
        rarity: "Common",
    },
    {
        name: "acorn",
        rarity: "Common",
    },
    {
        name: "circadian_dust",
        rarity: "Common",
    },
    {
        name: "endstone",
        rarity: "Common",
    },
    {
        name: "purpur",
        rarity: "Common",
    },
    {
        name: "chorus_plant",
        rarity: "Common",
    },
    {
        name: "chorus_flower",
        rarity: "Common",
    },
    {
        name: "endstone_bricks",
        rarity: "Common",
    },
    {
        name: "amethyst",
        rarity: "Common",
    },
    {
        name: "enderium",
        rarity: "Common",
    },
    {
        name: "ender_essence",
        rarity: "Common",
    },
    {
        name: "sand_of_clock",
        rarity: "Common",
    },
    {
        name: "clock_gear",
        rarity: "Common",
    },
    {
        name: "book_of_time",
        rarity: "Common",
    },
    {
        name: "secret_of_time",
        rarity: "Common",
    },
    {
        name: "time_stone",
        rarity: "Common",
    },
    {
        name: "time_key_fragment",
        rarity: "Common",
    },
    {
        name: "time_key",
        rarity: "Common",
    },
    {
        name: "circuit_board",
        rarity: "Common",
    },
    {
        name: "clock_spring",
        rarity: "Common",
    },
    {
        name: "blight_vine",
        rarity: "Common",
    },
    {
        name: "blighted_soil",
        rarity: "Common",
    },
    {
        name: "ivory_wood",
        rarity: "Common",
    },
    {
        name: "komatiite",
        rarity: "Common",
    },
    {
        name: "mana_crystal",
        rarity: "Common",
    },
    {
        name: "astral_silver",
        rarity: "Common",
    },
    {
        name: "orichalcum",
        rarity: "Uncommon",
    },
    {
        name: "adamantine",
        rarity: "Uncommon",
    },
    {
        name: "wizard_wood",
        rarity: "Rare",
    },
    {
        name: "enchanted_soil",
        rarity: "Rare",
    },
    {
        name: "purity_shard",
        rarity: "Rare",
    },
    {
        name: "signalite",
        rarity: "Rare",
    },
    {
        name: "blighted_goo",
        rarity: "Rare",
    },
    {
        name: "unicorn_horn",
        rarity: "Legendary",
    },
    {
        name: "sunstone",
        rarity: "Common",
    },
    {
        name: "sunspot",
        rarity: "Common",
    },
    {
        name: "plasma",
        rarity: "Common",
    },
    {
        name: "star_core",
        rarity: "Uncommon",
    },
    {
        name: "tritium",
        rarity: "Rare",
    },
    {
        name: "hydrogen",
        rarity: "Rare",
    },
    {
        name: "qbit",
        rarity: "Rare",
    },
    {
        name: "rocket_fuel",
        rarity: "Rare",
    },
    {
        name: "dyson_sphere_part",
        rarity: "Legendary",
    },
    {
        name: "quantum_chip",
        rarity: "Legendary",
    },
    {
        name: "comet_dust",
        rarity: "Legendary",
    },
    {
        name: "cookie",
        rarity: "Uncommon",
    },
    {
        name: "coffee",
        rarity: "Uncommon",
    },
    {
        name: "special",
        rarity: "Rare",
    },
    {
        name: "runic",
        rarity: "Rare",
    }
]

export const blockStore = new BlockStore(blocks);