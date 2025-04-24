'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';

interface InventoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
}

const InventoryModal: React.FC<InventoryModalProps> = ({ isOpen, onClose, gameState }) => {
    const modalClass = isOpen ? `${styles.modal} ${styles.modalShow}` : styles.modal;
    const pickaxeInventory = gameState.pickaxeInventory;
    const currentPickaxeId = pickaxeInventory.currentItem;
    const currentPickaxe = pickaxeInventory.getCurrentItem();

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
                        {pickaxeInventory.items.map((pickaxe) => {
                            const maxHealth = pickaxe.getPickaxe().maxHealth;
                            const healthPercentage = (pickaxe.health / maxHealth) * 100;

                            return (
                                <div
                                    key={pickaxe.id}
                                    className={`${styles.inventorySlot} ${pickaxe.id === currentPickaxeId ? styles.selected : ''}`}
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

                {currentPickaxe && (
                    <div className={styles.inventoryDetails}>
                        <div className={styles.selectedItemDetails}>
                            <h4>{currentPickaxe.type} Pickaxe</h4>
                            <p>Health: {currentPickaxe.health} / {currentPickaxe.getPickaxe().maxHealth}</p>
                            <p>Strength: {currentPickaxe.getPickaxe().strength}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InventoryModal; 