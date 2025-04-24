'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { MathProblem } from '../models/MathProblem';
import { PlayerBiome } from '../models/Biome';
import ShopModal from './ShopModal';
import GameOverModal from './GameOverModal';
import Biome from './Biome';
import InventoryModal from './InventoryModal';
import gameController, { generateId } from '../controllers/GameController';
import { PlayerPickaxe } from '@/models/Pickaxe';
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
    const [showQuestion, setShowQuestion] = useState<boolean>(false);

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
                console.log('No pickaxe found');
                return prev;
            }

            const newCurrentPickaxe = currentPickaxe.damage(1);

            if (newCurrentPickaxe.health <= 0) {
                return breakPickaxe(prev);
            }

            const newPickaxeInventory = prev.pickaxeInventory.withCurrentItem(newCurrentPickaxe);
            const newGameState = prev.withPickaxeInventory(newPickaxeInventory);

            return newGameState;
        });
    };

    // Break pickaxe
    const breakPickaxe = (state: GameState): GameState => {
        if (state.pickaxeInventory.length === 0) {
            setShowGameOver(true);
            return state;
        }

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
                <div className={styles.headerButtons}>
                    <button
                        className={styles.shopButton}
                        onClick={toggleShop}
                    >
                        Shop
                    </button>
                    <button
                        className={styles.shopButton}
                        onClick={toggleInventory}
                    >
                        <img src="/assets/pickaxe.png" alt="Pickaxe" className={styles.buttonIcon} />
                        Inventory
                    </button>
                </div>
                <div className={styles.avatar}>
                    <img src="/assets/avatars/avatar.png" alt="Player Avatar" className={styles.avatarImage} />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <img src="/assets/pickaxe.png" alt="Pickaxe" className={styles.statIcon} />
                        <span>{totalPickaxes}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span>Score:</span>
                        <span>{gameState.score}</span>
                    </div>
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
            </div>

            {/* Shop Modal */}
            <ShopModal
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
            />

            {/* Game Over Modal */}
            <GameOverModal
                isOpen={showGameOver}
                onRestart={resetGame}
            />
        </div>
    );
};

export default GameDisplay; 