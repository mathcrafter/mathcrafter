'use client';

import React, { useState, useEffect } from 'react';
import styles from '../styles/Game.module.css';
import { getAssetPath } from '@/utils/assetPath';
import { Chest } from '@/models/Chest';
import { GameState } from '@/models/GameState';
import { PlayerBlock } from '@/models/Block';

interface ChestModalProps {
    isOpen: boolean;
    onClose: () => void;
    biomeType: string | null;
    chest: Chest | null;
    onClaimRewards: (rewards: { blockName: string, amount: number }[]) => void;
}

const ChestModal: React.FC<ChestModalProps> = ({
    isOpen,
    onClose,
    biomeType,
    chest,
    onClaimRewards
}) => {
    const [isOpening, setIsOpening] = useState(false);
    const [showItems, setShowItems] = useState(false);
    const [rewards, setRewards] = useState<Array<{ block: any, amount: number }>>([]);

    // Reset state when modal is opened
    useEffect(() => {
        if (isOpen) {
            setIsOpening(false);
            setShowItems(false);
        }
    }, [isOpen]);

    // Handle chest opening animation
    const handleOpenChest = () => {
        setIsOpening(true);

        // After opening animation, show the items
        setTimeout(() => {
            if (chest) {
                const chestRewards = chest.open();
                // Filter out rewards with amount 0
                const validRewards = chestRewards.filter(reward => reward.amount > 0);
                setRewards(validRewards);
            }
            setShowItems(true);
        }, 1000); // Match this with your animation duration
    };

    // Handle claiming items and closing modal
    const handleClaim = () => {
        if (rewards.length > 0) {
            // Convert rewards to the format expected by the onClaimRewards callback
            const claimableRewards = rewards.map(reward => ({
                blockName: reward.block.name,
                amount: reward.amount
            }));

            onClaimRewards(claimableRewards);
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.chestModalContent}>
                <div className={styles.modalHeader}>
                    <h2>Biome Chest</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>

                <div className={styles.chestContainer}>
                    <h3>You've conquered the {biomeType} biome!</h3>

                    {!showItems ? (
                        <div className={styles.chestImageContainer}>
                            <img
                                src={getAssetPath(`/assets/chests/${chest?.name || 'wooden'}.png`)}
                                alt="Chest"
                                className={`${styles.chestImage} ${isOpening ? styles.chestOpening : ''}`}
                                onClick={handleOpenChest}
                            />
                            <p className={styles.chestInstructions}>
                                {isOpening ? 'Opening...' : 'Click the chest to open it!'}
                            </p>
                        </div>
                    ) : (
                        <div className={styles.rewardsContainer}>
                            <h3>You found:</h3>
                            <div className={styles.rewardsList}>
                                {rewards.length > 0 ? (
                                    rewards.map((reward, index) => (
                                        <div key={index} className={styles.rewardItem}>
                                            <div className={styles.rewardIconContainer}>
                                                <img
                                                    src={new PlayerBlock({ name: reward.block.name, quantity: 1 }).getImageUrl()}
                                                    alt={reward.block.name}
                                                    className={styles.rewardIcon}
                                                />
                                            </div>
                                            <div className={styles.rewardInfo}>
                                                <span className={styles.rewardName}>{reward.block.name}</span>
                                                <span className={styles.rewardAmount}>x{reward.amount}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>The chest was empty!</p>
                                )}
                            </div>
                            <button
                                className={styles.claimButton}
                                onClick={handleClaim}
                            >
                                Claim Rewards
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChestModal; 