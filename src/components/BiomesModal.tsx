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
}

const BiomesModal: React.FC<BiomesModalProps> = ({ isOpen, onClose, gameState }) => {
    // Get biomes from the biome store
    const availableBiomes = biomeStore.items;

    if (!isOpen) return null;

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
                        {availableBiomes.map((biome: Biome) => (
                            <div key={biome.name} className={styles.biomeItem}>
                                <img
                                    src={`/assets/biomes/${biome.name.toLowerCase()}.webp`}
                                    alt={biome.name}
                                    className={styles.biomeItemImg}
                                />
                                <div className={styles.itemInfo}>
                                    <div className={styles.itemName}>{biome.name}</div>
                                    <div className={styles.itemDescription}>{biome.description}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BiomesModal; 