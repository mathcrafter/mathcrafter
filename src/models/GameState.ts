import { Biome, biomes } from './Biome';
import { Pickaxe, pickaxes } from './Pickaxe';

export interface GameState {
    pickaxes: Pickaxe[];
    currentPickaxe: number;
    biome: string;
    biomeHealth: number;
    crackCount: number;
}