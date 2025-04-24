export class Store<Item extends { name: string }> {
    items: Item[];
    map: Map<string, Item>;

    constructor(items: Item[]) {
        this.items = items;
        this.map = new Map(items.map(i => [i.name, i]));
    }

    public getItemByName(name: string): Item {
        const item = this.map.get(name);
        if (!item) {
            throw new Error(`Item with name ${name} not found`);
        }
        return item;
    }
}