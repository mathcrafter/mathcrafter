import { Recipe } from "@/models/Recipe";
import { Store } from "./Store";

class RecipeStore extends Store<Recipe> {
    constructor(recipes: Recipe[]) {
        super(recipes);
    }
}

const recipes: Recipe[] = [
    {
        name: "circadian_dust",
        ingredients: [
            { item: "dawn_stone", amount: 1 },
            { item: "dusk_stone", amount: 1 },
        ],
    },
    {
        name: "refined_waste",
        ingredients: [
            { item: "diluted_waste", amount: 1 },
            { item: "nuclear_waste", amount: 1 },
        ],
    },
    {
        name: "enchanted_book",
        ingredients: [
            { item: "book", amount: 1 },
            { item: "lapis_lazuli", amount: 5 },
        ],
    },
    {
        name: "magic_book",
        ingredients: [
            { item: "cursed_book", amount: 1 },
            { item: "enchanted_book", amount: 1 },
        ],
    },
    {
        name: "qbit",
        ingredients: [
            { item: "tritium", amount: 3 },
            { item: "hydrogen", amount: 1 },
            { item: "plasma", amount: 1 },
        ],
    },
    {
        name: "rocket_fuel",
        ingredients: [
            { item: "enderium", amount: 1 },
            { item: "amethyst", amount: 1 },
            { item: "endstone", amount: 10 },
        ],
    },
    {
        name: "dyson_sphere_part",
        ingredients: [
            { item: "quantum_chip", amount: 1 },
            { item: "hydrogen", amount: 1 },
            { item: "tritium", amount: 1 },
            { item: "plasma", amount: 10 },
        ],
    },
    {
        name: "quantum_chip",
        ingredients: [
            { item: "qbit", amount: 3 },
            { item: "hydrogen", amount: 1 },
        ],
    },
    {
        name: "time_key_fragment",
        ingredients: [
            { item: "plasma", amount: 5 },
            { item: "star_core", amount: 5 },
            { item: "tritium", amount: 1 },
        ],
    },
    {
        name: "time_key",
        ingredients: [
            { item: "time_key_fragment", amount: 100 },
        ],
    },
    {
        name: "time_key_fragment",
        ingredients: [
            { item: "time_key_fragment", amount: 100 },
        ],
    },
    {
        name: "circuit_board",
        ingredients: [
            { item: "clock_gear", amount: 5 },
            { item: "clock_spring", amount: 1 },
            { item: "time_stone", amount: 1 },
        ],
    },
    {
        name: "graviton",
        ingredients: [
            { item: "tritium", amount: 1 },
            { item: "clock_spring", amount: 1 },
            { item: "secret_of_time", amount: 1 },
            { item: "sand_of_clock", amount: 4 },
        ],
    },
    {
        name: "off_bit",
        ingredients: [
            { item: "bool", amount: 1 },
        ],
    },
    {
        name: "on_bit",
        ingredients: [
            { item: "bool", amount: 2 },
        ],
    },
    {
        name: "c_sharp",
        ingredients: [
            { item: "on_bit", amount: 1 },
            { item: "off_bit", amount: 1 },
            { item: "struct", amount: 1 },
        ],
    }
];

export const recipeStore = new RecipeStore(recipes);