'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import PickaxeButton from './PickaxeButton';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onSelectPickaxe?: (pickaxeId: string) => void;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, gameState, onSelectPickaxe }) => {
    const modalClass = isOpen ? `${styles.modal} ${styles.modalShow}` : styles.modal;
    const pickaxeInventory = gameState.pickaxeInventory;
    const currentPickaxeId = pickaxeInventory.currentItem;
    const currentPickaxe = pickaxeInventory.getCurrentItem();

    // State to track which pickaxe is being previewed (not yet selected)
    const [previewPickaxeId, setPreviewPickaxeId] = useState<string | null>(currentPickaxeId);

    // Get the preview pickaxe object
    const previewPickaxe = previewPickaxeId
        ? pickaxeInventory.items.find(p => p.id === previewPickaxeId)
        : currentPickaxe;

    const handlePickaxePreview = (pickaxeId: string) => {
        console.log("handlePickaxePreview", pickaxeId);
        setPreviewPickaxeId(pickaxeId);
    };

    const handlePickaxeSelect = () => {
        if (previewPickaxeId && onSelectPickaxe) {
            console.log("handlePickaxeSelect", previewPickaxeId);
            onSelectPickaxe(previewPickaxeId);
            onClose(); // Close the modal after selection
        }
    };

    return (
        <div className={modalClass}>
            <div className={`${styles.modalContent} ${styles.shopModalContent}`}>
                <div className={styles.modalHeader}>
                    <h2>Inventory</h2>
                    <button className={styles.closeBtn} onClick={onClose}>&times;</button>
                </div>

                <div className={styles.inventorySection}>
                    <h3>Pickaxes</h3>
                    <div className={styles.pickaxeGrid}>
                        {pickaxeInventory.items.map((pickaxe) => (
                            <PickaxeButton
                                key={pickaxe.id}
                                pickaxe={pickaxe}
                                isSelected={pickaxe.id === previewPickaxeId}
                                onClick={handlePickaxePreview}
                                showTooltip={false}
                            />
                        ))}
                    </div>
                </div>

                {previewPickaxe && (
                    <div className={styles.inventoryDetails}>
                        <div className={styles.selectedItemDetails}>
                            <h4>{previewPickaxe.type} Pickaxe</h4>
                            <p>Health: {previewPickaxe.health} / {previewPickaxe.getPickaxe().maxHealth}</p>
                            <p>Strength: {previewPickaxe.getPickaxe().strength}</p>

                            {previewPickaxeId !== currentPickaxeId && (
                                <button
                                    className={styles.selectButton}
                                    onClick={handlePickaxeSelect}
                                >
                                    Select Pickaxe
                                </button>
                            )}

                            {previewPickaxeId === currentPickaxeId && (
                                <div className={styles.currentlyEquipped}>
                                    Currently Equipped
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryModal; 