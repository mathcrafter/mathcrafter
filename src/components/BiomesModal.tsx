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

    if (!isOpen) return null;

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
        // TODO: placeholder
        return true;
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalShow : ''}`}>
            <div className={`${styles.modalContent} ${styles.biomesModalContent}`}>
                <div className={styles.modalHeader}>
                    <h2>{selectionMode ? 'Select Next Biome' : 'Available Biomes'}</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

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
                                                    Cost: <span className={canUnlock ? styles.affordableCost : styles.unaffordableCost}>{0}</span>
                                                </div>
                                                <button
                                                    className={`${styles.unlockButton} ${!canUnlock ? styles.unlockButtonDisabled : ''}`}
                                                    onClick={() => handleUnlock(biome.name)}
                                                    disabled={!canUnlock}
                                                >
                                                    {canUnlock ? 'Unlock' : 'Not enough score'}
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
    );
};

export default BiomesModal; 