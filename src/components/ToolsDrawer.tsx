import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import ShopPickaxesModal from './ShopPickaxesModal';
import BiomesModal from './BiomesModal';
import BuyBlocksModal from './BuyBlocksModal';

interface ToolsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onBuyPickaxe: (pickaxeName: string, cost: number) => void;
    onUnlockBiome: (biomeName: string) => void;
    onSelectBiome: (biomeName: string) => void;
    onBuyBlock: (blockName: string) => void;
    activeTab?: string;
}

const ToolsDrawer: React.FC<ToolsDrawerProps> = ({
    isOpen,
    onClose,
    gameState,
    onBuyPickaxe,
    onUnlockBiome,
    onSelectBiome,
    onBuyBlock,
    activeTab = 'pickaxes'
}) => {
    const [currentTab, setCurrentTab] = useState(activeTab);
    const drawerContentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setCurrentTab(activeTab);
    }, [activeTab]);

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
    }, [isOpen, currentTab]);

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab);
    };

    // Get the title based on current tab
    const getTabTitle = () => {
        switch (currentTab) {
            case 'pickaxes':
                return 'Shop Pickaxes';
            case 'biomes':
                return gameState.currentBiome.currentHealth <= 0 ? 'Select Biome' : 'Available Biomes';
            case 'blocks':
                return `Buy Blocks from ${gameState.currentBiome.getBiome().name} biome`;
            default:
                return 'Tools';
        }
    };

    return (
        <>
            {/* Drawer component */}
            <div className={`${styles.biomesDrawer} ${styles.alwaysOpenDrawer}`}>
                <div className={styles.biomesDrawerHeader}>
                    <h2>{getTabTitle()}</h2>
                    <div className={styles.toolsTabs}>
                        <button
                            className={`${styles.toolsTab} ${currentTab === 'pickaxes' ? styles.toolsTabActive : ''}`}
                            onClick={() => handleTabChange('pickaxes')}
                        >
                            Pickaxes
                        </button>
                        <button
                            className={`${styles.toolsTab} ${currentTab === 'biomes' ? styles.toolsTabActive : ''}`}
                            onClick={() => handleTabChange('biomes')}
                        >
                            Biomes
                        </button>
                        <button
                            className={`${styles.toolsTab} ${currentTab === 'blocks' ? styles.toolsTabActive : ''}`}
                            onClick={() => handleTabChange('blocks')}
                        >
                            Blocks
                        </button>
                    </div>
                </div>

                <div ref={drawerContentRef} className={styles.biomesDrawerContent} data-drawer-type="tools">
                    {currentTab === 'pickaxes' && (
                        <div className={styles.toolsTabContent}>
                            <ShopPickaxesModal
                                isOpen={true}
                                onClose={() => { }}
                                gameState={gameState}
                                onBuyItem={onBuyPickaxe}
                            />
                        </div>
                    )}

                    {currentTab === 'biomes' && (
                        <div className={styles.toolsTabContent}>
                            <BiomesModal
                                isOpen={true}
                                onClose={() => { }}
                                gameState={gameState}
                                onUnlockBiome={onUnlockBiome}
                                onSelectBiome={onSelectBiome}
                                selectionMode={true}
                            />
                        </div>
                    )}

                    {currentTab === 'blocks' && (
                        <div className={styles.toolsTabContent}>
                            <BuyBlocksModal
                                isOpen={true}
                                onClose={() => { }}
                                gameState={gameState}
                                onBuyBlock={onBuyBlock}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ToolsDrawer; 