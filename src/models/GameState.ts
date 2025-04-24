import { PlayerBiome } from './Biome';
import { PickaxeInventory } from './Inventory';
import { PlayerPickaxe } from './Pickaxe';

export interface IGameState {
    score: number;
    pickaxeInventory: PickaxeInventory;
    unlockedBiomes: string[];
    currentBiome: PlayerBiome;
}

export class GameState implements IGameState {
    pickaxeInventory: PickaxeInventory;
    score: number;
    unlockedBiomes: string[];
    currentBiome: PlayerBiome;

    constructor({ pickaxeInventory, score, unlockedBiomes, currentBiome }: IGameState) {
        this.pickaxeInventory = pickaxeInventory;
        this.score = score;
        this.unlockedBiomes = unlockedBiomes;
        this.currentBiome = currentBiome;
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
        score: 0,
        unlockedBiomes: ["plains"],
        currentBiome: new PlayerBiome({ id: null, type: "plains" })
    };
};
