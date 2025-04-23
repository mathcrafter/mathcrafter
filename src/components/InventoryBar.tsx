import React from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../utils/types';
import { getPickaxeHealth } from '../utils/gameUtils';

interface InventoryBarProps {
    gameState: GameState;
    onPickaxeSelect: (pickaxeType: 'wooden' | 'stone' | 'iron') => void;
}

const InventoryBar: React.FC<InventoryBarProps> = ({ gameState, onPickaxeSelect }) => {
    // Calculate durability percentage for the current pickaxe
    const getDurabilityPercentage = () => {
        const maxHealth = getPickaxeHealth(gameState.currentPickaxe);
        return (gameState.pickaxeHealth / maxHealth) * 100;
    };

    // Get durability class based on health percentage
    const getDurabilityClass = () => {
        const percentage = getDurabilityPercentage();
        if (percentage <= 33) return styles.low;
        if (percentage <= 66) return styles.medium;
        return '';
    };

    return (
        <div className={styles.inventoryRow}>
            {/* Wooden Pickaxe */}
            <div
                className={`${styles.inventorySlot} ${gameState.currentPickaxe === 'wooden' ? styles.selected : ''}`}
                onClick={() => onPickaxeSelect('wooden')}
            >
                <img
                    src="/assets/pickaxe.svg"
                    alt="Wooden Pickaxe"
                    className={styles.inventoryItem}
                />
                {gameState.pickaxes.wooden > 0 && (
                    <div className={styles.itemCount}>{gameState.pickaxes.wooden}</div>
                )}
                <div className={styles.slotNumber}>1</div>
                {gameState.currentPickaxe === 'wooden' && (
                    <div className={styles.durabilityBar}>
                        <div
                            className={`${styles.durabilityFill} ${getDurabilityClass()}`}
                            style={{ width: `${getDurabilityPercentage()}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Stone Pickaxe */}
            <div
                className={`${styles.inventorySlot} ${gameState.currentPickaxe === 'stone' ? styles.selected : ''}`}
                onClick={() => onPickaxeSelect('stone')}
            >
                <img
                    src="/assets/stone-pickaxe.svg"
                    alt="Stone Pickaxe"
                    className={styles.inventoryItem}
                />
                {gameState.pickaxes.stone > 0 && (
                    <div className={styles.itemCount}>{gameState.pickaxes.stone}</div>
                )}
                <div className={styles.slotNumber}>2</div>
                {gameState.currentPickaxe === 'stone' && (
                    <div className={styles.durabilityBar}>
                        <div
                            className={`${styles.durabilityFill} ${getDurabilityClass()}`}
                            style={{ width: `${getDurabilityPercentage()}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Iron Pickaxe */}
            <div
                className={`${styles.inventorySlot} ${gameState.currentPickaxe === 'iron' ? styles.selected : ''}`}
                onClick={() => onPickaxeSelect('iron')}
            >
                <img
                    src="/assets/iron-pickaxe.svg"
                    alt="Iron Pickaxe"
                    className={styles.inventoryItem}
                />
                {gameState.pickaxes.iron > 0 && (
                    <div className={styles.itemCount}>{gameState.pickaxes.iron}</div>
                )}
                <div className={styles.slotNumber}>3</div>
                {gameState.currentPickaxe === 'iron' && (
                    <div className={styles.durabilityBar}>
                        <div
                            className={`${styles.durabilityFill} ${getDurabilityClass()}`}
                            style={{ width: `${getDurabilityPercentage()}%` }}
                        ></div>
                    </div>
                )}
            </div>

            {/* Empty slots to complete the inventory row */}
            {[...Array(6)].map((_, i) => (
                <div key={i} className={styles.inventorySlot}></div>
            ))}
        </div>
    );
};

export default InventoryBar; 