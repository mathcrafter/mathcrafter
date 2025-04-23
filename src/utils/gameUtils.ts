'use client';

import { MathProblem } from './types';
import { GameState } from '../models/gameState';

// Generate a random ID
export const generateId = (): string => {
    return Math.random().toString(36).substring(2, 9);
};

// Generate a math problem based on difficulty
export const generateMathProblem = (): MathProblem => {
    // For now, simple addition and subtraction within 20
    const operation: '+' | '-' = Math.random() > 0.5 ? '+' : '-';

    let num1: number, num2: number;

    if (operation === '+') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
    } else {
        num1 = Math.floor(Math.random() * 10) + 10; // Ensure larger number first
        num2 = Math.floor(Math.random() * num1) + 1;
    }

    return {
        num1,
        num2,
        operator: operation,
        answer: operation === '+' ? num1 + num2 : num1 - num2
    };
};

// Get initial game state
export const getInitialGameState = (): GameState => {
    // Default grid configuration 
    const gridConfig = {
        rows: 3,
        cols: 4
    };

    // Initialize blocks
    const totalBlocks = gridConfig.rows * gridConfig.cols;
    const blocks = Array.from({ length: totalBlocks }, () => ({
        id: generateId(),
        cracked: false
    }));

    return {
        gemstones: 0,
        pickaxes: {
            wooden: 1,
            stone: 0,
            iron: 0
        },
        currentPickaxe: 'wooden',
        pickaxeHealth: 5,
        biome: 'plain',
        biomeHealth: 10,
        crackCount: 0,
        gridConfig,
        blocks
    };
};

// Get total pickaxes count
export const getTotalPickaxes = (pickaxes: GameState['pickaxes']): number => {
    return Object.values(pickaxes).reduce((sum, count) => sum + count, 0);
};

// Get next available pickaxe type
export const getNextAvailablePickaxe = (
    pickaxes: GameState['pickaxes']
): 'wooden' | 'stone' | 'iron' | null => {
    for (const type of ['wooden', 'stone', 'iron'] as const) {
        if (pickaxes[type] > 0) {
            return type;
        }
    }
    return null;
};

// Get pickaxe health based on type
export const getPickaxeHealth = (type: 'wooden' | 'stone' | 'iron'): number => {
    switch (type) {
        case 'wooden':
            return 5;
        case 'stone':
            return 10;
        case 'iron':
            return 15;
    }
};

// Save game state to localStorage
export const saveGameState = (state: GameState): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('mathCrafterGameState', JSON.stringify(state));
    }
};

// Load game state from localStorage
export const loadGameState = (): GameState | null => {
    if (typeof window !== 'undefined') {
        const savedState = localStorage.getItem('mathCrafterGameState');
        if (savedState) {
            try {
                return JSON.parse(savedState) as GameState;
            } catch (e) {
                console.error('Failed to parse saved game state', e);
                return null;
            }
        }
    }
    return null;
};

// Check if a saved game exists
export const hasSavedGame = (): boolean => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('mathCrafterGameState') !== null;
    }
    return false;
};

// Clear saved game state
export const clearSavedGame = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('mathCrafterGameState');
    }
}; 