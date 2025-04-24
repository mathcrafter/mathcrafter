'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { Gemstone } from '../models/Gemstone';
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
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
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
            const newBiomeHealth = prev.biomeHealth - 1;
            const newCrackCount = prev.crackCount + 1;

            // Check if biome is cleared
            if (newBiomeHealth <= 0) {
                // Biome cleared, reward the player
                setTimeout(() => {
                    revealGemstone();
                    // Reset biome health for next round
                    resetBiome();
                }, 300);
            }

            return {
                ...prev,
                biomeHealth: Math.max(0, newBiomeHealth),
                crackCount: newCrackCount
            };
        });

        // Play animation
        animatePickaxeSwing();
    };

    // Reset the biome
    const resetBiome = () => {
        setGameState(prev => ({
            ...prev,
            biomeHealth: prev.biome === 'desert' ? 15 : 10
        }));
    };

    // Handle wrong answer
    const handleWrongAnswer = () => {
        // Reduce pickaxe health
        setGameState(prev => {
            const currentPickaxe = prev.pickaxes[prev.currentPickaxe];
            const newHealth = currentPickaxe.health - 1;

            // Check if pickaxe is broken
            if (newHealth <= 0) {
                return breakPickaxe(prev);
            }

            const updatedPickaxes = [...prev.pickaxes];
            updatedPickaxes[prev.currentPickaxe] = { ...currentPickaxe, health: newHealth };
            return { ...prev, pickaxes: updatedPickaxes };
        });

        // Play animation
        animatePickaxeSwing();
    };

    // Break pickaxe
    const breakPickaxe = (state: GameState): GameState => {
        // Create a deep copy of the state to avoid mutation
        const newState = { ...state };
        const pickaxes = [...state.pickaxes];

        // Remove the current pickaxe from the array
        pickaxes.splice(state.currentPickaxe, 1);
        newState.pickaxes = pickaxes;

        // Check if there are any pickaxes left
        const totalPickaxes = newState.pickaxes.length;

        if (totalPickaxes === 0) {
            // Game over
            setShowGameOver(true);
            return newState;
        }

        // Find the next available pickaxe
        newState.currentPickaxe = 0;

        return newState;
    };

    // Reveal a gemstone
    const revealGemstone = () => {
        if (biomeRef.current) {
            const x = Math.floor(Math.random() * (biomeRef.current.offsetWidth - 200));
            const y = Math.floor(Math.random() * (biomeRef.current.offsetHeight - 200));

            const newGemstone: Gemstone = {
                id: generateId(),
                x,
                y
            };

            setGemstones(prev => [...prev, newGemstone]);
        }
    };

    // Collect a gemstone
    const collectGemstone = (id: string) => {
        setGemstones(prev => prev.filter(gemstone => gemstone.id !== id));

        // Increment gemstone count
        setGameState(prev => ({
            ...prev,
            gemstones: prev.gemstones + 1
        }));
    };

    // Buy an item from the shop
    const buyItem = (item: string, cost: number) => {
        if (gameState.gemstones >= cost) {
            setGameState(prev => {
                const newState = { ...prev, gemstones: prev.gemstones - cost };

                if (item === 'desert-biome') {
                    newState.biome = 'desert';
                    newState.biomeHealth = 15; // Desert biome is harder
                    setGemstones([]);
                }

                return newState;
            });
        }
    };

    // Animate pickaxe swing
    const animatePickaxeSwing = () => {
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 300);
    };

    // Handle biome click
    const handleBiomeClick = () => {
        // Don't allow clicking if biome health is already zero
        if (gameState.biomeHealth <= 0) return;

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
        setGemstones([]);
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
    const totalPickaxes = gameState.pickaxes.length;

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div className={styles.gameContainer}>Loading...</div>;
    }

    // Calculate biome health percentage
    const biomeHealthMax = gameState.biome === 'desert' ? 15 : 10;
    const biomeHealthPercent = (gameState.biomeHealth / biomeHealthMax) * 100;

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
                        <img src="/assets/gemstone.png" alt="" className={styles.buttonIcon} />
                    </button>
                </div>
                <div className={styles.avatar}>
                    <img src="/assets/avatars/avatar.png" alt="Player Avatar" className={styles.avatarImage} />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <img src="/assets/gemstone.png" alt="Gemstone" className={styles.statIcon} />
                        <span>{gameState.gemstones}</span>
                    </div>
                    <div className={styles.statItem}>
                        <img src="/assets/pickaxe.png" alt="Pickaxe" className={styles.statIcon} />
                        <span>{totalPickaxes}</span>
                    </div>
                </div>
            </div>

            <div className={styles.gameArea}>
                <div
                    ref={biomeRef}
                    className={`${styles.biome} ${gameState.biome === 'desert' ? styles.desert : ''}`}
                    onMouseMove={handleMouseMove}
                    onClick={handleBiomeClick}
                >
                    {/* Pickaxe cursor */}
                    <div
                        className={styles.pickaxeCursor}
                        style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
                    >
                        <img
                            src={`/assets/pickaxes/${gameState.pickaxes[gameState.currentPickaxe]?.name.toLowerCase() || 'wooden'}.webp`}
                            alt="Pickaxe cursor"
                            className={isSwinging ? styles.swingAnimation : ''}
                        />
                    </div>

                    {/* Biome health indicator */}
                    <div className={styles.biomeHealthContainer}>
                        <div
                            className={styles.biomeHealthBar}
                            style={{ width: `${biomeHealthPercent}%` }}
                        ></div>
                        <span className={styles.biomeHealthText}>
                            Health: {gameState.biomeHealth}/{biomeHealthMax}
                        </span>
                    </div>

                    {/* Gemstones */}
                    {gemstones.map(gemstone => (
                        <div
                            key={gemstone.id}
                            className={styles.gemstone}
                            style={{ left: `${gemstone.x}px`, top: `${gemstone.y}px` }}
                            onClick={() => collectGemstone(gemstone.id)}
                        />
                    ))}
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
                onBuyItem={buyItem}
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