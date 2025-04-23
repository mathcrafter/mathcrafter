'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';

interface ShopModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onBuyItem: (item: string, cost: number) => void;
}

const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose, gameState, onBuyItem }) => {
    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalShow : ''}`}>
            <div className={`${styles.modalContent} ${styles.shopModalContent}`}>
                <div className={styles.modalHeader}>
                    <h2>Shop</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>
                <div className={styles.shopItems}>
                    <div className={styles.shopItem}>
                        <img src="/assets/stone-pickaxe.png" alt="Stone Pickaxe" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Stone Pickaxe</div>
                            <div className={styles.itemCost}>
                                5 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 5}
                            onClick={() => onBuyItem('stone-pickaxe', 5)}
                        >
                            Buy
                        </button>
                    </div>

                    <div className={styles.shopItem}>
                        <img src="/assets/iron-pickaxe.png" alt="Iron Pickaxe" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Iron Pickaxe</div>
                            <div className={styles.itemCost}>
                                15 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 15}
                            onClick={() => onBuyItem('iron-pickaxe', 15)}
                        >
                            Buy
                        </button>
                    </div>

                    <div className={styles.shopItem}>
                        <img src="/assets/desert-biome-icon.png" alt="Desert Biome" />
                        <div className={styles.itemInfo}>
                            <div className={styles.itemName}>Desert Biome</div>
                            <div className={styles.itemCost}>
                                10 <img src="/assets/gemstone.png" alt="gems" />
                            </div>
                        </div>
                        <button
                            className={styles.buyBtn}
                            disabled={gameState.gemstones < 10 || gameState.biome === 'desert'}
                            onClick={() => onBuyItem('desert-biome', 10)}
                        >
                            Buy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopModal; 