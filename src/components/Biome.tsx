import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { PlayerPickaxe } from '../models/Pickaxe';
import { getAssetPath } from '@/utils/assetPath';
import blockSoundPlayer from '@/utils/BlockSoundPlayer';

interface BiomeProps {
    onBiomeClick: () => void;
    currentPickaxe: PlayerPickaxe | null;
    currentBiome: any;
    picksToShow?: number | null;
    minedBlock?: { name: string; imageUrl: string } | null;
}

// Interface for falling block
interface FallingBlock {
    id: string;
    name: string;
    imageUrl: string;
    x: number;
    y: number;
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
    const [fallingBlocks, setFallingBlocks] = useState<FallingBlock[]>([]);

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

    // Generate a random number between min and max
    const getRandomNumber = (min: number, max: number): number => {
        return Math.random() * (max - min) + min;
    };

    // Generate a unique ID
    const generateId = (): string => {
        return Math.random().toString(36).substring(2, 9);
    };

    // Handle mined block display with multiple falling blocks
    useEffect(() => {
        if (minedBlock) {
            // Store original block data for notification
            setBlockData(minedBlock);
            setShowBlock(true);

            // Create 3-6 falling blocks with random positions
            const numberOfBlocks = Math.floor(getRandomNumber(3, 7));
            const newFallingBlocks: FallingBlock[] = [];

            if (biomeRef.current) {
                const biomeWidth = biomeRef.current.offsetWidth;
                const biomeHeight = biomeRef.current.offsetHeight;

                // Generate falling blocks
                for (let i = 0; i < numberOfBlocks; i++) {
                    newFallingBlocks.push({
                        id: generateId(),
                        name: minedBlock.name,
                        imageUrl: minedBlock.imageUrl,
                        x: getRandomNumber(biomeWidth * 0.3, biomeWidth * 0.7),
                        y: getRandomNumber(biomeHeight * 0.3, biomeHeight * 0.7)
                    });
                }

                setFallingBlocks(prevBlocks => [...prevBlocks, ...newFallingBlocks]);

                // Play falling block sound effects
                try {
                    // Initialize on first use (needs to be triggered by user interaction)
                    blockSoundPlayer.initialize();
                    blockSoundPlayer.resumeAudioContext();

                    // Play sound based on block type
                    blockSoundPlayer.playMultipleBlockFallSounds(
                        minedBlock.name.toLowerCase(),
                        numberOfBlocks
                    );
                } catch (error) {
                    console.warn('Error playing block sound:', error);
                    // Continue even if sound fails - animation will still work
                }

                // Remove blocks after animation completes
                setTimeout(() => {
                    setShowBlock(false);
                    setFallingBlocks(prevBlocks =>
                        prevBlocks.filter(block =>
                            !newFallingBlocks.some(newBlock => newBlock.id === block.id)
                        )
                    );
                }, 1800);
            }
        }
    }, [minedBlock]);

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

        // Resume audio context if it was suspended (browsers require user interaction)
        try {
            blockSoundPlayer.resumeAudioContext();
        } catch (e) {
            console.warn('Failed to resume audio context:', e);
        }
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

                {/* Falling blocks display */}
                {fallingBlocks.map((block) => (
                    <div
                        key={block.id}
                        className={styles.minedBlock}
                        style={{
                            left: `${block.x}px`,
                            top: `${block.y}px`,
                            backgroundImage: `url(${block.imageUrl})`,
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center'
                        }}
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