'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { GameState, MathProblem, Crack, Gemstone } from '../utils/types';
import {
    generateMathProblem,
    getInitialGameState,
    getTotalPickaxes,
    getNextAvailablePickaxe,
    getPickaxeHealth,
    generateId
} from '../utils/gameUtils';

const GameDisplay: React.FC = () => {
    // Game state - initialize with empty/default values then populate in useEffect
    const [isClient, setIsClient] = useState(false);
    const [gameState, setGameState] = useState<GameState>(getInitialGameState());
    const [problem, setProblem] = useState<MathProblem>({
        num1: 0,
        num2: 0,
        operator: '+',
        answer: 0
    });
    const [answer, setAnswer] = useState<string>('');
    const [cracks, setCracks] = useState<Crack[]>([]);
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [showGameOver, setShowGameOver] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);

    const biomeRef = useRef<HTMLDivElement>(null);

    // Initialize client-side only data after component mounts
    useEffect(() => {
        setIsClient(true);
        setProblem(generateMathProblem());
    }, []);

    // Generate a new math problem
    const generateNewProblem = () => {
        setProblem(generateMathProblem());
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
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        // Add crack to biome
        if (biomeRef.current) {
            const x = Math.floor(Math.random() * (biomeRef.current.offsetWidth - 40));
            const y = Math.floor(Math.random() * (biomeRef.current.offsetHeight - 40));

            const newCrack: Crack = {
                id: generateId(),
                x,
                y
            };

            setCracks(prev => [...prev, newCrack]);

            // Update crack count
            setGameState(prev => {
                const newCrackCount = prev.crackCount + 1;

                // Check if biome is completely cracked
                if (newCrackCount >= prev.biomeHealth) {
                    revealGemstone();
                    return { ...prev, crackCount: 0 };
                }

                return { ...prev, crackCount: newCrackCount };
            });
        }

        // Play animation
        animatePickaxeSwing();
    };

    // Handle wrong answer
    const handleWrongAnswer = () => {
        // Reduce pickaxe health
        setGameState(prev => {
            const newHealth = prev.pickaxeHealth - 1;

            // Check if pickaxe is broken
            if (newHealth <= 0) {
                return breakPickaxe(prev);
            }

            return { ...prev, pickaxeHealth: newHealth };
        });

        // Play animation
        animatePickaxeSwing();
    };

    // Break pickaxe
    const breakPickaxe = (state: GameState): GameState => {
        // Create a deep copy of the state to avoid mutation
        const newState = { ...state };
        const pickaxes = { ...state.pickaxes };

        // Reduce pickaxe count
        pickaxes[state.currentPickaxe]--;
        newState.pickaxes = pickaxes;

        // Check if there are any pickaxes left
        const totalPickaxes = getTotalPickaxes(pickaxes);

        if (totalPickaxes === 0) {
            // Game over
            setShowGameOver(true);
            return newState;
        }

        // Find the next available pickaxe
        const nextPickaxe = getNextAvailablePickaxe(pickaxes);

        if (nextPickaxe) {
            newState.currentPickaxe = nextPickaxe;
            newState.pickaxeHealth = getPickaxeHealth(nextPickaxe);
        }

        return newState;
    };

    // Reveal a gemstone
    const revealGemstone = () => {
        if (biomeRef.current) {
            const x = Math.floor(Math.random() * (biomeRef.current.offsetWidth - 50));
            const y = Math.floor(Math.random() * (biomeRef.current.offsetHeight - 50));

            const newGemstone: Gemstone = {
                id: generateId(),
                x,
                y
            };

            setGemstones(prev => [...prev, newGemstone]);

            // Clear all cracks
            setCracks([]);
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

                if (item === 'stone-pickaxe') {
                    newState.pickaxes = { ...prev.pickaxes, stone: prev.pickaxes.stone + 1 };
                } else if (item === 'iron-pickaxe') {
                    newState.pickaxes = { ...prev.pickaxes, iron: prev.pickaxes.iron + 1 };
                } else if (item === 'desert-biome') {
                    newState.biome = 'desert';
                    newState.biomeHealth = 15; // Desert biome is harder
                    setCracks([]);
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
        setGameState(getInitialGameState());
        setCracks([]);
        setGemstones([]);
        setShowGameOver(false);
        generateNewProblem();
    };

    // Calculate total pickaxes
    const totalPickaxes = getTotalPickaxes(gameState.pickaxes);

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div className={styles.gameContainer}>Loading...</div>;
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <h1>MathCrafter</h1>
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
                >
                    {/* Pickaxe cursor */}
                    <div
                        className={styles.pickaxeCursor}
                        style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
                    >
                        <img
                            src={`/assets/${gameState.currentPickaxe === 'wooden' ? '' : gameState.currentPickaxe + '-'}pickaxe.png`}
                            alt="Pickaxe cursor"
                            className={isSwinging ? styles.swingAnimation : ''}
                        />
                    </div>

                    {/* Cracks */}
                    {cracks.map(crack => (
                        <div
                            key={crack.id}
                            className={styles.crack}
                            style={{ left: `${crack.x}px`, top: `${crack.y}px` }}
                        />
                    ))}

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

                <form className={styles.mathProblem} onSubmit={handleSubmit}>
                    <div className={styles.question}>
                        {problem.num1} {problem.operator} {problem.num2} = ?
                    </div>
                    <input
                        type="number"
                        className={styles.answer}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        autoFocus
                    />
                    <button type="submit" className={styles.submitBtn}>Mine!</button>
                </form>
            </div>

            <div className={styles.shopPanel}>
                <h2>Shop</h2>
                <div className={styles.shopItems}>
                    <div className={styles.shopItem}>
                        <img src="/assets/stone-pickaxe.png" alt="Stone Pickaxe" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Stone Pickaxe</div>
                            <div className={styles.itemCost}>
                                5 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 5}
                            onClick={() => buyItem('stone-pickaxe', 5)}
                        >
                            Buy
                        </button>
                    </div>

                    <div className={styles.shopItem}>
                        <img src="/assets/iron-pickaxe.png" alt="Iron Pickaxe" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Iron Pickaxe</div>
                            <div className={styles.itemCost}>
                                15 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 15}
                            onClick={() => buyItem('iron-pickaxe', 15)}
                        >
                            Buy
                        </button>
                    </div>

                    <div className={styles.shopItem}>
                        <img src="/assets/desert-biome-icon.png" alt="Desert Biome" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Desert Biome</div>
                            <div className={styles.itemCost}>
                                10 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 10 || gameState.biome === 'desert'}
                            onClick={() => buyItem('desert-biome', 10)}
                        >
                            Buy
                        </button>
                    </div>
                </div>
            </div>

            <div className={`${styles.modal} ${showGameOver ? styles.modalShow : ''}`}>
                <div className={styles.modalContent}>
                    <h2>Game Over!</h2>
                    <p>You've lost all your pickaxes!</p>
                    <button className={styles.restartBtn} onClick={resetGame}>Play Again</button>
                </div>
            </div>
        </div>
    );
};

export default GameDisplay; 