'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import PickaxeButton from './PickaxeButton';
import BlockButton from './BlockButton';

interface QuickInventoryProps {
    gameState: GameState;
    onSelectPickaxe: (pickaxeId: string) => void;
}

const QuickInventory: React.FC<QuickInventoryProps> = ({ gameState, onSelectPickaxe }) => {
    const pickaxeInventory = gameState.pickaxeInventory;
    const blockInventory = gameState.blockInventory;
    const currentPickaxeId = pickaxeInventory.currentItem;

    // Total number of inventory slots per row
    const totalSlots = 8;

    const handlePickaxeSelect = (pickaxeId: string) => {
        if (onSelectPickaxe && pickaxeId) {
            onSelectPickaxe(pickaxeId);
        }
    };

    // Create array of 8 slots for pickaxes
    const pickaxeSlots = Array(totalSlots).fill(null);
    // Fill available slots with pickaxes
    pickaxeInventory.items.forEach((pickaxe, index) => {
        if (index < totalSlots) {
            pickaxeSlots[index] = pickaxe;
        }
    });

    // Create array of 8 slots for blocks
    const blockSlots = Array(totalSlots).fill(null);
    // Fill available slots with blocks (up to 8)
    blockInventory.items.slice(0, totalSlots).forEach((block, index) => {
        if (index < totalSlots) {
            blockSlots[index] = block;
        }
    });

    return (
        <div className={styles.quickInventoryContainer}>
            {/* Pickaxe row */}
            <div className={styles.quickInventorySection}>
                <div className={styles.quickInventoryLabel}>Pickaxes</div>
                <div className={styles.quickInventory}>
                    {pickaxeSlots.map((pickaxe, index) => {
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
                                    key={`pickaxe-empty-${index}`}
                                    className={styles.inventorySlot}
                                >
                                    {/* Empty slot */}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>

            {/* Blocks row */}
            <div className={styles.quickInventorySection}>
                <div className={styles.quickInventoryLabel}>Blocks</div>
                <div className={styles.quickInventory}>
                    {blockSlots.map((block, index) => {
                        if (block) {
                            return (
                                <BlockButton
                                    key={`block-${block.name}-${index}`}
                                    block={block}
                                />
                            );
                        } else {
                            // Empty slot
                            return (
                                <div
                                    key={`block-empty-${index}`}
                                    className={styles.inventorySlot}
                                >
                                    {/* Empty slot */}
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        </div>
    );
};

export default QuickInventory; 