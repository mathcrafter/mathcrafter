'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { pickaxeStore } from '@/stores/PickaxeStore';

interface ShopPickaxesModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    // The cost parameter is maintained for API compatibility but the actual cost
    // will be calculated from the pickaxe's cost property in the handler
    onBuyItem: (itemType: string, cost: number) => void;
}

const ShopPickaxesModal: React.FC<ShopPickaxesModalProps> = ({ isOpen, onClose, gameState, onBuyItem }) => {
    const [hoveredPickaxe, setHoveredPickaxe] = useState<string | null>(null);
    const drawerContentRef = useRef<HTMLDivElement>(null);
    const pickaxes = pickaxeStore.items;

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
                </div>

                <div ref={drawerContentRef} className={styles.biomesDrawerContent} data-drawer-type="pickaxes">
                    <div className={styles.biomesSection}>
                        <div className={styles.pickaxesGrid}>
                            {pickaxeStore.items.map((pickaxe) => {
                                const canBuy = canBuyPickaxe(pickaxe.cost.itemType, pickaxe.cost.amount);
                                return (
                                    <div
                                        key={pickaxe.name}
                                        className={styles.pickaxeItem}
                                    >
                                        <div className={styles.pickaxeImageContainer}>
                                            <img
                                                src={`/assets/pickaxes/${pickaxe.name.toLowerCase()}.png`}
                                                alt={`${pickaxe.name} Pickaxe`}
                                                className={styles.pickaxeItemImg}
                                            />
                                        </div>
                                        <div className={styles.pickaxeItemContent}>
                                            <div className={styles.pickaxeInfo}>
                                                <div className={styles.itemName}>
                                                    {pickaxe.name.charAt(0).toUpperCase() + pickaxe.name.slice(1)} Pickaxe
                                                </div>
                                                <div className={styles.itemDescription}>
                                                    Strength: {pickaxe.strength} | Durability: {pickaxe.maxHealth} | Crit: {pickaxe.critical * 100}%
                                                </div>
                                                <div className={styles.unlockCost}>
                                                    Cost: <span className={canBuy ? styles.affordableCost : styles.unaffordableCost}>
                                                        {pickaxe.cost.amount} {pickaxe.cost.itemType}
                                                    </span>
                                                    <div>
                                                        (You have: {gameState.blockInventory.getBlockQuantity(pickaxe.cost.itemType)})
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className={`${styles.buyPickaxeButton} ${!canBuy ? styles.buyPickaxeButtonDisabled : ''}`}
                                                onClick={() => onBuyItem(pickaxe.name, 0)}
                                                disabled={!canBuy}
                                            >
                                                {getBuyButtonText(pickaxe)}
                                            </button>
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

export default ShopPickaxesModal; 