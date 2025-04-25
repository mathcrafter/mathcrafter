'use client';

import React, { useState } from 'react';
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
        return 'Buy';
    };

    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalShow : ''}`}>
            <div className={`${styles.modalContent} ${styles.pickaxesModalContent}`}>
                <div className={styles.modalHeader}>
                    <h2>Pickaxes</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className={styles.pickaxesItems}>
                    {pickaxeStore.items.map((pickaxe) => (
                        <div
                            key={pickaxe.name}
                            className={styles.pickaxesItem}
                            onMouseEnter={() => setHoveredPickaxe(pickaxe.name)}
                            onMouseLeave={() => setHoveredPickaxe(null)}
                        >
                            <img
                                src={`/assets/pickaxes/${pickaxe.name.toLowerCase()}.webp`}
                                alt={`${pickaxe.name} Pickaxe`}
                                className={styles.shopItemImg}
                            />

                            {hoveredPickaxe === pickaxe.name && (
                                <div className={styles.itemTooltip}>
                                    <div className={styles.itemName}>{pickaxe.name.charAt(0).toUpperCase() + pickaxe.name.slice(1)} Pickaxe</div>
                                    <div className={styles.itemStats}>
                                        <div>Strength: {pickaxe.strength}</div>
                                        <div>Durability: {pickaxe.maxHealth}</div>
                                        <div>Crit: {pickaxe.critical * 100}%</div>
                                    </div>
                                    <div className={styles.itemCost}>
                                        <span>{pickaxe.cost.amount}</span>
                                        <span> {pickaxe.cost.itemType}</span>
                                        <div className={canBuyPickaxe(pickaxe.cost.itemType, pickaxe.cost.amount) ? styles.affordableCost : styles.unaffordableCost}>
                                            (You have: {gameState.blockInventory.getBlockQuantity(pickaxe.cost.itemType)})
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                className={styles.buyBtn}
                                onClick={() => onBuyItem(pickaxe.name, 0)}
                                disabled={!canBuyPickaxe(pickaxe.cost.itemType, pickaxe.cost.amount)}
                            >
                                {getBuyButtonText(pickaxe)}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopPickaxesModal; 