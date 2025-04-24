import React, { useState, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerPickaxe } from '../models/Pickaxe';

interface BiomeProps {
    onBiomeClick: () => void;
    currentPickaxe: PlayerPickaxe | null;
}

const Biome: React.FC<BiomeProps> = ({ onBiomeClick, currentPickaxe }) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);

    const biomeRef = useRef<HTMLDivElement>(null);

    // Track mouse movement for pickaxe cursor
    const handleMouseMove = (e: React.MouseEvent) => {
        if (biomeRef.current) {
            const rect = biomeRef.current.getBoundingClientRect();
            setCursorPosition({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    // Handle click and trigger parent callback
    const handleClick = () => {
        onBiomeClick();
        animatePickaxeSwing();
    };

    // Animate pickaxe swing
    const animatePickaxeSwing = () => {
        setIsSwinging(true);
        setTimeout(() => setIsSwinging(false), 300);
    };

    return (
        <div
            ref={biomeRef}
            className={`${styles.biome}`}
            onMouseMove={handleMouseMove}
            onClick={handleClick}
        >
            {/* Pickaxe cursor */}
            <div
                className={styles.pickaxeCursor}
                style={{ left: `${cursorPosition.x}px`, top: `${cursorPosition.y}px` }}
            >
                <img
                    src={currentPickaxe?.getImageUrl()}
                    alt="Pickaxe cursor"
                    className={isSwinging ? styles.swingAnimation : ''}
                />
            </div>
        </div>
    );
};

export default Biome; 