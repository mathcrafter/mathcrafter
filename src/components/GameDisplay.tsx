'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { MathProblem } from '../models/MathProblem';
import { PlayerBiome } from '../models/Biome';
import ShopPickaxesModal from './ShopPickaxesModal';
import GameOverModal from './GameOverModal';
import Biome from './Biome';
import InventoryModal from './InventoryModal';
import BiomesModal from './BiomesModal';
import QuickInventory from './QuickInventory';
import gameController, { generateId } from '../controllers/GameController';
import { PlayerPickaxe } from '@/models/Pickaxe';
import { PickaxeInventory } from '@/models/Inventory';
/**
 * MathCrafter Game
 * 
 * - Clicking on the biome shows a math question
 * - Answering correctly damages the biome
 * - When biome health reaches zero, player is rewarded
 * - Different biomes have different health levels
 */

const GameDisplay: React.FC = () => {
    // Game state - initialize with empty/default values then populate in useEffect
    const [isClient, setIsClient] = useState(false);
    const [gameState, setGameState] = useState<GameState>(gameController.loadGameState());
    const [problem, setProblem] = useState<MathProblem>({
        num1: 0,
        num2: 0,
        operator: '+',
        answer: 0
    });
    const [answer, setAnswer] = useState<string>('');
    const [showGameOver, setShowGameOver] = useState<boolean>(false);
    const [showShop, setShowShop] = useState<boolean>(false);
    const [showInventory, setShowInventory] = useState<boolean>(false);
    const [showBiomes, setShowBiomes] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [pickaxeBroken, setPickaxeBroken] = useState<boolean>(false);
    const [brokenPickaxeType, setBrokenPickaxeType] = useState<string>('');

    // Initialize client-side only data after component mounts
    useEffect(() => {
        setIsClient(true);
        setProblem(gameController.generateMathProblem());

        // Initialize game state - try to load from localStorage first
        const initialState = gameController.loadGameState();
        setGameState(initialState);
    }, []);

    // Save game state to localStorage whenever it changes
    useEffect(() => {
        if (isClient && !showGameOver) {
            gameController.saveGameState(gameState);
        }
    }, [gameState, isClient, showGameOver]);

    // Generate a new math problem
    const generateNewProblem = () => {
        setProblem(gameController.generateMathProblem());
        setAnswer('');
    };

    // Handle answer submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const userAnswer = parseInt(answer);

        if (isNaN(userAnswer)) {
            return; // Invalid input
        }

        if (userAnswer === problem.answer) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }

        // Generate new problem
        generateNewProblem();
        // Clear the answer field
        setAnswer('');
        // Hide the question
        setShowQuestion(false);
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        // Damage the biome
        setGameState(prev => {
            // Increase score first
            const withScore = prev.increaseScore(100);

            // Then damage the biome (10 points of damage per correct answer)
            const damagedBiome = prev.currentBiome.damage(10);
            const updatedState = withScore.withCurrentBiome(damagedBiome);

            // Check if biome is completely damaged and needs to be rewarded
            if (damagedBiome.currentHealth <= 0) {
                // Give reward and reset biome health in next tick to avoid
                // state update during render
                setTimeout(() => handleBiomeDefeated(), 100);
            }

            return updatedState;
        });
    };

    // Handle when biome is completely mined
    const handleBiomeDefeated = () => {
        // Get reward based on biome type (add more complex rewards later)
        const rewardAmount = 500;

        // Show alert for now, could be replaced with a nicer UI later
        alert(`Biome mined! You received ${rewardAmount} points!`);

        // Update game state with reward and reset biome health
        setGameState(prev => {
            const withReward = prev.increaseScore(rewardAmount);

            // Reset biome health
            const resetBiome = new PlayerBiome({
                id: prev.currentBiome.id,
                type: prev.currentBiome.type,
                currentHealth: null // This will reset to max health
            });

            return withReward.withCurrentBiome(resetBiome);
        });
    };

    // Handle wrong answer
    const handleWrongAnswer = () => {
        // Reduce pickaxe health
        setGameState(prev => {
            const currentPickaxe = prev.pickaxeInventory.getCurrentItem();
            if (currentPickaxe === null) {
                return prev;
            }

            // Damage the current pickaxe
            const damagedPickaxe = currentPickaxe.damage(1);

            // IMPORTANT: Force re-creation of the damaged pickaxe to ensure clean state
            const freshDamagedPickaxe = new PlayerPickaxe({
                id: damagedPickaxe.id,
                type: damagedPickaxe.type,
                health: damagedPickaxe.health
            });

            // If health is now zero, break the pickaxe
            if (freshDamagedPickaxe.health <= 0) {
                return breakPickaxe(prev);
            }

            // Otherwise update the inventory with the damaged pickaxe
            const newPickaxeInventory = prev.pickaxeInventory.withCurrentItem(freshDamagedPickaxe);
            return prev.withPickaxeInventory(newPickaxeInventory);
        });
    };

    // Break pickaxe
    const breakPickaxe = (state: GameState): GameState => {
        const currentPickaxe = state.pickaxeInventory.getCurrentItem();
        if (!currentPickaxe) {
            return state;
        }

        // Store information about the broken pickaxe for display
        setBrokenPickaxeType(currentPickaxe.type);
        setPickaxeBroken(true);

        // Auto-hide the broken pickaxe notification after 3 seconds
        setTimeout(() => {
            setPickaxeBroken(false);
        }, 3000);

        if (state.pickaxeInventory.length <= 1) {
            // This was the last pickaxe
            setShowGameOver(true);
            return state;
        }

        // Remove the current pickaxe and switch to another one
        const newPickaxeInventory = state.pickaxeInventory.removeCurrentItem();
        return state.withPickaxeInventory(newPickaxeInventory);
    };

    // Handle biome click
    const handleBiomeClick = () => {
        // Don't allow clicking if biome health is already zero
        // if (gameState.biomeHealth <= 0) return;

        // Show the math question
        setShowQuestion(true);

        // Generate a new problem if one isn't already shown
        if (!showQuestion) {
            generateNewProblem();
        }
    };

    // Reset the game
    const resetGame = () => {
        const newState = gameController.loadGameState();
        setGameState(newState);
        setShowGameOver(false);
        setShowQuestion(false);
        generateNewProblem();
        gameController.saveGameState(newState);
    };

    // Toggle shop visibility
    const toggleShop = () => {
        setShowShop(prev => !prev);
    };

    // Toggle inventory visibility
    const toggleInventory = () => {
        setShowInventory(prev => !prev);
    };

    // Toggle biomes modal visibility
    const toggleBiomes = () => {
        setShowBiomes(prev => !prev);
    };

    // Handle buying a pickaxe
    const handleBuyPickaxe = (itemType: string, cost: number) => {
        // Create a new pickaxe
        const newPickaxe = new PlayerPickaxe({ id: null, type: itemType, health: null });

        // Add to inventory and deduct score
        const newState = gameState
            .withPickaxeInventory(gameState.pickaxeInventory.add(newPickaxe))
            .withScore(gameState.score - cost);

        setGameState(newState);
    };

    // Handle selecting a different pickaxe
    const handleSelectPickaxe = (pickaxeId: string) => {
        // Find the selected pickaxe in the inventory
        const selectedPickaxe = gameState.pickaxeInventory.items.find(item => item.id === pickaxeId);

        if (!selectedPickaxe) {
            console.error("Selected pickaxe not found in inventory");
            return;
        }

        // Use the new setCurrentItem method
        const updatedInventory = gameState.pickaxeInventory.withCurrentItemId(pickaxeId);

        // Update the game state with the new inventory
        setGameState(prevState => {
            const newState = prevState.withPickaxeInventory(updatedInventory);

            // Force saving to ensure consistency
            setTimeout(() => {
                gameController.saveGameState(newState);
            }, 0);

            return newState;
        });

        // Close the inventory modal after selection
        setShowInventory(false);
    };

    // Calculate total pickaxes
    const totalPickaxes = gameState.pickaxeInventory.length;

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div className={styles.gameContainer}>Loading...</div>;
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <h1>MathCrafter</h1>
                <div className={styles.avatar}>
                    <img src="/assets/avatars/avatar.png" alt="Player Avatar" className={styles.avatarImage} />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span>Score:</span>
                        <span>{gameState.score}</span>
                    </div>
                </div>
                <div className={styles.headerButtons}>
                    <button
                        className={styles.pickaxesButton}
                        onClick={toggleShop}
                    >
                        <img src="/assets/shop_pickaxe.png" alt="Pickaxes" className={styles.buttonIcon} />
                        Pickaxes
                    </button>
                    <button
                        className={styles.unlockBiomesButton}
                        onClick={toggleBiomes}
                    >
                        <img src="/assets/unlock_biome.png" alt="Biomes" className={styles.buttonIcon} />
                        Biomes
                    </button>
                    <button
                        className={styles.inventoryButton}
                        onClick={toggleInventory}
                    >
                        <img src="/assets/inventory.png" alt="Inventory" className={styles.buttonIcon} />
                        Inventory
                    </button>
                </div>
            </div>

            <div className={styles.gameArea}>
                <Biome
                    onBiomeClick={handleBiomeClick}
                    currentPickaxe={gameState.pickaxeInventory.getCurrentItem()}
                    currentBiome={gameState.currentBiome}
                />

                {showQuestion && (
                    <form className={styles.mathProblem} onSubmit={handleSubmit}>
                        <div className={styles.question}>
                            {problem.num1} {problem.operator} {problem.num2} = ?
                        </div>
                        <div className={styles.answerArea}>
                            <input
                                type="number"
                                className={styles.answer}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className={styles.submitBtn}>Mine!</button>
                        </div>

                        <div className={styles.numpad}>
                            {[7, 8, 9, 4, 5, 6, 1, 2, 3, 0].map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    className={styles.numpadBtn}
                                    onClick={() => setAnswer(prev => prev + num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                            <button
                                type="button"
                                className={`${styles.numpadBtn} ${styles.clearBtn}`}
                                onClick={() => setAnswer('')}
                            >
                                Clear
                            </button>
                            <button
                                type="button"
                                className={`${styles.numpadBtn} ${styles.deleteBtn}`}
                                onClick={() => setAnswer(prev => prev.slice(0, -1))}
                            >
                                ←
                            </button>
                        </div>
                    </form>
                )}

                <QuickInventory
                    gameState={gameState}
                    onSelectPickaxe={handleSelectPickaxe}
                />
            </div>

            {/* Shop Modal */}
            <ShopPickaxesModal
                isOpen={showShop}
                onClose={toggleShop}
                gameState={gameState}
                onBuyItem={handleBuyPickaxe}
            />

            {/* Inventory Modal */}
            <InventoryModal
                isOpen={showInventory}
                onClose={toggleInventory}
                gameState={gameState}
                onSelectPickaxe={handleSelectPickaxe}
            />

            {/* Biomes Modal */}
            <BiomesModal
                isOpen={showBiomes}
                onClose={toggleBiomes}
                gameState={gameState}
            />

            {/* Game Over Modal */}
            <GameOverModal
                isOpen={showGameOver}
                onRestart={resetGame}
            />

            {/* Broken Pickaxe Notification */}
            {pickaxeBroken && (
                <div className={styles.brokenPickaxeNotification}>
                    <h3>Pickaxe Destroyed!</h3>
                    <p>Your {brokenPickaxeType} Pickaxe has broken.</p>
                </div>
            )}
        </div>
    );
};

export default GameDisplay; 