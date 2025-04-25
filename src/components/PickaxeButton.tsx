'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerPickaxe } from '@/models/Pickaxe';

interface PickaxeButtonProps {
    pickaxe: PlayerPickaxe;
    isSelected: boolean;
    onClick: (pickaxeId: string) => void;
    className?: string;
    showTooltip?: boolean;
}

const PickaxeButton: React.FC<PickaxeButtonProps> = ({
    pickaxe,
    isSelected,
    onClick,
    className = '',
    showTooltip = true
}) => {
    const [isHovered, setIsHovered] = useState(false);
    const maxHealth = pickaxe.getPickaxe().maxHealth;
    const healthPercentage = (pickaxe.health / maxHealth) * 100;
    const pickaxeDef = pickaxe.getPickaxe();

    // Calculate color based on health percentage - gradient from red to yellow to green
    const getHealthColor = (percent: number) => {
        // Red: rgb(255, 59, 59) for 0%
        // Yellow: rgb(255, 217, 0) for 50% 
        // Green: rgb(114, 203, 59) for 100%
        if (percent <= 50) {
            // Gradient from red to yellow (0-50%)
            const r = 255;
            const g = Math.round(59 + (217 - 59) * (percent / 50));
            const b = Math.round(59 + (0 - 59) * (percent / 50));
            return `rgb(${r}, ${g}, ${b})`;
        } else {
            // Gradient from yellow to green (50-100%)
            const r = Math.round(255 - (255 - 114) * ((percent - 50) / 50));
            const g = Math.round(217 - (217 - 203) * ((percent - 50) / 50));
            const b = Math.round(0 + (59 - 0) * ((percent - 50) / 50));
            return `rgb(${r}, ${g}, ${b})`;
        }
    };

    const healthColor = getHealthColor(healthPercentage);

    const handleClick = () => {
        onClick(pickaxe.id);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    return (
        <div
            className={`${styles.inventorySlot} ${isSelected ? styles.selected : ''} ${className}`}
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            title={`${pickaxe.type} Pickaxe - Health: ${pickaxe.health}/${maxHealth}`}
        >
            <img
                src={pickaxe.getImageUrl()}
                alt={pickaxe.type}
                className={styles.inventoryItem}
            />
            <div className={styles.durabilityBar}>
                <div
                    className={styles.durabilityFill}
                    style={{
                        width: `${healthPercentage}%`,
                        backgroundColor: healthColor
                    }}
                ></div>
            </div>

            {showTooltip && isHovered && (
                <div className={styles.quickItemTooltip}>
                    <div className={styles.quickItemName}>
                        {pickaxe.type.charAt(0).toUpperCase() + pickaxe.type.slice(1)} Pickaxe
                    </div>
                    <div className={styles.quickItemStats}>
                        <div>Health: {pickaxe.health}/{maxHealth}</div>
                        <div>Strength: {pickaxeDef.strength}</div>
                        <div>Critical: {pickaxeDef.critical * 100}%</div>
                        <div>Power: {pickaxeDef.power}</div>
                        <div>Rarity: {pickaxeDef.rarity}</div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PickaxeButton; 