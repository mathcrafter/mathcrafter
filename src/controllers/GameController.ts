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
                    picks: parsedState.picks,
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

interface IMathProblemGenerator {
    generateMathProblem(): MathProblem;
}

export class GameController {
    private storage: IGameStateStorage;
    private mathProblemGenerator: IMathProblemGenerator;

    constructor(storage: IGameStateStorage, mathProblemGenerator: IMathProblemGenerator) {
        this.storage = storage;
        this.mathProblemGenerator = mathProblemGenerator;
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

    // Export game state as base64 encoded JSON
    public exportGameState(gameState: GameState): string {
        const stateJson = JSON.stringify(gameState);
        if (typeof window === 'undefined') {
            throw new Error('Window is not available in the browser');
        }

        return btoa(stateJson);
    }

    // Import game state from base64 encoded JSON
    public importGameState(base64State: string): GameState | null {
        try {
            if (typeof window === 'undefined') {
                throw new Error('Window is not available in the browser');
            }

            const stateJson = atob(base64State);
            const parsedState = JSON.parse(stateJson) as IGameState;

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
                picks: parsedState.picks,
                pickaxeInventory: pickaxeInventory,
                blockInventory: blockInventory,
                unlockedBiomes: parsedState.unlockedBiomes,
                currentBiome: currentBiome
            });
        } catch (e) {
            console.error('Failed to import game state', e);
            return null;
        }
    }

    // Generate a math problem based on difficulty
    public generateMathProblem(): MathProblem {
        return this.mathProblemGenerator.generateMathProblem();
    };

}

class MathProblemGenerator implements IMathProblemGenerator {
    private history: MathProblem[] = [];

    private generateAdditionProblem(): MathProblem {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        return {
            num1,
            num2,
            operator: '+',
            answer: num1 + num2
        };
    }

    private generateSubtractionProblem(): MathProblem {
        let num1 = Math.floor(Math.random() * 20) + 1;
        let num2 = Math.floor(Math.random() * 20) + 1;

        if (num1 < num2) {
            [num1, num2] = [num2, num1];
        }

        return {
            num1,
            num2,
            operator: '-',
            answer: num1 - num2
        };
    }

    private chooseRandom<T>(array: T[]): T {
        return array[Math.floor(Math.random() * array.length)];
    }

    private generateMultiplicationProblem(): MathProblem {
        let num1 = this.chooseRandom([0, 1, 2, 3, 5, 10, 11]);
        let num2 = Math.floor(Math.random() * 12);

        if (Math.random() < 0.5) {
            [num1, num2] = [num2, num1];
        }

        return {
            num1,
            num2,
            operator: '*',
            answer: num1 * num2
        };
    }

    public generateMathProblem(): MathProblem {
        const operator = this.chooseRandom(['+', '-', '*']);
        switch (operator) {
            case '+':
                return this.generateAdditionProblem();
            case '-':
                return this.generateSubtractionProblem();
            case '*':
                return this.generateMultiplicationProblem();
            default:
                throw new Error('Invalid operator');
        }
    }
}

export default new GameController(new LocalStorageGameStateStorage(), new MathProblemGenerator());