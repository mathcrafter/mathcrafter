export interface GameState {
    gemstones: number;
    pickaxes: {
        wooden: number;
        stone: number;
        iron: number;
    };
    currentPickaxe: 'wooden' | 'stone' | 'iron';
    pickaxeHealth: number;
    biome: 'plain' | 'desert';
    biomeHealth: number;
    crackCount: number;
}

export interface MathProblem {
    num1: number;
    num2: number;
    operator: '+' | '-';
    answer: number;
}

export interface Crack {
    id: string;
    x: number;
    y: number;
}

export interface Gemstone {
    id: string;
    x: number;
    y: number;
} 