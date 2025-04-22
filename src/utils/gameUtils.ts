'use client';

import { MathProblem, GameState } from './types';

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
        crackCount: 0
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