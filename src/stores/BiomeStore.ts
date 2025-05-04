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
        maxHealth: 11,
        chest: "small",
        cost: null,
    },
    {
        name: "desert",
        description: "A dry, sandy biome.",
        availableBlocks: ["sand", "glass", "sandstone", "cactus"],
        availablePickaxes: ["cactus", "sandstone", "glass"],
        maxHealth: 11,
        chest: "small",
        cost: null,
    },
    {
        name: "tundra",
        description: "A cold, snowy biome.",
        availableBlocks: ["snow", "ice", "birchwood", "sapphire", "winter_candy"],
        availablePickaxes: ["birchwood", "ice", "sapphire", "candy"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "sandstone"
        },
    },
    {
        name: "caves",
        description: "A dark, underground biome.",
        availableBlocks: ["stone", "gravel", "coal", "iron", "gold", "diamond", "redstone", "copper"],
        availablePickaxes: ["stone", "iron", "gold", "diamond", "arctic_copper"],
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "pearl"
        },
    },
    {
        name: "nether",
        description: "A dark, fiery biome.",
        availableBlocks: ["netherrack", "soul_sand", "nether_brick", "nether_quartz", "glowstone_dust", "ruby"],
        availablePickaxes: ["glowstone", "ruby"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "obsidian"
        },
    },
    {
        name: "warped_woods",
        description: "A dark, warped biome.",
        availableBlocks: ["nylium", "warp_wart", "blackstone", "malachite", "shroomlight", "ender_dust"],
        availablePickaxes: ["blackstone", "malachite"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "ruby"
        },
    },
    {
        name: "twilight_forest",
        description: "A dark, forest biome.",
        availableBlocks: ["brown_mushroom", "red_mushroom", "cursed_earth", "dawn_stone", "dusk_stone", "mycelium", "acacia_wood", "amber", "green_mushroom", "acorn", "circadian_dust"],
        availablePickaxes: ["mushroom", "amber", "circadian"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "shroomlight"
        },
    },
    {
        name: "the_end",
        description: "A bright, end biome.",
        availableBlocks: ["endstone", "purpur", "chorus_plant", "chorus_flower", "endstone_bricks", "amethyst", "enderium", "ender_essence"],
        availablePickaxes: ["amethyst", "enderium", "endstone", "purpur"],
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
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
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "alien_ooze"
        },
    },
    {
        name: "blighted_planet",
        description: "A blighted biome.",
        availableBlocks: ["blight_vine", "blighted_soil", "ivory_wood", "komatiite", "mana_crystal", "astral_silver", "orichalcum", "adamantine", "wizard_wood", "enchanted_soil", "purity_shard", "signalite", "blighted_goo", "unicorn_horn"],
        availablePickaxes: ["blight", "ivory_wood", "mana", "orichalcum", "adamantine", "astral_silver", "purity", "unicorn"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "opal"
        },
    },
    {
        name: "sun",
        description: "A sun biome.",
        availableBlocks: ["sunstone", "sunspot", "plasma", "star_core", "tritium", "hydrogen", "qbit", "rocket_fuel", "dyson_sphere_part", "quantum_chip", "comet_dust"],
        availablePickaxes: ["star_core", "plasma", "tritium"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "rocket_fuel"
        },
    },
    {
        name: "chronos_lair",
        description: "A chronos biome.",
        availableBlocks: ["sand_of_clock", "clock_gear", "book_of_time", "secret_of_time", "time_stone", "time_key_fragment", "time_key", "circuit_board", "clock_spring"],
        availablePickaxes: ["chronos_lair", "clock_gear"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "time_key"
        },
    },
    {
        name: "the_void",
        description: "A void biome.",
        availableBlocks: ["static", "struct", "null", "enum_crystal", "bool", "graviton", "off_bit", "on_bit", "c_sharp"],
        availablePickaxes: ["enum", "struct", "null"],
        maxHealth: 11,
        chest: "small",
        cost: {
            amount: 1,
            itemType: "graviton"
        },
    },
]

export const biomeStore = new BiomeStore(biomes);