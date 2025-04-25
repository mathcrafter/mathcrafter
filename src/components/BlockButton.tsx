'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerBlock } from '@/models/Block';

interface BlockButtonProps {
    block: PlayerBlock;
    className?: string;
    showTooltip?: boolean;
}

const BlockButton: React.FC<BlockButtonProps> = ({
    block,
    className = '',
    showTooltip = true
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const blockDef = block.getBlock();

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`${styles.inventorySlot} ${className}`}
            title={`${block.name} - Quantity: ${block.quantity}`}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <img
                src={block.getImageUrl()}
                alt={block.name}
                className={styles.inventoryItem}
            />
            <div className={styles.itemCount}>{block.quantity}</div>

            {showTooltip && isHovered && (
                <div className={styles.quickItemTooltip}>
                    <div className={styles.quickItemName}>
                        {block.name.charAt(0).toUpperCase() + block.name.slice(1)}
                    </div>
                    <div className={styles.quickItemStats}>
                        <div>Quantity: {block.quantity}</div>
                        <div>Rarity: {blockDef.rarity}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BlockButton; 