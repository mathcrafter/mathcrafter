'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '../models/GameState';
import { recipeStore } from '@/stores/RecipeStore';
import { Recipe } from '@/models/Recipe';
import { getAssetPath } from '@/utils/assetPath';

/**
 * Validates if a player has the required ingredients for a recipe
 * @param recipe The recipe object with name and ingredients
 * @param blockInventory The player's block inventory
 * @returns True if the player has all required ingredients
 */
function validateRecipe(recipe: Recipe, blockInventory: any): boolean {
    if (!recipe || !recipe.ingredients || !blockInventory) {
        return false;
    }

    // Check that player has all required ingredients in sufficient quantities
    return recipe.ingredients.every(ingredient => {
        const blockQuantity = blockInventory.getBlockQuantity(ingredient.item);
        return blockQuantity >= ingredient.amount;
    });
}

/**
 * Crafts a recipe, consuming ingredients and adding the result to inventory
 * @param recipe The recipe object with name and ingredients
 * @param gameState The current game state
 * @returns The updated game state after crafting
 */
function craftRecipe(recipe: Recipe, gameState: GameState): GameState {
    if (!validateRecipe(recipe, gameState.blockInventory)) {
        console.error('Cannot craft recipe - missing ingredients');
        return gameState;
    }

    // Create a copy of the game state to work with
    let updatedState = gameState;

    // Consume each ingredient
    recipe.ingredients.forEach(ingredient => {
        updatedState = updatedState.withBlockInventory(
            updatedState.blockInventory.addBlock(ingredient.item, -ingredient.amount)
        );
    });

    // Add the crafted item to inventory
    updatedState = updatedState.withBlockInventory(
        updatedState.blockInventory.addBlock(recipe.name, 1)
    );

    console.log(`Crafted ${recipe.name} successfully`);
    return updatedState;
}

interface FurnaceModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
    onCraft?: (recipe: Recipe) => void;
}

