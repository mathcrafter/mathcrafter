'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import PickaxeButton from './PickaxeButton';
import BlockButton from './BlockButton';

interface QuickInventoryProps {
    gameState: GameState;
    onSelectPickaxe: (pickaxeId: string) => void;
    onBlockClick?: (blockName: string) => void;
}

interface InventoryRowProps<T> {
    items: T[];
    totalSlots: number;
    itemType: 'pickaxe' | 'block';
    renderItem: (item: T, rowIndex: number, slotIndex: number) => React.ReactNode;
    renderEmptySlot: (rowIndex: number, slotIndex: number) => React.ReactNode;
}

function InventoryRows<T>({ items, totalSlots, itemType, renderItem, renderEmptySlot }: InventoryRowProps<T>) {
    const rows = [];
    const totalItems = items.length;
    const rowCount = Math.max(1, Math.ceil(totalItems / totalSlots));

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
        const rowSlots = Array(totalSlots).fill(null);

        // Fill this row with items
        for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
            const itemIndex = rowIndex * totalSlots + slotIndex;
            if (itemIndex < totalItems) {
                rowSlots[slotIndex] = items[itemIndex];
            }
        }

        rows.push(
            <div className={styles.quickInventory} key={`${itemType}-row-${rowIndex}`}>
                {rowSlots.map((item, slotIndex) => {
                    if (item) {
                        return renderItem(item, rowIndex, slotIndex);
                    } else {
                        return renderEmptySlot(rowIndex, slotIndex);
                    }
                })}
            </div>
        );
    }

    return <>{rows}</>;
}

const QuickInventory: React.FC<QuickInventoryProps> = ({ gameState, onSelectPickaxe, onBlockClick }) => {
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

    const handleBlockClick = (blockName: string) => {
        if (onBlockClick && blockName) {
            onBlockClick(blockName);
        }
    };

    return (
        <div className={styles.quickInventoryContainer}>
            {/* Pickaxe section */}
            <div className={styles.quickInventorySection}>
                <div className={styles.quickInventoryLabel}>Pickaxes</div>
                <InventoryRows
                    items={pickaxeInventory.items}
                    totalSlots={totalSlots}
                    itemType="pickaxe"
                    renderItem={(pickaxe, rowIndex, slotIndex) => (
                        <PickaxeButton
                            key={pickaxe.id}
                            pickaxe={pickaxe}
                            isSelected={pickaxe.id === currentPickaxeId}
                            onClick={handlePickaxeSelect}
                        />
                    )}
                    renderEmptySlot={(rowIndex, slotIndex) => (
                        <div
                            key={`pickaxe-empty-${rowIndex}-${slotIndex}`}
                            className={styles.inventorySlot}
                        >
                            {/* Empty slot */}
                        </div>
                    )}
                />
            </div>

            {/* Blocks section */}
            <div className={styles.quickInventorySection}>
                <div className={styles.quickInventoryLabel}>Blocks</div>
                <InventoryRows
                    items={blockInventory.items}
                    totalSlots={totalSlots}
                    itemType="block"
                    renderItem={(block, rowIndex, slotIndex) => (
                        <BlockButton
                            key={`block-${block.name}-${rowIndex}-${slotIndex}`}
                            block={block}
                            onClick={() => handleBlockClick(block.name)}
                        />
                    )}
                    renderEmptySlot={(rowIndex, slotIndex) => (
                        <div
                            key={`block-empty-${rowIndex}-${slotIndex}`}
                            className={styles.inventorySlot}
                        >
                            {/* Empty slot */}
                        </div>
                    )}
                />
            </div>
        </div>
    );
};

export default QuickInventory; 