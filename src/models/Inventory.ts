import { PlayerPickaxe } from "./Pickaxe";
import { PlayerBlock } from "./Block";

export class Inventory<T> {
    items: T[];

    constructor({ items }: { items: T[] }) {
        this.items = items;
    }

    public add(item: T): Inventory<T> {
        return new Inventory({ items: [...this.items, item] });
    }

    public remove(item: T): Inventory<T> {
        return new Inventory({ items: this.items.filter(i => i !== item) });
    }

    public get length(): number {
        return this.items.length;
    }
}

export class PickaxeInventory extends Inventory<PlayerPickaxe> {
    currentItem: string | null;

    constructor({ items, currentItem }: { items: PlayerPickaxe[], currentItem: string | null }) {
        super({ items });

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
}

export class BlockInventory extends Inventory<PlayerBlock> {
    constructor({ items }: { items: PlayerBlock[] }) {
        super({ items });
    }

    /**
     * Add a block to the inventory or increases its quantity if it already exists
     * @param blockName The name of the block to add
     * @param quantity The quantity to add (default 1)
     * @returns A new BlockInventory with the updated items
     */
    public addBlock(blockName: string, quantity: number = 1): BlockInventory {
        // Check if the block already exists in inventory
        const existingBlock = this.items.find(item => item.name === blockName);

        if (existingBlock) {
            // Calculate the new quantity
            const newQuantity = existingBlock.quantity + quantity;

            // If the new quantity is 0 or less, remove the block from inventory
            if (newQuantity <= 0) {
                const filteredItems = this.items.filter(item => item.name !== blockName);
                return new BlockInventory({ items: filteredItems });
            }

            // Otherwise update its quantity
            const updatedItems = this.items.map(item =>
                item.name === blockName
                    ? new PlayerBlock({ name: item.name, quantity: newQuantity })
                    : item
            );
            return new BlockInventory({ items: updatedItems });
        } else {
            // If not exists and trying to add a positive quantity, add a new block entry
            if (quantity > 0) {
                const newBlock = new PlayerBlock({ name: blockName, quantity });
                return new BlockInventory({ items: [...this.items, newBlock] });
            }
            // If trying to remove a non-existent block, just return the current inventory
            return this;
        }
    }

    /**
     * Get the total quantity of a specific block in the inventory
     * @param blockName The name of the block to check
     * @returns The quantity of the block, 0 if it doesn't exist
     */
    public getBlockQuantity(blockName: string): number {
        const block = this.items.find(item => item.name === blockName);
        return block ? block.quantity : 0;
    }

    /**
     * Check if the inventory contains at least the specified quantity of a block
     * @param blockName The name of the block to check
     * @param quantity The minimum quantity to check for (default 1)
     * @returns True if the inventory has at least the specified quantity
     */
    public hasBlock(blockName: string, quantity: number = 1): boolean {
        return this.getBlockQuantity(blockName) >= quantity;
    }
}
