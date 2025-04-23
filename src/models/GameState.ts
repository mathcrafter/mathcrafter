import { Pickaxe } from './Pickaxe';

export interface GameState {
    gemstones: number;
    pickaxes: Pickaxe[];
    currentPickaxe: number;
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

