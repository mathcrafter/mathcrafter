'use client';

import React, { useState, useEffect, useRef } from 'react';
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
import BuyBlocksModal from './BuyBlocksModal';
import { biomeStore } from '@/stores/BiomeStore';
import { getAssetPath } from '../utils/assetPath';
import ExportGameModal from './ExportGameModal';
import ToolsDrawer from './ToolsDrawer';
import { blockStore } from '@/stores/BlockStore';

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
    const [picksToShow, setPicksToShow] = useState<number | null>(null);
    const [minedBlock, setMinedBlock] = useState<{ name: string; imageUrl: string } | null>(null);
    const [blockAdded, setBlockAdded] = useState<PlayerBlock | null>(null);
    const [showBuyBlocks, setShowBuyBlocks] = useState<boolean>(false);
    const [showExportGame, setShowExportGame] = useState<boolean>(false);
    const answerInputRef = useRef<HTMLInputElement>(null);

    // Replace separate modal states with a single tools drawer tab state
    const [activeToolsTab, setActiveToolsTab] = useState<string>('pickaxes');
    const [showBlocksPanel, setShowBlocksPanel] = useState<boolean>(false);

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
            // Store the destroyed biome type for display
            setDestroyedBiomeType(currentBiome.type);
            setBiomeDestroyed(true);

            // Auto-hide notification after 3 seconds
            setTimeout(() => {
                setBiomeDestroyed(false);
            }, 3000);
            // User can open biomes modal manually now
        }
    }, [gameState]);

    // Focus the answer input when the question modal appears
    useEffect(() => {
        if (showQuestion && answerInputRef.current) {
            setTimeout(() => {
                answerInputRef.current?.focus();
            }, 100);
        }
    }, [showQuestion]);

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
            handleCorrectAnswer(null, true);
            // Generate new problem
            generateNewProblem();
            // Clear the answer field
            setAnswer('');
            // Hide the question
            setShowQuestion(false);
        } else {
            handleWrongAnswer();
            // Just clear the answer field, but keep the same problem
            setAnswer('');
            // Keep the question panel open so player can try again
        }
    };

    // Handle correct answer
    const handleCorrectAnswer = (picks: number | null = null, dealDamageToBiome: boolean = true) => {
        // Get current pickaxe to calculate score
        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();

        if (currentPickaxe) {
            picks = picks || currentPickaxe.getPicks();

            // Flash the score display
            setPicksToShow(picks);

            // Reset score display after animation time
            setTimeout(() => {
                setPicksToShow(null);
            }, 2000);
        }

        // Attempt to mine a block with the configured chance
        attemptToMineBlock();

        // Damage the biome
        setGameState(prev => {
            const currentPickaxe = prev.pickaxeInventory.getCurrentItem();
            if (!currentPickaxe) {
                console.log("No current pickaxe found");
                return prev;
            }
            // Increase picks with calculated score
            const withPicks = prev.increasePicks(picks || 0);

            if (dealDamageToBiome) {
                const damagedBiome = prev.currentBiome.withDamage(currentPickaxe.getDamageToBiome(prev.currentBiome.getBiome()));
                console.log(`Biome health: ${damagedBiome.currentHealth}/${damagedBiome.getBiome().maxHealth}`);

                const updatedState = withPicks.withCurrentBiome(damagedBiome);

                return updatedState;
            }
            return prev;
        });
    };

    // Attempt to mine a block with the configured chance
    const attemptToMineBlock = () => {
        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();
        if (!currentPickaxe) return;

        const currentBiome = gameState.currentBiome;
        if (!currentBiome) return;

        const biomeData = currentBiome.getBiome();
        const availableBlocks = biomeData.availableBlocks;

        // Check for critical hit chance to determine if any block will be mined
        const isCriticalHit = Math.random() < currentPickaxe.getPickaxe().critical;

        if (isCriticalHit && availableBlocks && availableBlocks.length > 0) {
            // Determine if we're mining a biome-specific block or a common block
            // 15% chance to mine a common block from any biome, otherwise mine biome-specific
            const shouldMineCommonBlock = Math.random() < 0.15;

            if (shouldMineCommonBlock) {
                // Mine a common block (any block with "Common" rarity)
                // First, collect all common blocks from the biome's available blocks
                const commonBiomeBlocks = availableBlocks.filter(blockName => {
                    try {
                        const blockData = blockStore.getItemByName(blockName);
                        return blockData.rarity === "Common";
                    } catch (e) {
                        return false;
                    }
                });

                if (commonBiomeBlocks.length > 0) {
                    // Choose a random common block from the biome
                    const randomIndex = Math.floor(Math.random() * commonBiomeBlocks.length);
                    const blockName = commonBiomeBlocks[randomIndex];
                    addBlockToInventory(blockName);
                } else {
                    // If no common blocks in this biome, fall back to biome-specific blocks
                    const randomIndex = Math.floor(Math.random() * availableBlocks.length);
                    const blockName = availableBlocks[randomIndex];
                    addBlockToInventory(blockName);
                }
            } else {
                // Mine a biome-specific block
                const randomIndex = Math.floor(Math.random() * availableBlocks.length);
                const blockName = availableBlocks[randomIndex];
                addBlockToInventory(blockName);
            }
        }
    };

    // Helper function to add blocks to inventory and show notifications
    const addBlockToInventory = (blockName: string) => {
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
            const damagedPickaxe = currentPickaxe.withDamage(1);

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
        // Don't respond to clicks when a question is being shown
        if (showQuestion) return;

        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();
        if (!currentPickaxe) return;

        // Generate random number and check against pickaxe critical
        const randomValue = Math.random();
        const criticalValue = currentPickaxe.getPickaxe().critical;

        // If random number is between 0 and critical, show the question
        if (randomValue <= criticalValue) {
            // Show the math question
            setShowQuestion(true);
            generateNewProblem();
        } else {
            // Skip the question and directly mine the biome
            handleCorrectAnswer(currentPickaxe.getPickaxe().strength, true);
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

    // Toggle buy blocks modal visibility
    const toggleBuyBlocks = () => {
        setShowBuyBlocks(prev => !prev);
    };

    // Toggle export game modal visibility
    const toggleExportGame = () => {
        setShowExportGame(prev => !prev);
    };

    // Close the question modal
    const closeQuestionModal = () => {
        setShowQuestion(false);
    };

    // Handle unlocking a biome
    const handleUnlock = (biomeName: string) => {
        // Don't do anything if the biome is already unlocked
        if (gameState.unlockedBiomes.includes(biomeName)) {
            return;
        }

        // Get the biome details to determine the cost
        const biome = biomeStore.getItemByName(biomeName);
        if (!biome) {
            console.error(`Biome with name ${biomeName} not found`);
            return;
        }

        // Check if the biome costs something to unlock
        if (biome.cost) {
            const requiredBlockType = biome.cost.itemType;
            const requiredAmount = biome.cost.amount;

            // Check if player has enough of the required block
            if (!gameState.blockInventory.hasBlock(requiredBlockType, requiredAmount)) {
                console.error(`Not enough ${requiredBlockType} to unlock ${biomeName} biome`);
                return;
            }

            // Update game state: deduct cost and add to unlocked biomes
            setGameState(prev => {
                // Remove the blocks from inventory
                let updatedBlockInventory = prev.blockInventory;
                // Add negative quantity to reduce the amount
                updatedBlockInventory = updatedBlockInventory.addBlock(requiredBlockType, -requiredAmount);

                // Add the biome to unlocked biomes
                const updatedUnlockedBiomes = [...prev.unlockedBiomes, biomeName];

                return new GameState({
                    ...prev,
                    unlockedBiomes: updatedUnlockedBiomes,
                    blockInventory: updatedBlockInventory
                });
            });
        } else {
            // Biome is free to unlock
            setGameState(prev => {
                const updatedUnlockedBiomes = [...prev.unlockedBiomes, biomeName];
                return new GameState({
                    ...prev,
                    unlockedBiomes: updatedUnlockedBiomes
                });
            });
        }
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

        // Create a new pickaxe inventory with the new pickaxe added and set as current
        const updatedPickaxeInventory = new PickaxeInventory({
            items: [...gameState.pickaxeInventory.items, newPickaxe],
            currentItem: newPickaxe.id
        });

        // Update the game state with both the new pickaxe and updated block inventory
        const newState = gameState
            .withPickaxeInventory(updatedPickaxeInventory)
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

    // Handle buying a block
    const handleBuyBlock = (blockName: string) => {
        // Check if player has enough picks
        if (gameState.picks < 100) {
            return;
        }

        // Deduct picks and add block to inventory
        setGameState(prev => {
            // Deduct 100 picks
            const updatedState = prev.increasePicks(-100);

            // Add the block to inventory
            const updatedBlockInventory = updatedState.blockInventory.addBlock(blockName, 1);

            // Set block added notification
            setBlockAdded(new PlayerBlock({ name: blockName, quantity: 1 }));

            // Clear block added notification after 3 seconds
            setTimeout(() => {
                setBlockAdded(null);
            }, 3000);

            return updatedState.withBlockInventory(updatedBlockInventory);
        });
    };

    // Toggle blocks panel
    const toggleBlocksPanel = () => {
        setShowBlocksPanel(prev => !prev);
    };

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div className={styles.gameContainer}>Loading...</div>;
    }

    return (
        <div className={styles.gameContainer}>
            <div className={styles.gameHeader}>
                <h1>MathCrafter</h1>
                <div className={styles.avatar}>
                    <img
                        src={getAssetPath('/assets/avatars/avatar.png')}
                        alt="Player Avatar"
                        className={styles.avatarImage}
                        onClick={toggleInventory}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <img src={getAssetPath('/assets/picks.png')} alt="Picks" className={styles.picksIcon} />
                        <span>{gameState.picks}</span>
                    </div>
                </div>
                <div className={styles.headerButtons}>
                    <button
                        className={`${styles.blocksPulldownButton} ${showBlocksPanel ? styles.blocksPulldownButtonActive : ''}`}
                        onClick={toggleBlocksPanel}
                    >
                        Blocks <span className={styles.pulldownArrow}>{showBlocksPanel ? '▲' : '▼'}</span>
                    </button>
                    <button
                        className={styles.exportGameButton}
                        onClick={toggleExportGame}
                    >
                        Export
                    </button>
                </div>
            </div>

            {/* Global Blocks Panel */}
            {showBlocksPanel && (
                <div className={styles.globalBlocksPanel}>
                    <div className={styles.globalBlocksPanelHeader}>
                        <h2>Buy Blocks from {gameState.currentBiome.getBiome().name} biome</h2>
                        <button className={styles.closeBlocksPanelBtn} onClick={toggleBlocksPanel}>▲</button>
                    </div>
                    <div className={styles.globalBlocksPanelContent}>
                        <BuyBlocksModal
                            isOpen={true}
                            onClose={() => { }}
                            gameState={gameState}
                            onBuyBlock={handleBuyBlock}
                        />
                    </div>
                </div>
            )}

            <div className={styles.gameArea}>
                <Biome
                    onBiomeClick={handleBiomeClick}
                    currentPickaxe={gameState.pickaxeInventory.getCurrentItem()}
                    currentBiome={gameState.currentBiome}
                    picksToShow={picksToShow}
                    minedBlock={minedBlock}
                />

                <QuickInventory
                    gameState={gameState}
                    onSelectPickaxe={handleSelectPickaxe}
                />
            </div>

            {/* Tools Drawer (always open) */}
            <ToolsDrawer
                isOpen={true}
                onClose={() => { }}
                gameState={gameState}
                onBuyPickaxe={handleBuyPickaxe}
                onUnlockBiome={handleUnlock}
                onSelectBiome={handleSelectBiome}
                activeTab={activeToolsTab}
            />

            {/* Question Modal */}
            <div className={`${styles.modal} ${showQuestion ? styles.modalShow : ''}`}>
                <div className={`${styles.modalContent} ${styles.questionModalContent}`}>
                    <div className={styles.modalHeader}>
                        <h2>Math Problem</h2>
                        <button className={styles.closeBtn} onClick={closeQuestionModal}>×</button>
                    </div>
                    <form
                        className={`${styles.mathProblem} ${wrongAnswer ? styles.wrongAnswerShake + ' ' + styles.wrongAnswerFlash : ''}`}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.question}>
                            {problem.num1} {problem.operator} {problem.num2} = ?
                        </div>
                        <div className={styles.answerArea}>
                            <input
                                ref={answerInputRef}
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
                </div>
            </div>

            {isIncorrect && (
                <div className={styles.incorrectText}>INCORRECT!</div>
            )}

            {/* Inventory Modal */}
            <InventoryModal
                isOpen={showInventory}
                onClose={toggleInventory}
                gameState={gameState}
                onSelectPickaxe={handleSelectPickaxe}
            />

            {/* Export Game Modal */}
            <ExportGameModal
                isOpen={showExportGame}
                onClose={toggleExportGame}
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