export interface Pickaxe {
    name: string;
    strength: number;
    critical: number;
    cost: number;
    power: string;
    rarity: string;
    description: string;
    notes: string;
    health: number;
    maxHealth: number;
}

export const pickaxes: Pickaxe[] = [
    {
        "name": "Wood",
        "strength": 1,
        "critical": 0.01,
        "cost": 25,
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe carved fromWood.And so it begins.",
        "notes": "Not very good, moving up pickaxes is highly advised.",
        "maxHealth": 5,
        "health": 5
    },
    {
        "name": "Clay",
        "strength": 2,
        "critical": 0.01,
        "cost": 100,
        "power": "On Fire",
        "rarity": "Common",
        "description": "Pickaxe molded fromClay.",
        "notes": "The first pickaxe to usually be crafted.",
        "maxHealth": 10,
        "health": 10
    },
    {
        "name": "Pumpkin",
        "strength": 3,
        "critical": 0.02,
        "cost": 250,
        "power": "Spooky Flame",
        "rarity": "Rare",
        "description": "Tormented Pickaxe carved fromPumpkin.",
        "notes": "Very Spooky,Can be found inChests.",
        "maxHealth": 15,
        "health": 15
    },
]