const FurnaceModal: React.FC<FurnaceModalProps> = ({ isOpen, onClose, gameState, onCraft }) => {
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [craftingSuccess, setCraftingSuccess] = useState<boolean>(false);
    const [craftedItem, setCraftedItem] = useState<string | null>(null);

    const handleRecipeClick = (recipe: Recipe) => {
        setSelectedRecipe(recipe);
        // Reset any previous craft success message
        setCraftingSuccess(false);
        setCraftedItem(null);
    };

    const getBlockImageUrl = (blockName: string): string => {
        return getAssetPath(`/assets/blocks/${blockName}.png`);
    };

    const hasIngredients = (recipe: Recipe): boolean => {
        return validateRecipe(recipe, gameState.blockInventory);
    };

    const handleCraft = () => {
        if (!selectedRecipe || !hasIngredients(selectedRecipe)) return;

        // Craft the recipe and get the updated game state
        const updatedGameState = craftRecipe(selectedRecipe, gameState);

        // Call the parent handler if provided
        if (onCraft) {
            // Pass both the recipe and the updated state to the parent
            onCraft(selectedRecipe);
        }

        // Set success state for visual feedback
        setCraftingSuccess(true);
        setCraftedItem(selectedRecipe.name);

        // Clear the selection after a delay
        setTimeout(() => {
            setSelectedRecipe(null);
            setCraftingSuccess(false);
        }, 2000);
    };

    // Render each recipe card
    const renderRecipe = (recipe: Recipe) => {
        const isSelectable = hasIngredients(recipe);
        const blockImageUrl = getBlockImageUrl(recipe.name);

        return (
            <div
                key={recipe.name}
                className={`${styles.recipeCard} ${isSelectable ? styles.selectableRecipe : styles.unavailableRecipe}`}
                onClick={() => handleRecipeClick(recipe)}
            >
                <div className={styles.recipeOutput}>
                    <img
                        src={blockImageUrl}
                        alt={recipe.name}
                        className={styles.recipeImage}
                    />
                    <div className={styles.recipeName}>{recipe.name.replace(/_/g, ' ')}</div>
                </div>

                <div className={styles.recipeIngredients}>
                    {recipe.ingredients.map((ingredient, index) => {
                        const ingredientImageUrl = getBlockImageUrl(ingredient.item);
                        const availableQuantity = gameState.blockInventory.getBlockQuantity(ingredient.item);
                        const hasEnough = availableQuantity >= ingredient.amount;

                        return (
                            <div
                                key={`${recipe.name}-${ingredient.item}-${index}`}
                                className={`${styles.ingredientItem} ${hasEnough ? '' : styles.missingIngredient}`}
                            >
                                <img
                                    src={ingredientImageUrl}
                                    alt={ingredient.item}
                                    className={styles.ingredientImage}
                                />
                                <div className={styles.ingredientDetails}>
                                    <div className={styles.ingredientName}>{ingredient.item.replace(/_/g, ' ')}</div>
                                    <div className={styles.ingredientAmount}>
                                        {availableQuantity}/{ingredient.amount}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

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
                    <h2>Furnace Recipes</h2>
                </div>

                <div className={styles.biomesDrawerContent} data-drawer-type="furnace">
                    {craftingSuccess && craftedItem && (
                        <div className={styles.craftingSuccess}>
                            <img
                                src={getBlockImageUrl(craftedItem)}
                                alt={craftedItem}
                                className={styles.craftedItemImage}
                            />
                            <div className={styles.craftedItemText}>
                                Successfully crafted {craftedItem.replace(/_/g, ' ')}!
                            </div>
                        </div>
                    )}

                    <div className={styles.recipesContainer}>
                        {recipeStore.items.map(recipe => renderRecipe(recipe))}
                    </div>
                </div>
            </div>

            {/* Recipe Details View when a recipe is selected */}
            {selectedRecipe && (
                <div className={styles.recipeDetailsOverlay} onClick={() => setSelectedRecipe(null)}>
                    <div className={styles.recipeDetailsContainer} onClick={e => e.stopPropagation()}>
                        <div className={styles.recipeDetailsHeader}>
                            <h3>Craft {selectedRecipe.name.replace(/_/g, ' ')}</h3>
                            <button className={styles.closeBtn} onClick={() => setSelectedRecipe(null)}>&times;</button>
                        </div>

                        <div className={styles.recipeDetailsContent}>
                            <div className={styles.recipeOutputDetails}>
                                <img
                                    src={getBlockImageUrl(selectedRecipe.name)}
                                    alt={selectedRecipe.name}
                                    className={styles.recipeOutputImage}
                                />
                                <div className={styles.recipeOutputName}>{selectedRecipe.name.replace(/_/g, ' ')}</div>
                            </div>

                            <div className={styles.recipeIngredientsList}>
                                <h4>Required Ingredients:</h4>
                                {selectedRecipe.ingredients.map((ingredient, index) => {
                                    const availableQuantity = gameState.blockInventory.getBlockQuantity(ingredient.item);
                                    const hasEnough = availableQuantity >= ingredient.amount;

                                    return (
                                        <div
                                            key={`detail-${selectedRecipe.name}-${ingredient.item}-${index}`}
                                            className={`${styles.recipeIngredientDetail} ${hasEnough ? '' : styles.missingIngredientDetail}`}
                                        >
                                            <img
                                                src={getBlockImageUrl(ingredient.item)}
                                                alt={ingredient.item}
                                                className={styles.ingredientDetailImage}
                                            />
                                            <div className={styles.ingredientDetailInfo}>
                                                <div className={styles.ingredientDetailName}>{ingredient.item.replace(/_/g, ' ')}</div>
                                                <div className={styles.ingredientDetailAmount}>
                                                    {availableQuantity}/{ingredient.amount}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                className={`${styles.craftButton} ${hasIngredients(selectedRecipe) ? '' : styles.craftButtonDisabled}`}
                                disabled={!hasIngredients(selectedRecipe)}
                                onClick={handleCraft}
                            >
                                {hasIngredients(selectedRecipe) ? 'Craft Item' : 'Missing Ingredients'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default FurnaceModal; 