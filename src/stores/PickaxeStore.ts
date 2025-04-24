import { pickaxes } from "@/models/Pickaxe";
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

export const pickaxeStore = new PickaxeStore(pickaxes);
