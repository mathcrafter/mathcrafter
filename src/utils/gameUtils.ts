'use client';

import { GameState } from '../models/GameState';

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