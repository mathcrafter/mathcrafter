'use client';

import React from 'react';
import styles from '../styles/Game.module.css';
import { PlayerBlock } from '@/models/Block';
import { getAssetPath } from '../utils/assetPath';
import { recipeStore } from '@/stores/RecipeStore';

interface BlockDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    blockName: string;
}

const BlockDetails: React.FC<BlockDetailsProps> = ({ isOpen, onClose, blockName }) => {
    if (!isOpen) return null;

    // Create a temporary block to get its properties
    const block = new PlayerBlock({ name: blockName, quantity: 1 });
    // Get biomes where this block can be found
    const biomes = block.getBiomes();

    // Get recipes where this block is used as an ingredient
    const recipesUsingThisBlock = block.getRecipesToCraft();

    // Get recipe that produces this block (if any)
    const recipeForThisBlock = recipeStore.items.find(recipe => recipe.name === blockName);

    return (
        <>
            <div className={`${styles.blockDetailsOverlay}`} onClick={onClose}></div>
            <div className={`${styles.blockDetailsDrawer} ${isOpen ? styles.open : ''}`}>
                <div className={styles.blockDetailsContent}>
                    <div className={styles.blockDetailsHeader}>
                        <h2>{block.name}</h2>
                        <button className={styles.closeBtn} onClick={onClose}>×</button>
                    </div>

                    <div className={styles.blockDetailsBody}>
                        <div className={styles.blockDetailsImage}>
                            <img src={block.getImageUrl()} alt={block.name} />
                        </div>

                        <div className={styles.blockDetailsStat}>
                            <span className={styles.statLabel}>Rarity:</span>
                            <span className={styles.statValue}>{block.getBlock().rarity}</span>
                        </div>

                        <div className={styles.blockDetailsStat}>
                            <span className={styles.statLabel}>Found in Biomes:</span>
                            <span className={styles.statValue}>
                                {biomes.length > 0
                                    ? biomes.map(biome => biome.name).join(', ')
                                    : 'None'
                                }
                            </span>
                        </div>

                        {/* Crafting Recipe */}
                        {recipeForThisBlock ? (
                            <>
                                <div className={styles.blockDetailsStat}>
                                    <span className={styles.statLabel}>Crafting Recipe:</span>
                                    <div className={styles.statValue}>
                                        <ul className={styles.ingredientsList}>
                                            {recipeForThisBlock.ingredients.map((ingredient, index) => {
                                                const ingredientBlock = new PlayerBlock({
                                                    name: ingredient.item,
                                                    quantity: ingredient.amount
                                                });
                                                return (
                                                    <li key={index} className={styles.ingredientItem}>
                                                        <img
                                                            src={ingredientBlock.getImageUrl()}
                                                            alt={ingredient.item}
                                                            className={styles.ingredientImage}
                                                        />
                                                        <span className={styles.ingredientName}>
                                                            {ingredient.item} x{ingredient.amount}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : null}

                        {/* Used In */}
                        {recipesUsingThisBlock.length > 0 ? (
                            <>
                                <div className={styles.blockDetailsStat}>
                                    <span className={styles.statLabel}>Used to craft:</span>
                                    <div className={styles.statValue}>
                                        <ul className={styles.ingredientsList}>
                                            {recipesUsingThisBlock.map((recipe, index) => {
                                                const resultBlock = new PlayerBlock({
                                                    name: recipe.name,
                                                    quantity: 1
                                                });
                                                return (
                                                    <li key={index} className={styles.ingredientItem}>
                                                        <img
                                                            src={resultBlock.getImageUrl()}
                                                            alt={recipe.name}
                                                            className={styles.ingredientImage}
                                                        />
                                                        <span className={styles.ingredientName}>
                                                            {recipe.name}
                                                        </span>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlockDetails; 