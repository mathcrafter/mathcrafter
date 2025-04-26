import React, { useEffect, useRef } from 'react';
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
    const currentBiome = gameState.currentBiome.getBiome();
    const availableBlocks = currentBiome.availableBlocks || [];
    const hasEnoughPicks = gameState.picks >= 100;
    const drawerContentRef = useRef<HTMLDivElement>(null);

    // Check for scrollable content and apply hasScroll class
    useEffect(() => {
        if (isOpen && drawerContentRef.current) {
            const checkScroll = () => {
                const element = drawerContentRef.current;
                if (element) {
                    if (element.scrollHeight > element.clientHeight) {
                        element.classList.add(styles.hasScroll);
                    } else {
                        element.classList.remove(styles.hasScroll);
                    }
                }
            };

            // Check on initial render and when content might change
            checkScroll();

            // Set up a resize observer to check when container dimensions change
            const resizeObserver = new ResizeObserver(checkScroll);
            resizeObserver.observe(drawerContentRef.current);

            // Clean up
            return () => {
                if (drawerContentRef.current) {
                    resizeObserver.unobserve(drawerContentRef.current);
                }
                resizeObserver.disconnect();
            };
        }
    }, [isOpen, availableBlocks]);

    return (
        <>
            {/* Darkened overlay when drawer is open */}
            <div
                className={`${styles.biomesOverlay} ${isOpen ? styles.biomesOverlayOpen : ''}`}
                onClick={onClose}
            />

            {/* Drawer component */}
            <div className={`${styles.biomesDrawer} ${isOpen ? styles.biomesDrawerOpen : ''}`}>
                {/* Handle to open/close the drawer */}
                <div className={styles.biomesDrawerHandle} onClick={onClose} />

                <div className={styles.biomesDrawerHeader}>
                    <h2>Buy Blocks from {currentBiome.name} biome</h2>
                </div>

                <div ref={drawerContentRef} className={styles.biomesDrawerContent} data-drawer-type="blocks">
                    <div className={styles.biomesSection}>
                        <p>Your picks: {gameState.picks}</p>

                        {availableBlocks.length === 0 ? (
                            <p>No blocks available in this biome.</p>
                        ) : (
                            <div className={styles.blocksGrid}>
                                {availableBlocks.map((blockName) => {
                                    const tempBlock = new PlayerBlock({ name: blockName, quantity: 1 });
                                    const blockImageUrl = tempBlock.getImageUrl();

                                    return (
                                        <div key={blockName} className={styles.blockItem}>
                                            <div className={styles.blockImageContainer}>
                                                <img
                                                    src={blockImageUrl}
                                                    alt={blockName}
                                                    className={styles.blockItemImg}
                                                />
                                                <div className={styles.blockNameOverlay}>{blockName}</div>
                                            </div>
                                            <div className={styles.blockItemContent}>
                                                <div className={styles.blockDescription}>
                                                    A {blockName} block from the {currentBiome.name} biome.
                                                </div>
                                                <button
                                                    className={`${styles.buyBlockButton} ${!hasEnoughPicks ? styles.buyBlockButtonDisabled : ''}`}
                                                    onClick={() => onBuyBlock(blockName)}
                                                    disabled={!hasEnoughPicks}
                                                >
                                                    {hasEnoughPicks ? 'Buy (100 picks)' : 'Need 100 picks'}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BuyBlocksModal; 