export interface Recipe {
    name: string;
    ingredients: {
        item: string;
        amount: number;
    }[];
}
