import { GameState, getInitialGameState, IGameState } from "@/models/GameState";
import { MathProblem } from "@/models/MathProblem";
import { PickaxeInventory, BlockInventory } from "@/models/Inventory";
import { PlayerPickaxe } from "@/models/Pickaxe";
import { PlayerBiome } from "@/models/Biome";
import { PlayerBlock } from "@/models/Block";

interface IGameStateStorage {
    getGameState(): GameState | null;
    setGameState(gameState: GameState): void;
    removeGameState(): void;
}

export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
}

class LocalStorageGameStateStorage implements IGameStateStorage {
    constructor(private readonly key: string = 'mathCrafterGameState') {
        this.key = key;
    }

    getGameState(): GameState | null {
        if (typeof window === 'undefined') {
            throw new Error('LocalStorage is not available in the browser');
        }

        const savedState = localStorage.getItem(this.key);
        if (savedState) {
            try {
                const parsedState = JSON.parse(savedState) as IGameState;

                // Properly reconstruct class instances
                const pickaxeItems = parsedState.pickaxeInventory.items.map(item =>
                    new PlayerPickaxe({
                        id: item.id,
                        type: item.type,
                        health: item.health
                    })
                );

                const blockItems = parsedState.blockInventory.items.map(item =>
                    new PlayerBlock({
                        name: item.name,
                        quantity: item.quantity
                    })
                );

                const currentItem = parsedState.pickaxeInventory.currentItem;
                const pickaxeInventory = new PickaxeInventory({
                    items: pickaxeItems,
                    currentItem: currentItem
                });

                const blockInventory = new BlockInventory({
                    items: blockItems
                });

                const currentBiome = new PlayerBiome({
                    id: parsedState.currentBiome.id,
                    type: parsedState.currentBiome.type,
                    currentHealth: parsedState.currentBiome.currentHealth
                });

                return new GameState({
                    score: parsedState.score,
                    pickaxeInventory: pickaxeInventory,
                    blockInventory: blockInventory,
                    unlockedBiomes: parsedState.unlockedBiomes,
                    currentBiome: currentBiome
                });
            } catch (e) {
                console.error('Failed to parse saved game state', e);
                return null;
            }
        }
        return null;
    }

    setGameState(gameState: GameState): void {
        if (typeof window === 'undefined') {
            throw new Error('LocalStorage is not available in the browser');
        }

        localStorage.setItem(this.key, JSON.stringify(gameState));
    }

    removeGameState(): void {
        if (typeof window === 'undefined') {
            throw new Error('LocalStorage is not available in the browser');
        }

        localStorage.removeItem(this.key);
    }
}

export class GameController {
    private storage: IGameStateStorage;

    constructor(storage: IGameStateStorage) {
        this.storage = storage;
    }

    public loadGameState(): GameState {
        const savedState = this.storage.getGameState();
        if (savedState) {
            return savedState;
        } else {
            console.log('No saved game state found, creating new game state');
            return new GameState(getInitialGameState());
        }
    }

    public saveGameState(gameState: GameState) {
        this.storage.setGameState(gameState);
    }

    public hasSavedGame(): boolean {
        return this.storage.getGameState() !== null;
    }

    public clearSavedGame(): void {
        this.storage.removeGameState();
    }

    // Generate a math problem based on difficulty
    public generateMathProblem(): MathProblem {
        // For now, simple addition and subtraction within 20
        const operation: '+' | '-' = Math.random() > 0.5 ? '+' : '-';

        let num1: number, num2: number;

        if (operation === '+') {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;
        } else {
            num1 = Math.floor(Math.random() * 10) + 10; // Ensure larger number first
            num2 = Math.floor(Math.random() * num1) + 1;
        }

        return {
            num1,
            num2,
            operator: operation,
            answer: operation === '+' ? num1 + num2 : num1 - num2
        };
    };

}

export default new GameController(new LocalStorageGameStateStorage());