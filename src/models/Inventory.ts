import { PlayerPickaxe } from "./Pickaxe";

export class PickaxeInventory {
    items: PlayerPickaxe[];
    currentItem: string | null;

    constructor({ items, currentItem }: { items: PlayerPickaxe[], currentItem: string | null }) {
        this.items = items;
        if (currentItem === null && items.length > 0) {
            this.currentItem = items[0].id;
        } else {
            this.currentItem = null;
        }
    }

    public getCurrentItem(): PlayerPickaxe | null {
        if (this.currentItem === null) {
            return null;
        }

        return this.items.find(item => item.id === this.currentItem) || null;
    }

    public add(item: PlayerPickaxe): PickaxeInventory {
        return new PickaxeInventory({ items: [...this.items, item], currentItem: this.currentItem });
    }

    public remove(item: PlayerPickaxe): PickaxeInventory {
        return new PickaxeInventory({ items: this.items.filter(i => i.id !== item.id), currentItem: this.currentItem });
    }

    public removeCurrentItem(): PickaxeInventory {
        const items = this.items.filter(item => item.id !== this.currentItem)
        return new PickaxeInventory({ items: items, currentItem: items.length > 0 ? items[0].id : null });
    }

    public length(): number {
        return this.items.length;
    }

    public withCurrentItem(playerPickaxe: PlayerPickaxe): PickaxeInventory {
        return new PickaxeInventory({ items: this.items.map(item => item.id === this.currentItem ? playerPickaxe : item), currentItem: playerPickaxe.id });
    }
}