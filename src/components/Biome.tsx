import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerPickaxe } from '../models/Pickaxe';
import { PlayerBiome } from '../models/Biome';

interface BiomeProps {
    onBiomeClick: () => void;
    currentPickaxe: PlayerPickaxe | null;
    currentBiome: any;
}

const Biome: React.FC<BiomeProps> = ({ onBiomeClick, currentPickaxe, currentBiome }) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);
    const [lastHealth, setLastHealth] = useState<number>(currentBiome?.currentHealth || 0);

    const biomeRef = useRef<HTMLDivElement>(null);

    // Track health changes to add shaking effect
    useEffect(() => {
        const currentHealth = currentBiome?.currentHealth || 0;
        if (currentHealth < lastHealth && biomeRef.current) {
            // Add shaking effect
            const biomeElement = biomeRef.current;
            biomeElement.classList.add(styles.shake);

            // Remove shaking class after animation completes
            setTimeout(() => {
                biomeElement.classList.remove(styles.shake);
            }, 500);
        }
        setLastHealth(currentHealth);
    }, [currentBiome?.currentHealth, lastHealth]);

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

    // Calculate health percentage for display
    const healthPercentage = currentBiome?.damagePercent || 100;

    // Determine health color based on percentage
    const getHealthColor = () => {
        if (healthPercentage > 60) return '#72CB3B'; // Green
        if (healthPercentage > 30) return '#FFCC00'; // Yellow
        return '#FF6B6B'; // Red
    };

    return (
        <div className={styles.biomeContainer}>
            <div
                ref={biomeRef}
                className={`${styles.biome}`}
                onMouseMove={handleMouseMove}
                onClick={handleClick}
                style={{
                    backgroundImage: `url(${currentBiome?.getImageUrl()})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
            >
                {/* Crack overlay that appears based on damage */}
                {healthPercentage < 100 && (
                    <>
                        {/* Main crack overlay */}
                        <div
                            className={styles.crackOverlay}
                            style={{
                                opacity: Math.max(0.2, 1 - (healthPercentage / 100)), // Minimum opacity of 0.2
                                backgroundImage: currentBiome?.type === 'desert'
                                    ? 'url(/assets/desert_crack_overlay.png)'
                                    : 'url(/assets/crack_overlay.png)',
                                transform: `scale(${1 + (1 - healthPercentage / 100)})`, // Scale up as health decreases
                                filter: `contrast(${100 + (100 - healthPercentage)}%) brightness(${100 + (100 - healthPercentage) / 2}%)` // Increase contrast as health decreases
                            }}
                        />

                        {/* Secondary cracks for severe damage (below 50% health) */}
                        {healthPercentage < 50 && (
                            <div
                                className={`${styles.crackOverlay} ${styles.secondaryCracks}`}
                                style={{
                                    opacity: Math.max(0.1, 0.8 - (healthPercentage / 50)), // More visible as health drops below 50%
                                    backgroundImage: currentBiome?.type === 'desert'
                                        ? 'url(/assets/desert_crack_overlay.png)'
                                        : 'url(/assets/crack_overlay.png)',
                                    transform: `scale(${0.7 + (1 - healthPercentage / 50)}) rotate(45deg)` // Different scale and rotation
                                }}
                            />
                        )}

                        {/* Tertiary cracks for critical damage (below 25% health) */}
                        {healthPercentage < 25 && (
                            <div
                                className={`${styles.crackOverlay} ${styles.criticalCracks}`}
                                style={{
                                    opacity: Math.max(0.15, 0.9 - (healthPercentage / 25)),
                                    backgroundImage: currentBiome?.type === 'desert'
                                        ? 'url(/assets/desert_crack_overlay.png)'
                                        : 'url(/assets/crack_overlay.png)',
                                    transform: `scale(${0.9 + (1 - healthPercentage / 25)}) rotate(-30deg)`
                                }}
                            />
                        )}
                    </>
                )}

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

            {/* Horizontal health bar at bottom */}
            <div className={styles.horizontalHealthContainer}>
                <div
                    className={styles.horizontalHealthBar}
                    style={{
                        width: `${healthPercentage}%`,
                        backgroundColor: getHealthColor()
                    }}
                />
                <div className={styles.horizontalHealthText}>{Math.ceil(healthPercentage)}%</div>
            </div>
        </div>
    );
};

export default Biome; 