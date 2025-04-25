'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { biomeStore } from '@/stores/BiomeStore';
import { Biome } from '@/models/Biome';

interface BiomesModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onUnlockBiome?: (biomeName: string) => void;
    onSelectBiome?: (biomeName: string) => void;
    selectionMode?: boolean;
}

const BiomesModal: React.FC<BiomesModalProps> = ({
    isOpen,
    onClose,
    gameState,
    onUnlockBiome,
    onSelectBiome,
    selectionMode = false
}) => {
    const availableBiomes = biomeStore.items;
    const unlockedBiomes = gameState.unlockedBiomes;
    const currentBiomeType = gameState.currentBiome.type;
    const isBiomeDestroyed = gameState.currentBiome.currentHealth <= 0;

    // Log for debugging
    console.log(`BiomesModal opened - Selection mode: ${selectionMode}, Biome destroyed: ${isBiomeDestroyed}, Current health: ${gameState.currentBiome.currentHealth}`);

    const isBiomeUnlocked = (biomeName: string) => {
        return unlockedBiomes.includes(biomeName.toLowerCase());
    };

    const handleUnlock = (biomeName: string) => {
        if (onUnlockBiome) {
            onUnlockBiome(biomeName.toLowerCase());
        }
    };

    const handleSelect = (biomeName: string) => {
        if (onSelectBiome && isBiomeUnlocked(biomeName)) {
            onSelectBiome(biomeName.toLowerCase());
            onClose();
        }
    };

    const canUnlockBiome = (biomeName: string) => {
        // If the biome is already unlocked, no need to check resources
        if (isBiomeUnlocked(biomeName)) {
            return true;
        }

        const biome = biomeStore.getItemByName(biomeName);

        // If biome has no cost, it's free to unlock
        if (!biome.cost) {
            return true;
        }

        // Check if the player has the required items
        return gameState.blockInventory.hasBlock(biome.cost.itemType, biome.cost.amount);
    };

    return (
        <>
            {/* Darkened overlay when drawer is open */}
            <div
                className={`${styles.biomesOverlay} ${isOpen ? styles.biomesOverlayOpen : ''}`}
                onClick={onClose}
            />

            {/* Drawer component */}
            <div className={`${styles.biomesDrawer} ${isOpen ? styles.biomesDrawerOpen : ''}`}>
                {/* Handle to open/close the drawer */}
                <div className={styles.biomesDrawerHandle} onClick={onClose} />

                <div className={styles.biomesDrawerHeader}>
                    <h2>{selectionMode ? 'Select Next Biome' : 'Available Biomes'}</h2>
                </div>

                <div className={styles.biomesDrawerContent}>
                    <div className={styles.biomesSection}>
                        <h3>{selectionMode ? 'Choose a biome to explore:' : 'Biomes you can explore:'}</h3>

                        <div className={styles.biomesGrid}>
                            {availableBiomes.map((biome: Biome) => {
                                const isUnlocked = isBiomeUnlocked(biome.name);
                                const canUnlock = canUnlockBiome(biome.name);
                                const isCurrentBiome = biome.name.toLowerCase() === currentBiomeType;

                                return (
                                    <div
                                        key={biome.name}
                                        className={`${styles.biomeItem} 
                                                ${isUnlocked ? styles.biomeUnlocked : styles.biomeLocked}
                                                ${isCurrentBiome ? styles.biomeSelected : ''}`}
                                        onClick={() => isUnlocked && selectionMode ? handleSelect(biome.name) : null}
                                        style={{ cursor: isUnlocked && selectionMode ? 'pointer' : 'default' }}
                                    >
                                        <img
                                            src={`/assets/biomes/${biome.name.toLowerCase()}.webp`}
                                            alt={biome.name}
                                            className={`${styles.biomeItemImg} ${!isUnlocked ? styles.biomeLockedImg : ''}`}
                                        />
                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemName}>
                                                {biome.name}
                                                {isUnlocked && <span className={styles.unlockedIndicator}>✓</span>}
                                                {isCurrentBiome && <span className={styles.currentIndicator}> (Current)</span>}
                                            </div>
                                            <div className={styles.itemDescription}>{biome.description}</div>
                                            {biome.availableBlocks && biome.availableBlocks.length > 0 && (
                                                <div className={styles.availableBlocks}>
                                                    <span>Available blocks: </span>
                                                    <div className={styles.blockImagesContainer}>
                                                        {biome.availableBlocks.map(block => (
                                                            <div key={block} className={styles.blockImageWrapper}>
                                                                <img
                                                                    src={`/assets/blocks/${block}.png`}
                                                                    alt={block}
                                                                    className={styles.blockImage}
                                                                />
                                                                <span className={styles.blockName}>{block}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {!isUnlocked && (
                                                <>
                                                    <div className={styles.unlockCost}>
                                                        {biome.cost ? (
                                                            <>
                                                                Cost: <span className={canUnlock ? styles.affordableCost : styles.unaffordableCost}>
                                                                    {biome.cost.amount} {biome.cost.itemType}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span className={styles.affordableCost}>Free</span>
                                                        )}
                                                    </div>
                                                    <button
                                                        className={`${styles.unlockButton} ${!canUnlock ? styles.unlockButtonDisabled : ''}`}
                                                        onClick={() => handleUnlock(biome.name)}
                                                        disabled={!canUnlock}
                                                    >
                                                        {canUnlock ? 'Unlock' : 'Not enough resources'}
                                                    </button>
                                                </>
                                            )}
                                            {isUnlocked && selectionMode && !isCurrentBiome && (
                                                <button
                                                    className={styles.selectButton}
                                                    onClick={() => handleSelect(biome.name)}
                                                >
                                                    Select
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BiomesModal; 