import { PlayerPickaxe } from "./Pickaxe";

export class PickaxeInventory {
    items: PlayerPickaxe[];
    currentItem: string | null;

    constructor({ items, currentItem }: { items: PlayerPickaxe[], currentItem: string | null }) {
        this.items = items;

        if (currentItem === null && items.length > 0) {
            this.currentItem = items[0].id;
        } else if (currentItem !== null && items.length > 0) {
            const itemExists = items.some(item => item.id === currentItem);
            this.currentItem = itemExists ? currentItem : items[0].id;
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
        // Filter out the current item
        const items = this.items.filter(item => item.id !== this.currentItem);

        // Create new inventory with the item removed
        return new PickaxeInventory({
            items: items,
            currentItem: items.length > 0 ? items[0].id : null
        });
    }

    public withCurrentItem(playerPickaxe: PlayerPickaxe): PickaxeInventory {
        // Create a new array with the updated item
        const updatedItems = this.items.map(item =>
            item.id === playerPickaxe.id ? playerPickaxe : item
        );

        return new PickaxeInventory({
            items: updatedItems,
            currentItem: playerPickaxe.id
        });
    }

    public withCurrentItemId(pickaxeId: string): PickaxeInventory {
        if (!this.items.some(item => item.id === pickaxeId)) {
            return this;
        }

        return new PickaxeInventory({
            items: [...this.items],
            currentItem: pickaxeId
        });
    }

    public get length(): number {
        return this.items.length;
    }
}