'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';

interface QuickInventoryProps {
    gameState: GameState;
    onSelectPickaxe: (pickaxeId: string) => void;
}

const QuickInventory: React.FC<QuickInventoryProps> = ({ gameState, onSelectPickaxe }) => {
    const pickaxeInventory = gameState.pickaxeInventory;
    const currentPickaxeId = pickaxeInventory.currentItem;

    const handlePickaxeSelect = (pickaxeId: string) => {
        if (onSelectPickaxe) {
            onSelectPickaxe(pickaxeId);
        }
    };

    return (
        <div className={styles.quickInventoryContainer}>
            <div className={styles.quickInventory}>
                {pickaxeInventory.items.map((pickaxe) => {
                    const maxHealth = pickaxe.getPickaxe().maxHealth;
                    const healthPercentage = (pickaxe.health / maxHealth) * 100;

                    return (
                        <div
                            key={pickaxe.id}
                            className={`${styles.inventorySlot} ${pickaxe.id === currentPickaxeId ? styles.selected : ''}`}
                            onClick={() => handlePickaxeSelect(pickaxe.id)}
                            title={`${pickaxe.type} Pickaxe - Health: ${pickaxe.health}/${maxHealth}`}
                        >
                            <img
                                src={pickaxe.getImageUrl()}
                                alt={pickaxe.type}
                                className={styles.inventoryItem}
                            />
                            <div className={styles.durabilityBar}>
                                <div
                                    className={`${styles.durabilityFill} ${pickaxe.health < 30 ? styles.low :
                                            pickaxe.health < 70 ? styles.medium : ''
                                        }`}
                                    style={{ width: `${healthPercentage}%` }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default QuickInventory; 