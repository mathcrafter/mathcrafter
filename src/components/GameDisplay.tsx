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
import gameController from '../controllers/GameController';
import { PlayerPickaxe } from '@/models/Pickaxe';
import soundManager from '@/utils/SoundManager';
import { PickaxeInventory } from '@/models/Inventory';
import { PlayerBlock } from '@/models/Block';
import { pickaxeStore } from '@/stores/PickaxeStore';

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
    const [biomeDestroyed, setBiomeDestroyed] = useState<boolean>(false);
    const [destroyedBiomeType, setDestroyedBiomeType] = useState<string>('');
    const [wrongAnswer, setWrongAnswer] = useState<boolean>(false);
    const [isIncorrect, setIsIncorrect] = useState<boolean>(false);
    const [scoreToShow, setScoreToShow] = useState<number | null>(null);
    const [minedBlock, setMinedBlock] = useState<{ name: string; imageUrl: string } | null>(null);
    const [blockAdded, setBlockAdded] = useState<PlayerBlock | null>(null);

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

    useEffect(() => {
        console.log("gameState", gameState);

        const currentBiome = gameState.currentBiome;

        if (currentBiome.currentHealth <= 0) {
            console.log("Biome destroyed! Opening selection modal...");
            // Handle biome defeated immediately instead of using setTimeout
            // Store the destroyed biome type for display
            setDestroyedBiomeType(currentBiome.type);
            setBiomeDestroyed(true);

            // Auto-hide notification after 3 seconds
            setTimeout(() => {
                setBiomeDestroyed(false);
            }, 3000);
            // Show biomes modal for selection of next biome
            setShowBiomes(true);
        }
    }, [gameState]);

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
        // Get current pickaxe to calculate score
        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();
        let scoreAmount = 100; // Default score

        if (currentPickaxe) {
            const pickaxeDef = currentPickaxe.getPickaxe();
            // Calculate score based on pickaxe strength and critical values
            scoreAmount = Math.round(pickaxeDef.strength * 10 + 1000 * pickaxeDef.critical);

            // Flash the score display
            setScoreToShow(scoreAmount);

            // Reset score display after animation time
            setTimeout(() => {
                setScoreToShow(null);
            }, 2000);
        }

        // Attempt to mine a block with the configured chance
        attemptToMineBlock();

        // Damage the biome
        setGameState(prev => {
            // Increase picks with calculated score
            const withPicks = prev.increasePicks(scoreAmount);

            // Then damage the biome (10 points of damage per correct answer)
            const damagedBiome = prev.currentBiome.withDamage(10);
            console.log(`Biome health: ${damagedBiome.currentHealth}/${damagedBiome.getBiome().maxHealth}`);

            const updatedState = withPicks.withCurrentBiome(damagedBiome);

            return updatedState;
        });
    };

    // Attempt to mine a block with the configured chance
    const attemptToMineBlock = () => {
        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();
        if (currentPickaxe && Math.random() < currentPickaxe.getPickaxe().critical) {
            const currentBiome = gameState.currentBiome;
            if (!currentBiome) return;

            const biomeData = currentBiome.getBiome();
            const availableBlocks = biomeData.availableBlocks;

            if (availableBlocks && availableBlocks.length > 0) {
                // Select a random block from the available ones
                const randomIndex = Math.floor(Math.random() * availableBlocks.length);
                const blockName = availableBlocks[randomIndex];

                // Create temporary block to get image URL
                const tempBlock = new PlayerBlock({ name: blockName, quantity: 1 });
                const blockImageUrl = tempBlock.getImageUrl();

                // Set the mined block for animation
                setMinedBlock({
                    name: blockName,
                    imageUrl: blockImageUrl
                });

                // Set block added notification
                setBlockAdded(tempBlock);

                // Clear block added notification after 3 seconds
                setTimeout(() => {
                    setBlockAdded(null);
                }, 3000);

                // Add the block to inventory
                setGameState(prev => {
                    const updatedBlockInventory = prev.blockInventory.addBlock(blockName, 1);
                    return prev.withBlockInventory(updatedBlockInventory);
                });
            }
        }
    };

    // Handle wrong answer
    const handleWrongAnswer = () => {
        // Show wrong answer visual effects
        setWrongAnswer(true);
        setIsIncorrect(true);

        // Play error sound
        soundManager.playSound('error');

        // Add screen shake effect to the body
        document.body.classList.add('screen-shake');

        // Hide incorrect message after animation completes
        setTimeout(() => {
            setIsIncorrect(false);
        }, 1000);

        // Remove wrong answer class after animation completes
        setTimeout(() => {
            setWrongAnswer(false);
            // Remove screen shake class
            document.body.classList.remove('screen-shake');
        }, 500);

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

    // Handle unlocking a biome
    const handleUnlock = (biomeName: string) => {
        setGameState(prev => {
            // Add the biome to unlocked biomes if not already unlocked
            if (!prev.unlockedBiomes.includes(biomeName)) {
                const updatedUnlockedBiomes = [...prev.unlockedBiomes, biomeName];
                return new GameState({
                    ...prev,
                    unlockedBiomes: updatedUnlockedBiomes
                });
            }
            return prev;
        });
    };

    // Handle buying a pickaxe
    const handleBuyPickaxe = (pickaxeName: string, _unused: number) => {
        // Get the pickaxe details to determine which block to use
        const pickaxe = pickaxeStore.getItemByName(pickaxeName);
        if (!pickaxe) {
            console.error(`Pickaxe with name ${pickaxeName} not found`);
            return;
        }

        const requiredBlockType = pickaxe.cost.itemType;
        const requiredAmount = pickaxe.cost.amount;

        // Check if player has enough of the required block
        if (!gameState.blockInventory.hasBlock(requiredBlockType, requiredAmount)) {
            console.error(`Not enough ${requiredBlockType} to craft ${pickaxeName} pickaxe`);
            return;
        }

        // Create a new pickaxe
        const newPickaxe = new PlayerPickaxe({ id: null, type: pickaxeName, health: null });

        // Remove the blocks from inventory
        let updatedBlockInventory = gameState.blockInventory;
        // Add negative quantity to reduce the amount
        updatedBlockInventory = updatedBlockInventory.addBlock(requiredBlockType, -requiredAmount);

        // Add pickaxe to inventory and update block inventory
        const newState = gameState
            .withPickaxeInventory(gameState.pickaxeInventory.add(newPickaxe) as PickaxeInventory)
            .withBlockInventory(updatedBlockInventory);

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

    // Handle selecting a biome
    const handleSelectBiome = (biomeName: string) => {
        setGameState(prev => {
            // Create a new biome of the selected type
            const newBiome = new PlayerBiome({
                id: null, // Generate a new ID
                type: biomeName,
                currentHealth: null // This will reset to max health
            });

            return prev.withCurrentBiome(newBiome);
        });
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
                        <span>Picks:</span>
                        <span>{gameState.picks}</span>
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
                    scoreToShow={scoreToShow}
                    minedBlock={minedBlock}
                />

                {showQuestion && (
                    <form
                        className={`${styles.mathProblem} ${wrongAnswer ? styles.wrongAnswerShake + ' ' + styles.wrongAnswerFlash : ''}`}
                        onSubmit={handleSubmit}
                    >
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

                {isIncorrect && (
                    <div className={styles.incorrectText}>INCORRECT!</div>
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
                onUnlockBiome={handleUnlock}
                onSelectBiome={handleSelectBiome}
                selectionMode={gameState.currentBiome.currentHealth <= 0 || biomeDestroyed}
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

            {/* Biome Destroyed Notification */}
            {biomeDestroyed && (
                <div className={styles.biomeDestroyedNotification}>
                    <h3>Biome Conquered!</h3>
                    <p>You've mined the {destroyedBiomeType} biome.</p>
                    <p>Please select a new biome to explore!</p>
                </div>
            )}

            {/* Block added notification */}
            {blockAdded && (
                <div className={styles.blockAddedNotification}>
                    <img src={blockAdded.getImageUrl()} alt={blockAdded.name} />
                    <div>
                        <div>+1 {blockAdded.name}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameDisplay; 