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
}

const BiomesModal: React.FC<BiomesModalProps> = ({ isOpen, onClose, gameState, onUnlockBiome }) => {
    const availableBiomes = biomeStore.items;

    const unlockedBiomes = gameState.unlockedBiomes;

    if (!isOpen) return null;

    const isBiomeUnlocked = (biomeName: string) => {
        return unlockedBiomes.includes(biomeName.toLowerCase());
    };

    const handleUnlock = (biomeName: string) => {
        if (onUnlockBiome) {
            onUnlockBiome(biomeName.toLowerCase());
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
                    <h2>Available Biomes</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.biomesSection}>
                    <h3>Biomes you can explore:</h3>

                    <div className={styles.biomesGrid}>
                        {availableBiomes.map((biome: Biome) => {
                            const isUnlocked = isBiomeUnlocked(biome.name);
                            const canUnlock = canUnlockBiome(biome.name);

                            return (
                                <div
                                    key={biome.name}
                                    className={`${styles.biomeItem} ${isUnlocked ? styles.biomeUnlocked : styles.biomeLocked}`}
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
                                        </div>
                                        <div className={styles.itemDescription}>{biome.description}</div>
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