'use client';

import React, { useEffect, useRef, useState } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { biomeStore } from '@/stores/BiomeStore';
import { Biome } from '@/models/Biome';
import { getAssetPath } from '../utils/assetPath';
import BlockDetails from './BlockDetails';
import { logEvent } from '@/utils/analytics';

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
    const drawerContentRef = useRef<HTMLDivElement>(null);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

    // Log for debugging
    console.log(`BiomesModal opened - Selection mode: ${selectionMode}, Biome destroyed: ${isBiomeDestroyed}, Current health: ${gameState.currentBiome.currentHealth}`);

    // Check for scrollable content and apply hasScroll class
    useEffect(() => {
        if (isOpen && drawerContentRef.current) {
            const checkScroll = () => {
                const element = drawerContentRef.current;
                if (element) {
                    if (element.scrollHeight > element.clientHeight) {
                        element.classList.add(styles.hasScroll);
                    } else {
                        element.classList.remove(styles.hasScroll);
                    }
                }
            };

            // Check on initial render and when content might change
            checkScroll();

            // Set up a resize observer to check when container dimensions change
            const resizeObserver = new ResizeObserver(checkScroll);
            resizeObserver.observe(drawerContentRef.current);

            // Clean up
            return () => {
                if (drawerContentRef.current) {
                    resizeObserver.unobserve(drawerContentRef.current);
                }
                resizeObserver.disconnect();
            };
        }
    }, [isOpen, availableBiomes]);

    const isBiomeUnlocked = (biomeName: string) => {
        return unlockedBiomes.includes(biomeName.toLowerCase());
    };

    const handleUnlock = (biomeName: string) => {
        if (onUnlockBiome) {
            // Track biome unlock event
            logEvent('Biome', 'Unlock', biomeName);
            onUnlockBiome(biomeName.toLowerCase());
        }
    };

    const handleSelect = (e: React.MouseEvent, biomeName: string) => {
        e.stopPropagation(); // Prevent any parent click handlers
        if (onSelectBiome && isBiomeUnlocked(biomeName) && biomeName.toLowerCase() !== currentBiomeType) {
            // Track biome selection event
            logEvent('Biome', 'Select', biomeName);
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

    const handleBlockClick = (e: React.MouseEvent, blockName: string) => {
        e.stopPropagation();
        setSelectedBlock(blockName);
    };

    const handleCloseBlockDetails = () => {
        setSelectedBlock(null);
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
                    <h2>{selectionMode ? 'Select Biome' : 'Available Biomes'}</h2>
                </div>

                <div ref={drawerContentRef} className={styles.biomesDrawerContent} data-drawer-type="biomes">
                    <div className={styles.biomesSection}>
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
                                    >
                                        <div className={styles.biomeImageContainer}>
                                            <img
                                                src={getAssetPath(`/assets/biomes/${biome.name.toLowerCase()}.png`)}
                                                alt={biome.name}
                                                className={styles.biomeItemImg}
                                            />
                                            {!isUnlocked && (
                                                <div className={styles.lockOverlay}>
                                                    <img
                                                        src={getAssetPath('/assets/padlock.svg')}
                                                        alt="Locked"
                                                        className={styles.lockIcon}
                                                    />
                                                </div>
                                            )}
                                            <div className={styles.biomeNameOverlay}>
                                                {biome.name}
                                                {isUnlocked && <span className={styles.unlockedIndicator}>✓</span>}
                                                {isCurrentBiome && <span className={styles.currentIndicator}> (Current)</span>}
                                            </div>
                                        </div>

                                        <div className={styles.availableBlocks}>
                                            <span>Available Blocks:</span>
                                            <div className={styles.blockImagesContainer}>
                                                {biome.availableBlocks.map((blockName) => (
                                                    <div
                                                        key={blockName}
                                                        className={styles.blockImageWrapper}
                                                        onClick={(e) => handleBlockClick(e, blockName)}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <img
                                                            src={getAssetPath(`/assets/blocks/${blockName}.png`)}
                                                            alt={blockName}
                                                            className={styles.blockImage}
                                                        />
                                                        <div className={styles.blockName}>{blockName}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className={styles.availablePickaxes}>
                                            <span>Available Pickaxes:</span>
                                            <div className={styles.blockImagesContainer}>
                                                {biome.availablePickaxes.length > 0 ? (
                                                    biome.availablePickaxes.map((pickaxeName) => (
                                                        <div key={pickaxeName} className={styles.blockImageWrapper}>
                                                            <img
                                                                src={getAssetPath(`/assets/pickaxes/${pickaxeName}.png`)}
                                                                alt={pickaxeName}
                                                                className={styles.blockImage}
                                                            />
                                                            <div className={styles.blockName}>{pickaxeName}</div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className={styles.noPickaxes}>No pickaxes available</div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.itemInfo}>
                                            <div className={styles.itemDescription}>{biome.description}</div>

                                            {!isUnlocked && (
                                                <>
                                                    <div className={styles.unlockCost}>
                                                        {biome.cost ? (
                                                            <>
                                                                Cost:
                                                                <div className={styles.costItemContainer}>
                                                                    <div className={styles.costItemImgWrapper}>
                                                                        <img
                                                                            src={getAssetPath(`/assets/blocks/${biome.cost.itemType}.png`)}
                                                                            alt={biome.cost.itemType}
                                                                            className={styles.costItemImg}
                                                                        />
                                                                        <span className={styles.costItemBadge}>{biome.cost.amount}</span>
                                                                    </div>
                                                                    <span className={canUnlock ? styles.affordableCost : styles.unaffordableCost}>
                                                                        {biome.cost.itemType.replace(/_/g, ' ')}
                                                                    </span>
                                                                </div>
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
                                                    onClick={(e) => handleSelect(e, biome.name)}
                                                >
                                                    Select
                                                </button>
                                            )}
                                            {isUnlocked && selectionMode && isCurrentBiome && (
                                                <div className={styles.currentlyEquipped}>
                                                    Currently Selected
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Details */}
            <BlockDetails
                isOpen={selectedBlock !== null}
                onClose={handleCloseBlockDetails}
                blockName={selectedBlock || ''}
            />
        </>
    );
};

export default BiomesModal; 