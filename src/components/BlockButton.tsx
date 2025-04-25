'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { PlayerBlock } from '@/models/Block';

interface BlockButtonProps {
    block: PlayerBlock;
    className?: string;
}

const BlockButton: React.FC<BlockButtonProps> = ({
    block,
    className = ''
}) => {
    return (
        <div
            className={`${styles.inventorySlot} ${className}`}
            title={`${block.name} - Quantity: ${block.quantity}`}
        >
            <img
                src={block.getImageUrl()}
                alt={block.name}
                className={styles.inventoryItem}
            />
            <div className={styles.itemCount}>{block.quantity}</div>
        </div>
    );
};

export default BlockButton; 