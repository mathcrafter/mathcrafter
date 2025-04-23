'use client';

import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { GameState, MathProblem, Gemstone } from '../utils/types';
import {
    generateMathProblem,
    getInitialGameState,
    getTotalPickaxes,
    getNextAvailablePickaxe,
    getPickaxeHealth,
    generateId,
    saveGameState,
    loadGameState
} from '../utils/gameUtils';
import ShopModal from './ShopModal';
import GameOverModal from './GameOverModal';
import InventoryBar from './InventoryBar';

/**
 * MathCrafter Game with Grid-Based Mining System
 * 
 * The game divides the biome into a configurable grid (default: 4x3)
 * - Each grid block can be individually mined
 * - Hovering over a block highlights its border
 * - Clicking a block shows a math question
 * - Answering correctly cracks the block
 * - When all blocks are cracked, the biome is cleared and player is rewarded
 * - Different biomes have different grid configurations
 */

// Define a Block interface for our grid system
interface Block {
    id: string;
    cracked: boolean;
}

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
    const [gemstones, setGemstones] = useState<Gemstone[]>([]);
    const [showGameOver, setShowGameOver] = useState<boolean>(false);
    const [showShop, setShowShop] = useState<boolean>(false);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);
    const [showQuestion, setShowQuestion] = useState<boolean>(false);
    const [activeBlock, setActiveBlock] = useState<number | null>(null);
    const [hoveredBlock, setHoveredBlock] = useState<number | null>(null);

    const biomeRef = useRef<HTMLDivElement>(null);

    // Initialize client-side only data after component mounts
    useEffect(() => {
        setIsClient(true);
        setProblem(generateMathProblem());

        // Initialize game state - try to load from localStorage first
        const savedState = loadGameState();
        const initialState = savedState || getInitialGameState();
        setGameState(initialState);
    }, []);

    // Save game state to localStorage whenever it changes
    useEffect(() => {
        if (isClient && !showGameOver) {
            saveGameState(gameState);
        }
    }, [gameState, isClient, showGameOver]);

    // Add keyboard event listener for inventory slot shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Only process if we're not in the math question input
            if (!showQuestion) {
                // Number keys 1-3 for pickaxe selection
                if (e.key === '1') handlePickaxeSelect('wooden');
                if (e.key === '2') handlePickaxeSelect('stone');
                if (e.key === '3') handlePickaxeSelect('iron');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [showQuestion, gameState.pickaxes]);

    // Initialize the blocks grid
    const initializeBlocks = () => {
        setGameState(prev => {
            const totalBlocks = prev.gridConfig.rows * prev.gridConfig.cols;
            const newBlocks = Array.from({ length: totalBlocks }, () => ({
                id: generateId(),
                cracked: false
            }));

            return {
                ...prev,
                blocks: newBlocks
            };
        });
    };

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
        setActiveBlock(null);
    };

    // Handle correct answer
    const handleCorrectAnswer = () => {
        // Crack the active block
        if (activeBlock !== null) {
            setGameState(prev => {
                const newBlocks = [...prev.blocks];
                newBlocks[activeBlock].cracked = true;

                // Check if all blocks are cracked
                const allCracked = newBlocks.every(block => block.cracked);

                if (allCracked) {
                    // All blocks cracked, reward the player
                    setTimeout(() => {
                        revealGemstone();
                        // Reset blocks for next round
                        initializeBlocks();
                    }, 300);
                }

                return {
                    ...prev,
                    blocks: newBlocks
                };
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
                    // Change grid configuration for desert biome - make it harder
                    newState.gridConfig = { rows: 4, cols: 5 };

                    // Initialize new blocks according to new grid size
                    const totalBlocks = newState.gridConfig.rows * newState.gridConfig.cols;
                    newState.blocks = Array.from({ length: totalBlocks }, () => ({
                        id: generateId(),
                        cracked: false
                    }));

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

    // Handle block click
    const handleBlockClick = (index: number) => {
        // Don't allow clicking already cracked blocks
        if (gameState.blocks[index].cracked) return;

        setActiveBlock(index);

        // Show the math question
        setShowQuestion(true);

        // Generate a new problem if one isn't already shown
        if (!showQuestion) {
            generateNewProblem();
        }

        // Play animation
        animatePickaxeSwing();
    };

    // Handle block hover
    const handleBlockHover = (index: number) => {
        setHoveredBlock(index);
    };

    const handleBlockLeave = () => {
        setHoveredBlock(null);
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
        const newState = getInitialGameState();
        setGameState(newState);
        setGemstones([]);
        setShowGameOver(false);
        setShowQuestion(false);
        generateNewProblem();
        saveGameState(newState);
    };

    // Toggle shop visibility
    const toggleShop = () => {
        setShowShop(prev => !prev);
    };

    // Calculate total pickaxes
    const totalPickaxes = getTotalPickaxes(gameState.pickaxes);

    // Handle pickaxe selection
    const handlePickaxeSelect = (pickaxeType: 'wooden' | 'stone' | 'iron') => {
        // Only select if we have at least one of this pickaxe
        if (gameState.pickaxes[pickaxeType] > 0) {
            setGameState(prev => ({
                ...prev,
                currentPickaxe: pickaxeType,
                pickaxeHealth: getPickaxeHealth(pickaxeType)
            }));
        }
    };

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

                    {/* Grid blocks */}
                    <div
                        className={styles.biomeGrid}
                        style={{
                            gridTemplateColumns: `repeat(${gameState.gridConfig.cols}, 1fr)`,
                            gridTemplateRows: `repeat(${gameState.gridConfig.rows}, 1fr)`
                        }}
                    >
                        {gameState.blocks.map((block, index) => (
                            <div
                                key={block.id}
                                className={`${styles.biomeBlock} 
                                           ${block.cracked ? styles.crackedBlock : ''} 
                                           ${hoveredBlock === index ? styles.hoveredBlock : ''}`}
                                onClick={() => handleBlockClick(index)}
                                onMouseEnter={() => handleBlockHover(index)}
                                onMouseLeave={handleBlockLeave}
                            />
                        ))}
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

                {/* Replace the inline inventory with the InventoryBar component */}
                <InventoryBar
                    gameState={gameState}
                    onPickaxeSelect={handlePickaxeSelect}
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