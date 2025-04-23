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
    gridConfig: {
        rows: number;
        cols: number;
    };
    blocks: {
        id: string;
        cracked: boolean;
    }[];
}

