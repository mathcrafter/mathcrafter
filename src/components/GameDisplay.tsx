'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { MathProblem } from '../models/MathProblem';
import ShopModal from './ShopModal';
import GameOverModal from './GameOverModal';
import gameController, { generateId } from '../controllers/GameController';
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
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);

    const biomeRef = useRef<HTMLDivElement>(null);

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
            return prev.increaseScore(100);
        });

        // Play animation
        animatePickaxeSwing();
        // TODO: Animate biome crack

    };

    // Reset the biome
    // const resetBiome = () => {
    //     setGameState(prev => ({
    //         ...prev,
    //         biomeHealth: prev.biome === 'desert' ? 15 : 10
    //     }));
    // };

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

        // Play animation
        animatePickaxeSwing();
    };

    // Break pickaxe
    const breakPickaxe = (state: GameState): GameState => {
        if (state.pickaxeInventory.length() === 0) {
            setShowGameOver(true);
            return state;
        }

        const newPickaxeInventory = state.pickaxeInventory.removeCurrentItem();
        return state.withPickaxeInventory(newPickaxeInventory);
    };

    // Animate pickaxe swing
    const animatePickaxeSwing = () => {
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 300);
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

        // Play animation
        animatePickaxeSwing();
    };

    // Track mouse movement for pickaxe cursor
    const handleMouseMove = (e: React.MouseEvent) => {
        if (biomeRef.current) {
            const rect = biomeRef.current.getBoundingClientRect();
            setCursorPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
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

    // Calculate total pickaxes
    const totalPickaxes = gameState.pickaxeInventory.length();

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
                </div>
                <div className={styles.avatar}>
                    <img src="/assets/avatars/avatar.png" alt="Player Avatar" className={styles.avatarImage} />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <img src="/assets/pickaxe.png" alt="Pickaxe" className={styles.statIcon} />
                        <span>{totalPickaxes}</span>
                    </div>
                </div>
            </div>

            <div className={styles.gameArea}>
                <div
                    ref={biomeRef}
                    className={`${styles.biome}`}
                    onMouseMove={handleMouseMove}
                    onClick={handleBiomeClick}
                >
                    {/* Pickaxe cursor */}
                    <div
                        className={styles.pickaxeCursor}
                        style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
                    >
                        <img
                            src={gameState.pickaxeInventory.getCurrentItem()?.getImageUrl()}
                            alt="Pickaxe cursor"
                            className={isSwinging ? styles.swingAnimation : ''}
                        />
                    </div>
                </div>

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
                onBuyItem={() => { }}
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