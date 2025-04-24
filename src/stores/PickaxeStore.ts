import { Pickaxe } from "@/models/Pickaxe";

class PickaxeStore {
    pickaxes: Pickaxe[]
    pickaxeMap: Map<string, Pickaxe>

    constructor(pickaxes: Pickaxe[]) {
        this.pickaxes = pickaxes;
        this.pickaxeMap = new Map(pickaxes.map(p => [p.name, p]));
    }

    public getByName(name: string): Pickaxe {
        const pickaxe = this.pickaxeMap.get(name);
        if (!pickaxe) {
            throw new Error(`Pickaxe with name ${name} not found`);
        }
        return pickaxe;
    }
}

export const pickaxes: Pickaxe[] = [
    {
        "name": "wood",
        "strength": 1,
        "critical": 0.01,
        "cost": {
            "amount": 25,
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
        "critical": 0.01,
        "cost": {
            "amount": 100,
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
        "critical": 0.02,
        "cost": {
            "amount": 250,
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
        "critical": 0.02,
        "cost": {
            "amount": 250,
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
        "critical": 0.025,
        "cost": {
            "amount": 500,
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
        "critical": 0.025,
        "cost": {
            "amount": 100,
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
        "critical": 0.025,
        "cost": {
            "amount": 500,
            "itemType": "birchwood"
        },
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe carved fromBirchwood.",
        "notes": "Created by RockShield.",
        "maxHealth": 30,
    },
]

export const pickaxeStore = new PickaxeStore(pickaxes);
