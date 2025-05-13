'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { pickaxeStore } from '@/stores/PickaxeStore';
import { getAssetPath } from '@/utils/assetPath';
import BlockDetails from './BlockDetails';

// Function to get rarity color
const getRarityColor = (rarity: string): string => {
    switch (rarity) {
        case 'Common': return '#aaaaaa';
        case 'Uncommon': return '#55ff55';
        case 'Rare': return '#5555ff';
        case 'Epic': return '#aa00aa';
        case 'Seasonal': return '#ff5555';
        case 'Legendary': return '#ffaa00';
        default: return '#aaaaaa';
    }
};

// Function to get block image URL
const getBlockImageUrl = (blockName: string): string => {
    return getAssetPath(`/assets/blocks/${blockName}.png`);
};

interface ShopPickaxesModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    // The cost parameter is maintained for API compatibility but the actual cost
    // will be calculated from the pickaxe's cost property in the handler
    onBuyItem: (itemType: string, cost: number) => void;
}

const ShopPickaxesModal: React.FC<ShopPickaxesModalProps> = ({ isOpen, onClose, gameState, onBuyItem }) => {
    const [showBiomePickaxesOnly, setShowBiomePickaxesOnly] = useState<boolean>(true);
    const [selectedBlock, setSelectedBlock] = useState<string | null>(null);
    const drawerContentRef = useRef<HTMLDivElement>(null);

    // Get all pickaxes
    const allPickaxes = pickaxeStore.items;

    // Filter pickaxes based on toggle state
    const pickaxes = showBiomePickaxesOnly
        ? allPickaxes.filter(pickaxe =>
            gameState.currentBiome.getBiome().availablePickaxes.includes(pickaxe.name.toLowerCase()))
        : allPickaxes;

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
    }, [isOpen, pickaxes]);

    // Function to check if user has enough blocks to buy a pickaxe
    const canBuyPickaxe = (itemType: string, amount: number): boolean => {
        return gameState.blockInventory.hasBlock(itemType, amount);
    };

    // Function to generate button text based on availability
    const getBuyButtonText = (pickaxe: any): string => {
        const { itemType, amount } = pickaxe.cost;
        const availableBlocks = gameState.blockInventory.getBlockQuantity(itemType);

        if (availableBlocks < amount) {
            return `Need ${amount - availableBlocks} more ${itemType}`;
        }
        return `Buy (${amount} ${itemType})`;
    };

    // Toggle handler
    const handleToggleChange = () => {
        setShowBiomePickaxesOnly(prev => !prev);
    };

    // Block click handler
    const handleBlockClick = (blockName: string) => {
        setSelectedBlock(blockName);
    };

    // Close block details handler
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
                    <h2>Shop Pickaxes</h2>
                    <div className={styles.toggleContainer}>
                        <label className={styles.toggleSwitch}>
                            <input
                                type="checkbox"
                                checked={showBiomePickaxesOnly}
                                onChange={handleToggleChange}
                            />
                            <span className={styles.toggleSlider}></span>
                        </label>
                        <span className={styles.toggleLabel}>
                            {showBiomePickaxesOnly ? 'Showing biome pickaxes only' : 'Showing all pickaxes'}
                        </span>
                    </div>
                </div>

                <div ref={drawerContentRef} className={styles.biomesDrawerContent} data-drawer-type="pickaxes">
                    <div className={styles.biomesSection}>
                        <div className={styles.pickaxesGrid}>
                            {pickaxes.map((pickaxe) => {
                                const canBuy = canBuyPickaxe(pickaxe.cost.itemType, pickaxe.cost.amount);
                                const rarityColor = getRarityColor(pickaxe.rarity);
                                const blockImageUrl = getBlockImageUrl(pickaxe.cost.itemType);
                                const pickaxeName = pickaxe.name.charAt(0).toUpperCase() + pickaxe.name.slice(1);

                                return (
                                    <div
                                        key={pickaxe.name}
                                        className={styles.pickaxeCard}
                                    >
                                        <div className={styles.pickaxeCardImageContainer}>
                                            <img
                                                src={`${getAssetPath(`/assets/pickaxes/${pickaxe.name.toLowerCase()}.png`)}`}
                                                alt={`${pickaxe.name} Pickaxe`}
                                                className={styles.pickaxeCardImg}
                                            />
                                        </div>
                                        <div className={styles.pickaxeCardInfo}>
                                            <div className={styles.pickaxeCardName}>{pickaxeName}</div>
                                            <div className={styles.pickaxeCardRarity} style={{ color: rarityColor }}>{pickaxe.rarity}</div>
                                        </div>
                                        <button
                                            className={`${styles.buyPickaxeButton} ${!canBuy ? styles.buyPickaxeButtonDisabled : ''}`}
                                            onClick={() => onBuyItem(pickaxe.name, 0)}
                                            disabled={!canBuy}
                                        >
                                            {getBuyButtonText(pickaxe)}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Block Details Modal */}
            <BlockDetails
                isOpen={selectedBlock !== null}
                onClose={handleCloseBlockDetails}
                blockName={selectedBlock || ''}
            />
        </>
    );
};

export default ShopPickaxesModal; 