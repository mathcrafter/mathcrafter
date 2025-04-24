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

    // Total number of inventory slots
    const totalSlots = 8;

    const handlePickaxeSelect = (pickaxeId: string) => {
        if (onSelectPickaxe && pickaxeId) {
            onSelectPickaxe(pickaxeId);
        }
    };

    // Create array of 8 slots
    const slots = Array(totalSlots).fill(null);
    // Fill available slots with pickaxes
    pickaxeInventory.items.forEach((pickaxe, index) => {
        if (index < totalSlots) {
            slots[index] = pickaxe;
        }
    });

    return (
        <div className={styles.quickInventoryContainer}>
            <div className={styles.quickInventory}>
                {slots.map((pickaxe, index) => {
                    if (pickaxe) {
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
                    } else {
                        // Empty slot
                        return (
                            <div
                                key={`empty-${index}`}
                                className={styles.inventorySlot}
                            >
                                {/* Empty slot */}
                            </div>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default QuickInventory; 