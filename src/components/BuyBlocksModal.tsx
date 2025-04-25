import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { PlayerBlock } from '@/models/Block';

interface BuyBlocksModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onBuyBlock: (blockName: string) => void;
}

const BuyBlocksModal: React.FC<BuyBlocksModalProps> = ({ isOpen, onClose, gameState, onBuyBlock }) => {
    if (!isOpen) return null;

    const currentBiome = gameState.currentBiome.getBiome();
    const availableBlocks = currentBiome.availableBlocks || [];
    const hasEnoughPicks = gameState.picks >= 100;

    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalShow : ''}`}>
            <div className={`${styles.modalContent} ${styles.shopModalContent}`}>
                <div className={styles.modalHeader}>
                    <h2>Blocks</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.modalInfo}>
                    <p>Buy blocks from {currentBiome.name} biome. Each block costs 100 picks.</p>
                    <p>Your picks: {gameState.picks}</p>
                </div>

                {availableBlocks.length === 0 ? (
                    <p>No blocks available in this biome.</p>
                ) : (
                    <div className={styles.pickaxesItems}>
                        {availableBlocks.map((blockName) => {
                            const tempBlock = new PlayerBlock({ name: blockName, quantity: 1 });
                            const blockImageUrl = tempBlock.getImageUrl();

                            return (
                                <div key={blockName} className={styles.pickaxesItem}>
                                    <img
                                        src={blockImageUrl}
                                        alt={blockName}
                                        className={styles.shopItemImg}
                                    />
                                    <div className={styles.itemName}>{blockName}</div>
                                    <div className={styles.itemCost}>
                                        <span>100</span>
                                        <img src="/assets/picks.png" alt="picks" />
                                    </div>
                                    <button
                                        className={styles.buyBtn}
                                        onClick={() => onBuyBlock(blockName)}
                                        disabled={!hasEnoughPicks}
                                    >
                                        Buy
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BuyBlocksModal; 