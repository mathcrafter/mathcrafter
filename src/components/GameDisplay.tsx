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
import ShopModal from './ShopModal';
import GameOverModal from './GameOverModal';

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
    const [showShop, setShowShop] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [clickPosition, setClickPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);

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
        // Clear the answer field
        setAnswer('');
        // Hide the question
        setShowQuestion(false);
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        // Add crack to biome at the click position
        if (biomeRef.current) {
            // Adjust position to center the crack on the click point (offsetting by half the crack size)
            const newCrack: Crack = {
                id: generateId(),
                x: clickPosition.x - 100, // Offset by half the crack width (200px)
                y: clickPosition.y - 100  // Offset by half the crack height (200px)
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
            const x = Math.floor(Math.random() * (biomeRef.current.offsetWidth - 200));
            const y = Math.floor(Math.random() * (biomeRef.current.offsetHeight - 200));

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

    // Handle biome click
    const handleBiomeClick = (e: React.MouseEvent) => {
        if (biomeRef.current) {
            const rect = biomeRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Store click position for crack placement
            setClickPosition({ x, y });

            // Show the math question
            setShowQuestion(true);

            // Generate a new problem if one isn't already shown
            if (!showQuestion) {
                generateNewProblem();
            }

            // Play animation
            animatePickaxeSwing();
        }
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
        setShowQuestion(false);
        generateNewProblem();
    };

    // Toggle shop visibility
    const toggleShop = () => {
        setShowShop(prev => !prev);
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
                <div className={styles.headerButtons}>
                    <button
                        className={styles.shopButton}
                        onClick={toggleShop}
                    >
                        Shop
                        <img src="/assets/gemstone.png" alt="" className={styles.buttonIcon} />
                    </button>
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
                            src={`/assets/${gameState.currentPickaxe === 'wooden' ? '' : gameState.currentPickaxe + '-'}pickaxe.svg`}
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