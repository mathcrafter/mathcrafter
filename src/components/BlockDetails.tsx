'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { PlayerBlock } from '@/models/Block';
import { getAssetPath } from '../utils/assetPath';

interface BlockDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    blockName: string;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ isOpen, onClose, blockName }) => {
    if (!isOpen) return null;

    // Create a temporary block to get its properties
    const block = new PlayerBlock({ name: blockName, quantity: 1 });
    // Get biomes where this block can be found
    const biomes = block.getBiomes();

    return (
        <>
            <div className={`${styles.blockDetailsOverlay}`} onClick={onClose}></div>
            <div className={`${styles.blockDetailsDrawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.blockDetailsContent}>
                    <div className={styles.blockDetailsHeader}>
                        <h2>{block.name}</h2>
                        <button className={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div className={styles.blockDetailsBody}>
                        <div className={styles.blockDetailsImage}>
                            <img src={block.getImageUrl()} alt={block.name} />
                        </div>

                        <div className={styles.blockDetailsStat}>
                            <span className={styles.statLabel}>Rarity:</span>
                            <span className={styles.statValue}>{block.getBlock().rarity}</span>
                        </div>

                        <div className={styles.blockDetailsStat}>
                            <span className={styles.statLabel}>Found in Biomes:</span>
                            <span className={styles.statValue}>
                                {biomes.length > 0
                                    ? biomes.map(biome => biome.name).join(', ')
                                    : 'None'
                                }
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlockDetails; 