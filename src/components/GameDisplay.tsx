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
import { Pickaxe, PlayerPickaxe } from '@/models/Pickaxe';
import soundManager from '@/utils/SoundManager';
import { PickaxeInventory } from '@/models/Inventory';
import { Block, PlayerBlock } from '@/models/Block';
import { pickaxeStore } from '@/stores/PickaxeStore';
import BuyBlocksModal from './BuyBlocksModal';
import { biomeStore } from '@/stores/BiomeStore';
import { getAssetPath } from '../utils/assetPath';
import ExportGameModal from './ExportGameModal';
import { blockStore } from '@/stores/BlockStore';
import FurnaceModal from './FurnaceModal';
import { Recipe } from '@/models/Recipe';
import BlockDetails from './BlockDetails';
import ChestModal from './ChestModal';
import { Chest, RewardProps } from '@/models/Chest';

type BlockType = ReturnType<typeof blockStore.getItemByName> extends null ? never : NonNullable<ReturnType<typeof blockStore.getItemByName>>;

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
    const [pickaxeAdded, setPickaxeAdded] = useState<PlayerPickaxe | null>(null);
    const [showBuyBlocks, setShowBuyBlocks] = useState<boolean>(false);
    const [showExportGame, setShowExportGame] = useState<boolean>(false);
    const [showFurnace, setShowFurnace] = useState<boolean>(false);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [notEnoughPicks, setNotEnoughPicks] = useState<boolean>(false);
    const [isHintAnswer, setIsHintAnswer] = useState<boolean>(false);
    const answerInputRef = useRef<HTMLInputElement>(null);
    const HINT_COST = 500;
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const [showChestModal, setShowChestModal] = useState<boolean>(false);
    const [chestBiomeType, setChestBiomeType] = useState<string | null>(null);
    const [currentChest, setCurrentChest] = useState<Chest | null>(null);

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

            // Get the chest for this biome
            const biomeChest = currentBiome.getChest();

            // Set chest modal data
            setChestBiomeType(currentBiome.type);
            setCurrentChest(biomeChest);
            setShowChestModal(true);

            // Auto-hide notification after 3 seconds, but keep chest modal open
            setTimeout(() => {
                setBiomeDestroyed(false);
            }, 3000);
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
        setShowHint(false);
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

    // Handle showing hint
    const handleShowHint = () => {
        // Check if player has enough picks
        if (gameState.picks < HINT_COST) {
            setNotEnoughPicks(true);
            setTimeout(() => {
                setNotEnoughPicks(false);
            }, 2000);
            return;
        }

        // Deduct picks and show hint
        setGameState(prev => prev.increasePicks(-HINT_COST));
        setShowHint(true);

        // Show the correct answer in the input field
        setIsHintAnswer(true);
        setAnswer(problem.answer.toString());

        // Clear the hint answer after 2 seconds
        setTimeout(() => {
            setIsHintAnswer(false);
            setAnswer('');
            answerInputRef.current?.focus();
        }, 2000);
    };

    // Handle correct answer
    const handleCorrectAnswer = (picks: number | null = null, dealDamageToBiome: boolean = true) => {
        // Get current pickaxe to calculate score
        const currentPickaxe = gameState.pickaxeInventory.getCurrentItem();

        if (!currentPickaxe) {
            console.error("No current pickaxe found");
            return;
        }

        picks = picks || currentPickaxe.getPicks();

        // Flash the score display
        setPicksToShow(picks);

        // Reset score display after animation time
        setTimeout(() => {
            setPicksToShow(null);
        }, 2000);

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

        const blocksByRarity: Record<string, BlockType[]> = {
            Common: [],
            Uncommon: [],
            Rare: [],
            Legendary: []
        };

        const rarityChances: Record<string, number> = {
            Common: 0.55,
            Uncommon: 0.3,
            Rare: 0.1,
            Legendary: 0.05
        };

        availableBlocks.forEach(blockName => {
            const blockData = blockStore.getItemByName(blockName);
            if (blockData === null) {
                console.error(`Block with name ${blockName} not found`);
                return;
            }

            blocksByRarity[blockData.rarity].push(blockData);
        });

        // Determine the rarity of the block to mine
        const rarity = Object.keys(rarityChances).find(rarity => Math.random() <= rarityChances[rarity]);

        if (!rarity) {
            console.error("No rarity found");
            return;
        }

        const randomIndex = Math.floor(Math.random() * blocksByRarity[rarity].length);
        const randomBlock = blocksByRarity[rarity][randomIndex];

        if (!randomBlock) {
            console.error("No block found");
            return;
        }

        addBlockToInventory(randomBlock.name);
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

        generateNewProblem();
        setShowQuestion(true);
        // // If random number is between 0 and critical, show the question
        // if (randomValue <= criticalValue) {
        //     // Show the math question
        //     setShowQuestion(true);
        //     generateNewProblem();
        // } else {
        //     // Skip the question and directly mine the biome
        //     handleCorrectAnswer(currentPickaxe.getPickaxe().strength, true);
        // }
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

    // Toggle furnace modal visibility
    const toggleFurnace = () => {
        setShowFurnace(prev => !prev);
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
                currentHealth: null, // This will reset to max health
                chest: null
            });

            return prev.withCurrentBiome(newBiome);
        });
    };

    // Function to get block cost based on rarity
    const getBlockCost = (rarity: string): number => {
        switch (rarity) {
            case 'Common': return 100;
            case 'Uncommon': return 200;
            case 'Rare': return 500;
            case 'Legendary': return 2000;
            default: return 100;
        }
    };

    // Handle buying a block
    const handleBuyBlock = (blockName: string) => {
        console.log("handleBuyBlock", blockName);
        // Find the block in the blockStore
        const block = blockStore.getItemByName(blockName);

        // If the block exists, subtract the cost from the player's picks
        if (block) {
            const blockCost = getBlockCost(block.rarity);
            if (gameState.picks >= blockCost) {
                const updatedState = gameState
                    .increasePicks(-blockCost) // Subtract the cost
                    .withBlockInventory(gameState.blockInventory.addBlock(blockName, 1)); // Add the block to inventory

                setGameState(updatedState);
                soundManager.playSound('buy');
            }
        }
    };

    // Handle crafting a recipe
    const handleCraftRecipe = (recipe: Recipe) => {
        console.log("handleCraftRecipe", recipe);

        // Play craft sound
        soundManager.playSound('craft');

        // Show item added notification
        const craftedBlock = new PlayerBlock({ name: recipe.name, quantity: 1 });
        setBlockAdded(craftedBlock);

        // Hide the notification after a delay
        setTimeout(() => {
            setBlockAdded(null);
        }, 2000);

        // Force a game state reload to ensure we have the latest state after crafting
        // This will trigger a re-render with the updated state from the FurnaceModal
        setGameState(current => new GameState({
            pickaxeInventory: current.pickaxeInventory,
            blockInventory: current.blockInventory,
            picks: current.picks,
            unlockedBiomes: current.unlockedBiomes,
            currentBiome: current.currentBiome
        }));
    };

    // Calculate total pickaxes
    const totalPickaxes = gameState.pickaxeInventory.length;

    // Handle block click
    const handleBlockClick = (blockName: string) => {
        setSelectedBlock(blockName);
    };

    // Close block details modal
    const handleCloseBlockDetails = () => {
        setSelectedBlock(null);
    };

    // Handle claiming chest rewards
    const handleClaimChestRewards = (rewards: RewardProps[]) => {
        // Add all the rewarded items to player's inventory
        rewards.forEach(reward => {
            if (reward.getAmount() > 0) {
                // Check if reward has a "strength" property to determine if it's a pickaxe
                if (reward.getType() === 'pickaxe') {
                    // // It's a pickaxe
                    const pickaxeName = reward.get().name;

                    // Create a new pickaxe and add it to inventory
                    for (let i = 0; i < reward.getAmount(); i++) {
                        const newPickaxe = new PlayerPickaxe({ id: null, type: pickaxeName, health: null });

                        // Add the new pickaxe to inventory
                        setGameState(prev => {
                            const updatedPickaxeInventory = new PickaxeInventory({
                                items: [...prev.pickaxeInventory.items, newPickaxe],
                                currentItem: prev.pickaxeInventory.currentItem
                            });
                            return prev.withPickaxeInventory(updatedPickaxeInventory);
                        });
                        setPickaxeAdded(newPickaxe);
                    }
                } else {
                    // It's a block
                    // Add blocks to inventory
                    setGameState(prev => {
                        const updatedBlockInventory = prev.blockInventory.addBlock(reward.get().name, reward.getAmount());
                        return prev.withBlockInventory(updatedBlockInventory);
                    });

                    // Create temporary block for notification
                    const tempBlock = new PlayerBlock({ name: reward.get().name, quantity: reward.getAmount() });
                    setBlockAdded(tempBlock);
                }

                // Hide notification after delay
                setTimeout(() => {
                    setBlockAdded(null);
                }, 3000);
            }
        });

        // Close the chest modal
        setShowChestModal(false);

        // Reset current biome health by creating a new biome with full health
        setGameState(prev => {
            const newBiome = new PlayerBiome({
                id: null,
                type: prev.currentBiome.type,
                currentHealth: null, // This will reset to max health
                chest: null
            });
            return prev.withCurrentBiome(newBiome);
        });

        // Open biomes modal to select a new biome
        setShowBiomes(true);
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
                        className={styles.pickaxesButton}
                        onClick={toggleShop}
                    >
                        Pickaxes
                    </button>
                    <button
                        className={styles.unlockBiomesButton}
                        onClick={toggleBiomes}
                    >
                        Biomes
                    </button>
                    <button
                        className={styles.buyBlocksButton}
                        onClick={toggleBuyBlocks}
                    >
                        Blocks
                    </button>
                    <button
                        className={styles.furnaceButton}
                        onClick={toggleFurnace}
                    >
                        Furnace
                    </button>
                    <button
                        className={styles.exportGameButton}
                        onClick={toggleExportGame}
                    >
                        Export
                    </button>
                </div>
            </div>

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
                    onBlockClick={handleBlockClick}
                />
            </div>

            {/* Question Modal */}
            <div className={`${styles.modal} ${showQuestion ? styles.modalShow : ''}`}>
                <div className={`${styles.modalContent} ${styles.questionModalContent}`}>
                    <div className={styles.modalHeader}>
                        <h2>Math Problem</h2>
                    </div>
                    <form
                        className={`${styles.mathProblem} ${wrongAnswer ? styles.wrongAnswerShake + ' ' + styles.wrongAnswerFlash : ''}`}
                        onSubmit={handleSubmit}
                    >
                        <div className={styles.question}>
                            {problem.num1} {problem.operator} {problem.num2} = ?
                        </div>
                        {notEnoughPicks && (
                            <div className={styles.notEnoughPicks}>
                                Not enough picks! Need 500 picks for a hint.
                            </div>
                        )}
                        <div className={styles.answerArea}>
                            <input
                                ref={answerInputRef}
                                type="number"
                                className={`${styles.answer} ${isHintAnswer ? styles.hintAnswer : ''}`}
                                value={answer}
                                onChange={(e) => setAnswer(e.target.value)}
                                readOnly={isHintAnswer}
                                autoFocus
                            />
                            <div className={styles.buttonGroup}>
                                <button type="submit" className={styles.submitBtn}>Mine!</button>
                            </div>
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
                                className={`${styles.numpadBtn} ${styles.hintBtn} ${gameState.picks < HINT_COST ? styles.hintBtnDisabled : ''}`}
                                onClick={handleShowHint}
                                disabled={gameState.picks < HINT_COST}
                            >
                                Hint ({HINT_COST})
                            </button>
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
                selectionMode={true}
            />

            {/* Buy Blocks Modal */}
            <BuyBlocksModal
                isOpen={showBuyBlocks}
                onClose={toggleBuyBlocks}
                gameState={gameState}
                onBuyBlock={handleBuyBlock}
            />

            {/* Export Game Modal */}
            <ExportGameModal
                isOpen={showExportGame}
                onClose={toggleExportGame}
                gameState={gameState}
            />

            {/* Furnace Modal */}
            <FurnaceModal
                isOpen={showFurnace}
                onClose={toggleFurnace}
                gameState={gameState}
                onCraft={handleCraftRecipe}
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

            {/* Chest Modal */}
            <ChestModal
                isOpen={showChestModal}
                onClose={() => {
                    setShowChestModal(false);

                    // Reset current biome health by creating a new biome with full health
                    setGameState(prev => {
                        const newBiome = new PlayerBiome({
                            id: null,
                            type: prev.currentBiome.type,
                            currentHealth: null, // This will reset to max health
                            chest: null
                        });
                        return prev.withCurrentBiome(newBiome);
                    });

                    setShowBiomes(true); // Open biomes selection after closing chest
                }}
                biomeType={chestBiomeType}
                chest={currentChest}
                onClaimRewards={handleClaimChestRewards}
            />

            {/* Block added notification */}
            {blockAdded && (
                <div className={styles.blockAddedNotification}>
                    <img src={blockAdded.getImageUrl()} alt={blockAdded.name} />
                    <div>
                        <div>+1 {blockAdded.name}</div>
                    </div>
                </div>
            )}

            {/* Pickaxe added notification */}
            {pickaxeAdded && (
                <div className={styles.pickaxeAddedNotification}>
                    <img src={pickaxeAdded.getImageUrl()} alt={pickaxeAdded.getPickaxe().name} />
                    <div>
                        <div>+1 {pickaxeAdded.getPickaxe().name}</div>
                    </div>
                </div>
            )}

            {/* Block Details Modal */}
            <BlockDetails
                isOpen={selectedBlock !== null}
                onClose={handleCloseBlockDetails}
                blockName={selectedBlock || ''}
            />
        </div>
    );
};

export default GameDisplay; 