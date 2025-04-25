import { PlayerBiome } from './Biome';
import { BlockInventory, PickaxeInventory } from './Inventory';
import { PlayerPickaxe } from './Pickaxe';

export interface IGameState {
    score: number;
    pickaxeInventory: PickaxeInventory;
    unlockedBiomes: string[];
    currentBiome: PlayerBiome;
    blockInventory: BlockInventory;
}

export class GameState implements IGameState {
    pickaxeInventory: PickaxeInventory;
    blockInventory: BlockInventory;
    score: number;
    unlockedBiomes: string[];
    currentBiome: PlayerBiome;

    constructor({ pickaxeInventory, blockInventory, score, unlockedBiomes, currentBiome }: IGameState) {
        this.pickaxeInventory = pickaxeInventory;
        this.blockInventory = blockInventory;
        this.score = score;
        this.unlockedBiomes = unlockedBiomes;
        this.currentBiome = currentBiome;
    }

    public withPickaxeInventory(pickaxeInventory: PickaxeInventory): GameState {
        return new GameState({ ...this, pickaxeInventory });
    }

    public withBlockInventory(blockInventory: BlockInventory): GameState {
        return new GameState({ ...this, blockInventory });
    }

    public withScore(score: number): GameState {
        return new GameState({ ...this, score });
    }

    public increaseScore(amount: number): GameState {
        return new GameState({ ...this, score: this.score + amount });
    }

    public withCurrentBiome(currentBiome: PlayerBiome): GameState {
        return new GameState({ ...this, currentBiome });
    }
}


export const getInitialGameState = (): IGameState => {
    return {
        pickaxeInventory: new PickaxeInventory({
            items: [
                new PlayerPickaxe({ id: null, type: "clay", health: null }),
                new PlayerPickaxe({ id: null, type: "wood", health: null }),
            ], currentItem: null
        }),
        blockInventory: new BlockInventory({ items: [] }),
        score: 0,
        unlockedBiomes: ["plains"],
        currentBiome: new PlayerBiome({ id: null, type: "plains", currentHealth: null })
    };
};
