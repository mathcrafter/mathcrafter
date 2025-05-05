import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerPickaxe } from '../models/Pickaxe';
import { getAssetPath } from '@/utils/assetPath';

interface BiomeProps {
    onBiomeClick: () => void;
    currentPickaxe: PlayerPickaxe | null;
    currentBiome: any;
    picksToShow?: number | null;
    minedBlock?: { name: string; imageUrl: string } | null;
}

const Biome: React.FC<BiomeProps> = ({ onBiomeClick, currentPickaxe, currentBiome, picksToShow, minedBlock }) => {
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [isSwinging, setIsSwinging] = useState<boolean>(false);
    const [lastHealth, setLastHealth] = useState<number>(currentBiome?.currentHealth || 0);
    const [pickaxeImageUrl, setPickaxeImageUrl] = useState<string>(getAssetPath('/assets/pickaxes/wood.webp'));
    const [showPicks, setShowPicks] = useState<boolean>(false);
    const [picksValue, setPicksValue] = useState<number | null>(null);
    const [showBlock, setShowBlock] = useState<boolean>(false);
    const [blockData, setBlockData] = useState<{ name: string; imageUrl: string } | null>(null);
    const [fallingBlocks, setFallingBlocks] = useState<Array<{ id: string, x: number, y: number, size: number, rotation: number, imageUrl: string, fallX: number, fallY: number, delay: number, fallDuration: number }>>([]);

    const biomeRef = useRef<HTMLDivElement>(null);

    // Update pickaxe image URL when currentPickaxe changes
    useEffect(() => {
        if (currentPickaxe) {
            setPickaxeImageUrl(currentPickaxe.getImageUrl());
        }
    }, [currentPickaxe]);

    // Handle score display
    useEffect(() => {
        if (picksToShow) {
            setPicksValue(picksToShow);
            setShowPicks(true);

            // Hide score after animation completes
            const timer = setTimeout(() => {
                setShowPicks(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [picksToShow]);

    // Handle mined block display
    useEffect(() => {
        if (minedBlock) {
            setBlockData(minedBlock);
            setShowBlock(true);

            // Create falling blocks effect
            createFallingBlocks(minedBlock.imageUrl);

            // Hide block after animation completes
            const timer = setTimeout(() => {
                setShowBlock(false);
            }, 1500);

            return () => clearTimeout(timer);
        }
    }, [minedBlock]);

    // Create falling blocks effect
    const createFallingBlocks = (imageUrl: string) => {
        if (!biomeRef.current) return;

        const biomeRect = biomeRef.current.getBoundingClientRect();
        const biomeWidth = biomeRect.width;
        const biomeHeight = biomeRect.height;

        // Use cursor position as center point for falling blocks (default to center if not available)
        const centerX = cursorPosition.x || biomeWidth / 2;
        const centerY = cursorPosition.y || biomeHeight / 2;

        // Create 10-15 falling blocks
        const numBlocks = Math.floor(Math.random() * 5) + 10;
        const newBlocks = [];

        // Create a row of blocks that will "drop" from the mining position
        // Simulate a chunk of the biome breaking off and falling down
        for (let i = 0; i < numBlocks; i++) {
            // Position blocks in a loose grid around click position
            const gridSize = 40; // Size of the grid cells
            const gridX = Math.floor(i / 3); // 3 blocks per row
            const gridY = i % 3;

            // Add some randomness to the grid positions
            const randomOffset = 10;
            const x = centerX + ((gridX - 1.5) * gridSize) + (Math.random() * randomOffset - randomOffset / 2);
            const y = centerY + ((gridY - 1) * gridSize / 2) + (Math.random() * randomOffset - randomOffset / 2);

            const size = Math.random() * 20 + 20; // Size between 20-40px
            const rotation = 0; // No rotation initially

            // Pure vertical drop with no horizontal movement
            const fallX = 0; // No horizontal movement
            const fallY = biomeHeight - y + 100; // Fall straight down past the biome

            // Vary fall speed slightly based on block size (smaller blocks fall slower)
            const fallDuration = 0.7 + (Math.random() * 0.3); // 0.7-1.0s

            // Small random delay to stagger the falling
            const delay = Math.random() * 0.2; // 0-0.2s delay

            newBlocks.push({
                id: `block-${Date.now()}-${i}`,
                x,
                y,
                size,
                rotation,
                fallX,
                fallY,
                delay,
                fallDuration,
                imageUrl
            });
        }

        setFallingBlocks(newBlocks);

        // Clear falling blocks after animation duration
        setTimeout(() => {
            setFallingBlocks([]);
        }, 2000);
    };

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
                {/* Score flash display */}
                {showPicks && picksValue && (
                    <div className={styles.scoreFlash}>
                        +{picksValue}
                    </div>
                )}

                {/* Mined block display */}
                {showBlock && blockData && (
                    <div
                        className={styles.minedBlock}
                        style={{
                            top: '50%',
                            left: '50%',
                            backgroundImage: `url(${blockData.imageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
                    />
                )}

                {/* Falling blocks animation */}
                {fallingBlocks.map((block) => (
                    <div
                        key={block.id}
                        className={styles.fallingBlock}
                        style={{
                            left: `${block.x}px`,
                            top: `${block.y}px`,
                            width: `${block.size}px`,
                            height: `${block.size}px`,
                            backgroundImage: `url(${block.imageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center',
                            transform: `rotate(${block.rotation}deg)`,
                            '--rotation': `${block.rotation}deg`,
                            '--fall-x': `${block.fallX}px`,
                            '--fall-y': `${block.fallY}px`,
                            '--delay': `${block.delay}s`,
                            '--duration': `${block.fallDuration}s`
                        } as React.CSSProperties}
                    />
                ))}

                {/* Crack overlay that appears based on damage */}
                {healthPercentage < 100 && (
                    <>
                        {/* Main crack overlay */}
                        <div
                            className={styles.crackOverlay}
                            style={{
                                opacity: Math.max(0.2, 1 - (healthPercentage / 100)), // Minimum opacity of 0.2
                                backgroundImage: `url(${getAssetPath('/assets/crack_overlay.png')})`,
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
                                    backgroundImage: `url(${getAssetPath('/assets/crack_overlay.png')})`,
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
                                    backgroundImage: `url(${getAssetPath('/assets/crack_overlay.png')})`,
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
                        src={pickaxeImageUrl}
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