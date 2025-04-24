'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import PickaxeButton from './PickaxeButton';

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
                        return (
                            <PickaxeButton
                                key={pickaxe.id}
                                pickaxe={pickaxe}
                                isSelected={pickaxe.id === currentPickaxeId}
                                onClick={handlePickaxeSelect}
                            />
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