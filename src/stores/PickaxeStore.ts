import { Pickaxe } from "@/models/Pickaxe";
import { Store } from "./Store";

class PickaxeStore extends Store<Pickaxe> {
    constructor(pickaxes: Pickaxe[]) {
        super(pickaxes);
    }
}

const pickaxes: Pickaxe[] = [
    {
        "name": "wood",
        "strength": 1,
        "critical": 0.10,
        "cost": {
            "amount": 5,
            "itemType": "wood"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe carved fromWood.And so it begins.",
        "notes": "Not very good, moving up pickaxes is highly advised.",
        "maxHealth": 5
    },
    {
        "name": "clay",
        "strength": 2,
        "critical": 0.10,
        "cost": {
            "amount": 10,
            "itemType": "clay"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe molded fromClay.",
        "notes": "The first pickaxe to usually be crafted.",
        "maxHealth": 10,
    },
    {
        "name": "pumpkin",
        "strength": 3,
        "critical": 0.20,
        "cost": {
            "amount": 25,
            "itemType": "pumpkin"
        },
        "power": "Spooky Flame",
        "rarity": "Rare",
        "description": "Tormented Pickaxe carved fromPumpkin.",
        "notes": "Very Spooky,Can be found inChests.",
        "maxHealth": 15,
    },
    {
        "name": "cactus",
        "strength": 3,
        "critical": 0.20,
        "cost": {
            "amount": 25,
            "itemType": "cactus"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Prickly Pickaxe carefully crafted fromCactus.",
        "notes": "Hurts to touch.",
        "maxHealth": 15,
    },
    {
        "name": "Sandstone",
        "strength": 4,
        "critical": 0.25,
        "cost": {
            "amount": 5,
            "itemType": "sandstone"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe masoned fromSandstone.",
        "notes": "Feels rough against your hands.",
        "maxHealth": 20,
    },
    {
        "name": "glass",
        "strength": 4,
        "critical": 0.25,
        "cost": {
            "amount": 10,
            "itemType": "glass"
        },
        "power": "Shatter",
        "rarity": "Rare",
        "description": "Fragile Pickaxe cut fromGlass.",
        "notes": "Might break at any moment,Can be found inChests.",
        "maxHealth": 25,
    },
    {
        "name": "birchwood",
        "strength": 5,
        "critical": 0.25,
        "cost": {
            "amount": 5,
            "itemType": "birchwood"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe carved fromBirchwood.",
        "notes": "Created by RockShield.",
        "maxHealth": 30,
    },
    {
        "name": "stone",
        "strength": 5,
        "critical": 0.30,
        "cost": {
            "amount": 25,
            "itemType": "stone"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe hewn from Stone.",
        "notes": "A standard mining tool.",
        "maxHealth": 35,
    },
    {
        "name": "arctic_copper",
        "strength": 6,
        "critical": 0.30,
        "cost": {
            "amount": 50,
            "itemType": "copper"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe smelted from Copper.",
        "notes": "Better than stone, but still entry level.",
        "maxHealth": 40,
    },
    {
        "name": "iron",
        "strength": 7,
        "critical": 0.35,
        "cost": {
            "amount": 100,
            "itemType": "iron"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe forged from Iron.",
        "notes": "A standard issue iron pickaxe.",
        "maxHealth": 45,
    },
    {
        "name": "gold",
        "strength": 8,
        "critical": 0.40,
        "cost": {
            "amount": 250,
            "itemType": "gold"
        },
        "power": "On Fire",
        "rarity": "Uncommon",
        "description": "Pickaxe crafted from Gold.",
        "notes": "Shiny but not very durable.",
        "maxHealth": 50,
    },
    {
        "name": "diamond",
        "strength": 10,
        "critical": 0.50,
        "cost": {
            "amount": 500,
            "itemType": "diamond"
        },
        "power": "On Fire",
        "rarity": "Rare",
        "description": "Pickaxe fashioned from Diamond.",
        "notes": "Hard as diamonds, because it is diamonds.",
        "maxHealth": 60,
    },
    {
        "name": "emerald",
        "strength": 12,
        "critical": 0.60,
        "cost": {
            "amount": 750,
            "itemType": "emerald"
        },
        "power": "On Fire",
        "rarity": "Rare",
        "description": "Pickaxe cut from Emerald.",
        "notes": "Villagers would trade a lot for this.",
        "maxHealth": 70,
    },
    {
        "name": "obsidian",
        "strength": 15,
        "critical": 0.70,
        "cost": {
            "amount": 1000,
            "itemType": "obsidian"
        },
        "power": "On Fire",
        "rarity": "Rare",
        "description": "Pickaxe carved from Obsidian.",
        "notes": "Formed from cooled lava.",
        "maxHealth": 80,
    },
    {
        "name": "enderium",
        "strength": 20,
        "critical": 0.90,
        "cost": {
            "amount": 200,
            "itemType": "endstone"
        },
        "power": "Teleport Strike",
        "rarity": "Legendary",
        "description": "Pickaxe forged with Ender essence.",
        "notes": "Occasionally teleports to its target.",
        "maxHealth": 100,
    },
    {
        "name": "struct",
        "strength": 25,
        "critical": 0.95,
        "cost": {
            "amount": 50,
            "itemType": "struct"
        },
        "power": "Structure",
        "rarity": "Legendary",
        "description": "Pickaxe made from structure blocks.",
        "notes": "Can be found in structure blocks.",
        "maxHealth": 125,
    },
    {
        "name": "enum",
        "strength": 25,
        "critical": 0.95,
        "cost": {
            "amount": 35,
            "itemType": "enum_crystal"
        },
        "power": "Enchantment",
        "rarity": "Legendary",
        "description": "Pickaxe made from enchantment crystals.",
        "notes": "Can be found in enchantment crystals.",
        "maxHealth": 125,
    },
    {
        "name": "null",
        "strength": 25,
        "critical": 0.95,
        "cost": {
            "amount": 25,
            "itemType": "null"
        },
        "power": "Null",
        "rarity": "Legendary",
        "description": "Error - null description. Don't forget to null check this one.",
        "notes": "Can be found in null crystals.",
        "maxHealth": 125,
    },
    {
        "name": "cookie",
        "strength": 15,
        "critical": 0.75,
        "cost": {
            "amount": 1000,
            "itemType": "cookie"
        },
        "power": "Sugar Rush",
        "rarity": "Uncommon",
        "description": "Pickaxe baked from Cookies.",
        "notes": "Smells delicious. Try not to eat it.",
        "maxHealth": 75,
    },
    {
        "name": "coffee_craze",
        "strength": 16,
        "critical": 0.80,
        "cost": {
            "amount": 500,
            "itemType": "coffee"
        },
        "power": "Coffee Craze!",
        "rarity": "Epic",
        "description": "A Coffee Pickaxe dedicated to Coffee Craze. Download now!",
        "notes": "Will keep you up all night, Special Thanks to DeathSquid.",
        "maxHealth": 85,
    },
    {
        "name": "deathsquid",
        "strength": 18,
        "critical": 0.85,
        "cost": {
            "amount": 1000,
            "itemType": "special"
        },
        "power": "Tentacle Helpers",
        "rarity": "Epic",
        "description": "A squid Pickaxe that is made out of tentacles.",
        "notes": "A slippery boi, Special Thanks to DeathSquid.",
        "maxHealth": 95,
    },
    {
        "name": "spooky_pumpkin",
        "strength": 17,
        "critical": 0.80,
        "cost": {
            "amount": 500,
            "itemType": "pumpkin"
        },
        "power": "Hocus Pocus",
        "rarity": "Rare",
        "description": "A Spooky version of the Pumpkin Pickaxe",
        "notes": "Spooky 2.0, Special thanks to DeathSquid.",
        "maxHealth": 85,
    },
    {
        "name": "dark_pumpkin",
        "strength": 19,
        "critical": 0.85,
        "cost": {
            "amount": 750,
            "itemType": "pumpkin"
        },
        "power": "Spooky Flame",
        "rarity": "Rare",
        "description": "A Dark version of the Pumpkin Pickaxe",
        "notes": "Spooky 3.0, Special thanks to Ananasek.",
        "maxHealth": 90,
    },
    {
        "name": "candle",
        "strength": 21,
        "critical": 0.90,
        "cost": {
            "amount": 1000,
            "itemType": "special"
        },
        "power": "Candle Break",
        "rarity": "Legendary",
        "description": "A spooky candly pickaxe with eerie origins.",
        "notes": "Light the way, Special thanks to Ananasek.",
        "maxHealth": 10,
    },
    {
        "name": "transport",
        "strength": 22,
        "critical": 0.85,
        "cost": {
            "amount": 15,
            "itemType": "runic"
        },
        "power": "Road Trip",
        "rarity": "Epic",
        "description": "A pickaxe from another world. It seems mechanical.",
        "notes": "ROAD TRIP! Special Thanks to Welshx7.",
        "maxHealth": 10,
    },
    {
        "name": "beast",
        "strength": 25,
        "critical": 0.95,
        "cost": {
            "amount": 10,
            "itemType": "runic"
        },
        "power": "Beast Mode",
        "rarity": "Seasonal",
        "description": "A fearsome pickaxe with animalistic power.",
        "notes": "Its a shame he was split into 5 pieces, Can be found in Scroll Chest.",
        "maxHealth": 10,
    },
    {
        "name": "scroll",
        "strength": 23,
        "critical": 0.90,
        "cost": {
            "amount": 10,
            "itemType": "runic"
        },
        "power": "Ancient Wisdom",
        "rarity": "Seasonal",
        "description": "A pickaxe made from ancient scrolls of knowledge.",
        "notes": "Easy to read and a portable whacking stick, Can be found in Scroll Chest.",
        "maxHealth": 10,
    },
    {
        "name": "candy",
        "strength": 10,
        "critical": 0.25,
        "cost": {
            "amount": 10,
            "itemType": "winter_candy"
        },
        "power": "Candy Craze",
        "rarity": "Seasonal",
        "description": "A pickaxe made from candy.",
        "notes": "Candy 4.0, Special thanks to Ananasek.",
        "maxHealth": 10,
    },
    {
        "name": "martian",
        "strength": 27,
        "critical": 0.15,
        "cost": {
            "amount": 50,
            "itemType": "martian_soil"
        },
        "power": "Martian Power",
        "rarity": "Common",
        "description": "A pickaxe made from martian.",
        "notes": "Martian 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "opal",
        "strength": 28,
        "critical": 0.15,
        "cost": {
            "amount": 50,
            "itemType": "opal"
        },
        "power": "Opal Power",
        "rarity": "Common",
        "description": "A pickaxe made from opal.",
        "notes": "Opal 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "moon",
        "strength": 24,
        "critical": 0.45,
        "cost": {
            "amount": 50,
            "itemType": "moon_rock"
        },
        "power": "Moon Power",
        "rarity": "Common",
        "description": "A pickaxe made from moon.",
        "notes": "Moon 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "asteroid",
        "strength": 26,
        "critical": 0.50,
        "cost": {
            "amount": 50,
            "itemType": "lunar_meteorite"
        },
        "power": "Asteroid Power",
        "rarity": "Rare",
        "description": "A pickaxe made from asteroid.",
        "notes": "Asteroid 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "alien",
        "strength": 26,
        "critical": 0.90,
        "cost": {
            "amount": 50,
            "itemType": "alien_ooze"
        },
        "power": "Alien Power",
        "rarity": "Rare",
        "description": "A pickaxe made from alien.",
        "notes": "Alien 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "glowstone",
        "strength": 14,
        "critical": 0.25,
        "cost": {
            "amount": 50,
            "itemType": "glowstone_dust"
        },
        "power": "Glowstone Power",
        "rarity": "Common",
        "description": "A pickaxe made from glowstone.",
        "notes": "Glowstone 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "ruby",
        "strength": 15,
        "critical": 0.85,
        "cost": {
            "amount": 50,
            "itemType": "ruby"
        },
        "power": "Ruby Power",
        "rarity": "Rare",
        "description": "A pickaxe made from ruby.",
        "notes": "Ruby 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "fire",
        "strength": 10,
        "critical": 0.50,
        "cost": {
            "amount": 50,
            "itemType": "magma_block"
        },
        "power": "Fire Power",
        "rarity": "Rare",
        "description": "A pickaxe made from fire.",
        "notes": "Fire 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },
    {
        "name": "sandstone",
        "strength": 4,
        "critical": 0.25,
        "cost": {
            "amount": 10,
            "itemType": "sandstone"
        },
        "power": "Desert Power",
        "rarity": "Common",
        "description": "A pickaxe made from sandstone.",
        "notes": "From the desert biome.",
        "maxHealth": 15,
    },
    {
        "name": "ice",
        "strength": 5,
        "critical": 0.30,
        "cost": {
            "amount": 10,
            "itemType": "ice"
        },
        "power": "Freezing Touch",
        "rarity": "Common",
        "description": "A pickaxe made from ice.",
        "notes": "Slippery when wet.",
        "maxHealth": 15,
    },
    {
        "name": "sapphire",
        "strength": 8,
        "critical": 0.40,
        "cost": {
            "amount": 50,
            "itemType": "sapphire"
        },
        "power": "Blue Power",
        "rarity": "Rare",
        "description": "A pickaxe made from sapphire.",
        "notes": "A brilliant blue gem.",
        "maxHealth": 30,
    },
    {
        "name": "lapis",
        "strength": 7,
        "critical": 0.35,
        "cost": {
            "amount": 30,
            "itemType": "lapis_lazuli"
        },
        "power": "Enchanting Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from lapis lazuli.",
        "notes": "Used for enchanting.",
        "maxHealth": 25,
    },
    {
        "name": "red_sandstone",
        "strength": 5,
        "critical": 0.25,
        "cost": {
            "amount": 15,
            "itemType": "red_sandstone"
        },
        "power": "Mesa Power",
        "rarity": "Common",
        "description": "A pickaxe made from red sandstone.",
        "notes": "From the mesa biome.",
        "maxHealth": 20,
    },
    {
        "name": "red_cactus",
        "strength": 6,
        "critical": 0.30,
        "cost": {
            "amount": 20,
            "itemType": "red_cactus"
        },
        "power": "Spiky Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from red cactus.",
        "notes": "Extra spiky.",
        "maxHealth": 20,
    },
    {
        "name": "topaz",
        "strength": 9,
        "critical": 0.45,
        "cost": {
            "amount": 40,
            "itemType": "topaz"
        },
        "power": "Golden Glow",
        "rarity": "Rare",
        "description": "A pickaxe made from topaz.",
        "notes": "Shines with a golden hue.",
        "maxHealth": 30,
    },
    {
        "name": "flower",
        "strength": 3,
        "critical": 0.20,
        "cost": {
            "amount": 10,
            "itemType": "dandelion_seeds"
        },
        "power": "Pollen Power",
        "rarity": "Common",
        "description": "A pickaxe made from flowers.",
        "notes": "Surprisingly sturdy for a floral tool.",
        "maxHealth": 10,
    },
    {
        "name": "jade",
        "strength": 8,
        "critical": 0.40,
        "cost": {
            "amount": 35,
            "itemType": "jade"
        },
        "power": "Jungle Power",
        "rarity": "Rare",
        "description": "A pickaxe made from jade.",
        "notes": "Green as the jungle.",
        "maxHealth": 25,
    },
    {
        "name": "coral",
        "strength": 6,
        "critical": 0.30,
        "cost": {
            "amount": 20,
            "itemType": "coral"
        },
        "power": "Ocean Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from coral.",
        "notes": "Formed in the depths.",
        "maxHealth": 20,
    },
    {
        "name": "trident",
        "strength": 12,
        "critical": 0.50,
        "cost": {
            "amount": 75,
            "itemType": "prismarine"
        },
        "power": "Neptune's Fury",
        "rarity": "Rare",
        "description": "A trident-shaped pickaxe.",
        "notes": "Weapon of the sea god.",
        "maxHealth": 40,
    },
    {
        "name": "pearl",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 50,
            "itemType": "pearl"
        },
        "power": "Luster",
        "rarity": "Rare",
        "description": "A pickaxe made from pearl.",
        "notes": "Shimmers with an iridescent glow.",
        "maxHealth": 30,
    },
    {
        "name": "basalt",
        "strength": 7,
        "critical": 0.35,
        "cost": {
            "amount": 30,
            "itemType": "basalt"
        },
        "power": "Volcanic Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from basalt.",
        "notes": "Formed from cooled lava.",
        "maxHealth": 25,
    },
    {
        "name": "cinnabar",
        "strength": 9,
        "critical": 0.40,
        "cost": {
            "amount": 40,
            "itemType": "cinnabar"
        },
        "power": "Mercury Power",
        "rarity": "Rare",
        "description": "A pickaxe made from cinnabar.",
        "notes": "Contains traces of mercury.",
        "maxHealth": 30,
    },
    {
        "name": "molten",
        "strength": 11,
        "critical": 0.50,
        "cost": {
            "amount": 60,
            "itemType": "magma_block"
        },
        "power": "Molten Power",
        "rarity": "Rare",
        "description": "A pickaxe made from molten material.",
        "notes": "Still hot to the touch.",
        "maxHealth": 35,
    },
    {
        "name": "blackstone",
        "strength": 8,
        "critical": 0.35,
        "cost": {
            "amount": 30,
            "itemType": "blackstone"
        },
        "power": "Warped Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from blackstone.",
        "notes": "From the warped woods.",
        "maxHealth": 25,
    },
    {
        "name": "malachite",
        "strength": 9,
        "critical": 0.40,
        "cost": {
            "amount": 40,
            "itemType": "malachite"
        },
        "power": "Green Power",
        "rarity": "Rare",
        "description": "A pickaxe made from malachite.",
        "notes": "With beautiful green patterns.",
        "maxHealth": 30,
    },
    {
        "name": "mushroom",
        "strength": 6,
        "critical": 0.30,
        "cost": {
            "amount": 20,
            "itemType": "red_mushroom"
        },
        "power": "Fungal Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from mushrooms.",
        "notes": "Surprisingly sturdy for a fungal tool.",
        "maxHealth": 20,
    },
    {
        "name": "amber",
        "strength": 8,
        "critical": 0.40,
        "cost": {
            "amount": 35,
            "itemType": "amber"
        },
        "power": "Preservation",
        "rarity": "Rare",
        "description": "A pickaxe made from amber.",
        "notes": "Contains ancient insects.",
        "maxHealth": 25,
    },
    {
        "name": "circadian",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 50,
            "itemType": "circadian_dust"
        },
        "power": "Time Power",
        "rarity": "Rare",
        "description": "A pickaxe made from circadian material.",
        "notes": "Seems to manipulate time.",
        "maxHealth": 30,
    },
    {
        "name": "amethyst",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 50,
            "itemType": "amethyst"
        },
        "power": "Purple Power",
        "rarity": "Rare",
        "description": "A pickaxe made from amethyst.",
        "notes": "Glows with a purple hue.",
        "maxHealth": 30,
    },
    {
        "name": "endstone",
        "strength": 8,
        "critical": 0.35,
        "cost": {
            "amount": 30,
            "itemType": "endstone"
        },
        "power": "End Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from endstone.",
        "notes": "From the end dimension.",
        "maxHealth": 25,
    },
    {
        "name": "purpur",
        "strength": 9,
        "critical": 0.40,
        "cost": {
            "amount": 40,
            "itemType": "purpur"
        },
        "power": "End City Power",
        "rarity": "Rare",
        "description": "A pickaxe made from purpur.",
        "notes": "From end cities.",
        "maxHealth": 30,
    },
    {
        "name": "blight",
        "strength": 11,
        "critical": 0.50,
        "cost": {
            "amount": 60,
            "itemType": "blight_vine"
        },
        "power": "Corruption",
        "rarity": "Rare",
        "description": "A pickaxe made from blighted material.",
        "notes": "Seems to corrupt what it touches.",
        "maxHealth": 35,
    },
    {
        "name": "ivory_wood",
        "strength": 7,
        "critical": 0.35,
        "cost": {
            "amount": 30,
            "itemType": "ivory_wood"
        },
        "power": "Pale Power",
        "rarity": "Uncommon",
        "description": "A pickaxe made from ivory wood.",
        "notes": "White as bone.",
        "maxHealth": 25,
    },
    {
        "name": "mana",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 50,
            "itemType": "mana_crystal"
        },
        "power": "Magical Power",
        "rarity": "Rare",
        "description": "A pickaxe made from mana crystals.",
        "notes": "Flows with magical energy.",
        "maxHealth": 30,
    },
    {
        "name": "orichalcum",
        "strength": 12,
        "critical": 0.55,
        "cost": {
            "amount": 70,
            "itemType": "orichalcum"
        },
        "power": "Ancient Power",
        "rarity": "Epic",
        "description": "A pickaxe made from orichalcum.",
        "notes": "A legendary metal of myths.",
        "maxHealth": 40,
    },
    {
        "name": "adamantine",
        "strength": 14,
        "critical": 0.60,
        "cost": {
            "amount": 80,
            "itemType": "adamantine"
        },
        "power": "Unyielding",
        "rarity": "Epic",
        "description": "A pickaxe made from adamantine.",
        "notes": "Nearly indestructible.",
        "maxHealth": 45,
    },
    {
        "name": "astral_silver",
        "strength": 11,
        "critical": 0.50,
        "cost": {
            "amount": 60,
            "itemType": "astral_silver"
        },
        "power": "Starlight",
        "rarity": "Rare",
        "description": "A pickaxe made from astral silver.",
        "notes": "Forged with starlight.",
        "maxHealth": 35,
    },
    {
        "name": "purity",
        "strength": 13,
        "critical": 0.55,
        "cost": {
            "amount": 75,
            "itemType": "purity_shard"
        },
        "power": "Cleansing",
        "rarity": "Epic",
        "description": "A pickaxe made from purity shards.",
        "notes": "Cleanses corruption.",
        "maxHealth": 40,
    },
    {
        "name": "unicorn",
        "strength": 15,
        "critical": 0.65,
        "cost": {
            "amount": 100,
            "itemType": "unicorn_horn"
        },
        "power": "Rainbow Power",
        "rarity": "Legendary",
        "description": "A pickaxe made from unicorn horn.",
        "notes": "Rare and magical.",
        "maxHealth": 50,
    },
    {
        "name": "star_core",
        "strength": 16,
        "critical": 0.70,
        "cost": {
            "amount": 100,
            "itemType": "star_core"
        },
        "power": "Stellar Power",
        "rarity": "Legendary",
        "description": "A pickaxe made from star core.",
        "notes": "Contains the power of a star.",
        "maxHealth": 55,
    },
    {
        "name": "plasma",
        "strength": 17,
        "critical": 0.75,
        "cost": {
            "amount": 120,
            "itemType": "plasma"
        },
        "power": "Plasma Power",
        "rarity": "Legendary",
        "description": "A pickaxe made from plasma.",
        "notes": "Fourth state of matter.",
        "maxHealth": 60,
    },
    {
        "name": "tritium",
        "strength": 18,
        "critical": 0.80,
        "cost": {
            "amount": 150,
            "itemType": "tritium"
        },
        "power": "Isotope Power",
        "rarity": "Legendary",
        "description": "A pickaxe made from tritium.",
        "notes": "Radioactive isotope.",
        "maxHealth": 65,
    },
    {
        "name": "chronos_lair",
        "strength": 19,
        "critical": 0.85,
        "cost": {
            "amount": 200,
            "itemType": "time_key"
        },
        "power": "Time Control",
        "rarity": "Legendary",
        "description": "A pickaxe from Chronos' Lair.",
        "notes": "Can manipulate the flow of time.",
        "maxHealth": 70,
    },
    {
        "name": "clock_gear",
        "strength": 16,
        "critical": 0.70,
        "cost": {
            "amount": 100,
            "itemType": "clock_gear"
        },
        "power": "Clockwork",
        "rarity": "Epic",
        "description": "A pickaxe made from clock gears.",
        "notes": "Ticks with every swing.",
        "maxHealth": 55,
    },
    {
        "name": "tumbleweed",
        "strength": 10,
        "critical": 0.65,
        "cost": {
            "amount": 100,
            "itemType": "tumbleweed"
        },
        "power": "Tumbleweed Power",
        "rarity": "Rare",
        "description": "A pickaxe made from tumbleweed.",
        "notes": "Blows away with the wind.",
        "maxHealth": 5,
    },
    {
        "name": "torch",
        "strength": 15,
        "critical": 0.45,
        "cost": {
            "amount": 10,
            "itemType": "runic"
        },
        "power": "Torch Power",
        "rarity": "Rare",
        "description": "A pickaxe made from torch.",
        "notes": "Burns with a torch.",
        "maxHealth": 5,
    },
    {
        "name": "chest",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 10,
            "itemType": "runic"
        },
        "power": "Chest Power",
        "rarity": "Rare",
        "description": "A pickaxe made from chest.",
        "notes": "Contains a chest.",
        "maxHealth": 5,
    },
    {
        "name": "ender_chest",
        "strength": 10,
        "critical": 0.45,
        "cost": {
            "amount": 20,
            "itemType": "runic"
        },
        "power": "Ender Chest Power",
        "rarity": "Rare",
        "description": "A pickaxe made from ender chest.",
        "notes": "Contains an ender chest.",
        "maxHealth": 5,
    },
    {
        "name": "unstable",
        "strength": 20,
        "critical": 0.90,
        "cost": {
            "amount": 20,
            "itemType": "runic"
        },
        "power": "Unstable Power",
        "rarity": "Rare",
        "description": "A pickaxe made from unstable material.",
        "notes": "Contains unstable material.",
        "maxHealth": 5,
    },
]

export const pickaxeStore = new PickaxeStore(pickaxes);
