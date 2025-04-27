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
        "name": "martian",
        "strength": 26,
        "critical": 0.85,
        "cost": {
            "amount": 50,
            "itemType": "martian_soil"
        },
        "power": "Martian Power",
        "rarity": "Common",
        "description": "A pickaxe made from martian soil.",
        "notes": "Martian 1.0, Special thanks to Ananasek.",
        "maxHealth": 5,
    },

]

export const pickaxeStore = new PickaxeStore(pickaxes);
