import { Biome } from "@/models/Biome";
import { Store } from "./Store";

export class BiomeStore extends Store<Biome> {
    constructor(biomes: Biome[]) {
        super(biomes);
    }
}


const biomes: Biome[] = [
    {
        name: "plains",
        description: "A flat, grassy biome.",
        availableBlocks: ["dirt", "wood", "clay", "pumpkin"],
        availablePickaxes: ["wood", "clay", "pumpkin"],
        maxHealth: 1000,
        cost: null,
    },
    {
        name: "desert",
        description: "A dry, sandy biome.",
        availableBlocks: ["sand", "glass", "sandstone", "cactus"],
        availablePickaxes: ["cactus", "sandstone", "glass"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "pumpkin"
        }
    },
    {
        name: "tundra",
        description: "A cold, snowy biome.",
        availableBlocks: ["snow", "ice", "birchwood", "sapphire", "winter_candy"],
        availablePickaxes: ["birchwood", "ice", "sapphire", "candy"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "sandstone"
        },
    },
    {
        name: "caves",
        description: "A dark, underground biome.",
        availableBlocks: ["stone", "gravel", "coal", "iron", "gold", "diamond", "redstone", "copper"],
        availablePickaxes: ["stone", "iron", "gold", "diamond", "copper"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "sapphire"
        },
    },
    {
        name: "deep_caverns",
        description: "A deep, dark biome.",
        availableBlocks: ["emerald", "jasper", "lapis_lazuli", "deepslate", "calcite", "bedrock"],
        availablePickaxes: ["emerald", "lapis"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "copper"
        },
    },
    {
        name: "mesa",
        description: "A hot, sandy biome.",
        availableBlocks: ["red_sand", "hardened_clay", "red_sandstone", "red_cactus", "topaz", "tumbleweed"],
        availablePickaxes: ["red_sandstone", "red_cactus", "topaz"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "bedrock"
        },
    },
    {
        name: "jungle",
        description: "A dense, tropical biome.",
        availableBlocks: ["dandelion_seeds", "coffee_beans", "podzol", "jungle_log", "orchid_seeds", "jade"],
        availablePickaxes: ["flower", "jade"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "topaz"
        }
    },
    {
        name: "ocean",
        description: "A deep, blue biome.",
        availableBlocks: ["coral", "ocean_sand", "sponge", "live_rock", "prismarine", "pearl"],
        availablePickaxes: ["coral", "trident", "pearl"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "jade"
        }
    },
    {
        name: "lava_fields",
        description: "A hot, lava biome.",
        availableBlocks: ["magma_block", "andesite", "rhyolite", "pumice", "basalt", "cinnabar", "volcanic_quartz", "obsidian"],
        availablePickaxes: ["basalt", "cinnabar", "molten"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "pearl"
        },
    },
    {
        name: "nether",
        description: "A dark, fiery biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "obsidian"
        },
    },
    {
        name: "warped_woods",
        description: "A dark, warped biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "ruby"
        },
    },
    {
        name: "twilight_forest",
        description: "A dark, forest biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "shroomlight"
        },
    },
    {
        name: "the_end",
        description: "A bright, end biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "amber"
        },
    },
    {
        name: "moon",
        description: "A moon biome.",
        availableBlocks: ["moon_rock", "aluminum", "diorite", "lunar_meteorite", "alien_ooze", "cheese"],
        availablePickaxes: ["moon", "asteroid", "alien"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "enderium"
        },
    },
    {
        name: "mars",
        description: "A mars biome.",
        availableBlocks: ["martian_soil", "granite", "carbon_snow", "carbon_ice", "opal", "alien_crystal"],
        availablePickaxes: ["martian", "opal"],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "alien_ooze"
        },
    },
    {
        name: "blighted_planet",
        description: "A blighted biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "opal"
        },
    },
    {
        name: "sun",
        description: "A sun biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "rocket_fuel"
        },
    },
    {
        name: "chronos_lair",
        description: "A chronos biome.",
        availableBlocks: [],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "time_key"
        },
    },
    {
        name: "the_void",
        description: "A void biome.",
        availableBlocks: ["static", "struct", "null", "enum_crystal", "bool", "graviton", "off_bit", "on_bit", "c_sharp"],
        availablePickaxes: [],
        maxHealth: 1000,
        cost: {
            amount: 1,
            itemType: "graviton"
        },
    },
]

export const biomeStore = new BiomeStore(biomes);