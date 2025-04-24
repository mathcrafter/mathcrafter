import { Biome, biomes } from './Biome';
import { PlayerPickaxe, PickaxeInventory } from './Inventory';
import { Pickaxe, pickaxes } from './Pickaxe';

export interface IGameState {
    score: number;
    pickaxeInventory: PickaxeInventory;
}

export class GameState implements IGameState {
    pickaxeInventory: PickaxeInventory;
    score: number;

    constructor({ pickaxeInventory, score }: IGameState) {
        this.pickaxeInventory = pickaxeInventory;
        this.score = score;
    }

    public withPickaxeInventory(pickaxeInventory: PickaxeInventory): GameState {
        return new GameState({ ...this, pickaxeInventory });
    }

    public withScore(score: number): GameState {
        return new GameState({ ...this, score });
    }

    public increaseScore(amount: number): GameState {
        return new GameState({ ...this, score: this.score + amount });
    }
}


export const getInitialGameState = (): IGameState => {
    return {
        pickaxeInventory: new PickaxeInventory({ items: [new PlayerPickaxe({ id: null, type: "wood", health: null })], currentItem: null }), // Start with wooden pickaxe
        score: 0
    };
};
