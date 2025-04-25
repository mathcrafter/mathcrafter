'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { pickaxeStore } from '@/stores/PickaxeStore';

interface ShopPickaxesModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onBuyItem: (item: string, cost: number) => void;
}

const ShopPickaxesModal: React.FC<ShopPickaxesModalProps> = ({ isOpen, onClose, gameState, onBuyItem }) => {
    const [hoveredPickaxe, setHoveredPickaxe] = useState<string | null>(null);

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
                                        <span>{pickaxe.cost.itemType}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                className={styles.buyBtn}
                                onClick={() => onBuyItem(pickaxe.name, pickaxe.cost.amount)}
                                disabled={gameState.picks < pickaxe.cost.amount}
                            >
                                {gameState.picks < pickaxe.cost.amount ? 'Not enough' : 'Buy'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ShopPickaxesModal; 