/**
 * Block Sound Player
 * 
 * This utility enhances the mining experience by playing appropriate sound effects
 * when blocks are mined and fall out of the biome.
 */

export interface SoundBuffer {
    [key: string]: AudioBuffer | null;
}

export class BlockSoundPlayer {
    private audioContext: AudioContext | null = null;
    private initialized: boolean = false;
    private soundBuffers: SoundBuffer = {};
    private enabled: boolean = true; // Can be toggled by user
    private soundFileMapping: Record<string, string> = {
        'stone': '/assets/sounds/stone_break.mp3',
        'coal': '/assets/sounds/stone_break.mp3',
        'iron': '/assets/sounds/metal_break.mp3',
        'gold': '/assets/sounds/metal_break.mp3',
        'diamond': '/assets/sounds/crystal_break.mp3',
        'emerald': '/assets/sounds/crystal_break.mp3',
        'ruby': '/assets/sounds/crystal_break.mp3',
        'sapphire': '/assets/sounds/crystal_break.mp3',
        'amethyst': '/assets/sounds/crystal_break.mp3',
        'wood': '/assets/sounds/wood_break.mp3',
        'default': '/assets/sounds/stone_break.mp3'
    };

    /**
     * Creates and initializes the audio context
     */
    private createAudioContext(): AudioContext | null {
        // Create an audio context
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) {
            console.warn('Web Audio API is not supported in this browser');
            return null;
        }
        try {
            return new AudioContextClass();
        } catch (e) {
            console.warn('Failed to create audio context:', e);
            return null;
        }
    }

    /**
     * Initialize the audio context (must be called from a user gesture)
     */
    public initialize(): boolean {
        if (this.initialized) return true;

        try {
            this.audioContext = this.createAudioContext();
            if (!this.audioContext) {
                console.warn('Could not create audio context, sound will be disabled');
                this.enabled = false;
                return false;
            }

            this.initialized = true;

            // Preload common sounds
            this.preloadSounds(['default', 'stone', 'iron', 'diamond']);
            return true;
        } catch (e) {
            console.warn('Sound initialization failed, disabling sounds:', e);
            this.enabled = false;
            return false;
        }
    }

    /**
     * Enable or disable sound effects
     */
    public setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    /**
     * Preload sound files to improve performance
     */
    public preloadSounds(soundTypes: string[]): void {
        if (!this.enabled || !this.audioContext) return;

        soundTypes.forEach(type => {
            const soundUrl = this.getSoundFileForBlockType(type);
            this.loadSound(soundUrl).then(buffer => {
                this.soundBuffers[type] = buffer;
            }).catch(err => {
                console.warn(`Failed to load sound for ${type}:`, err);
                // Don't disable all sounds just because one fails to load
            });
        });
    }

    /**
     * Load a sound file and return the decoded audio buffer
     */
    public async loadSound(url: string): Promise<AudioBuffer | null> {
        if (!this.enabled || !this.audioContext) {
            return null;
        }

        try {
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const arrayBuffer = await response.arrayBuffer();

            // Some browsers need a promise, others use a callback
            return new Promise<AudioBuffer>((resolve, reject) => {
                try {
                    if (this.audioContext!.decodeAudioData.length === 2) {
                        // Callback-based API
                        this.audioContext!.decodeAudioData(arrayBuffer,
                            buffer => resolve(buffer),
                            err => reject(err || new Error('Decoding failed'))
                        );
                    } else {
                        // Promise-based API
                        this.audioContext!.decodeAudioData(arrayBuffer)
                            .then(resolve)
                            .catch(reject);
                    }
                } catch (e) {
                    reject(e);
                }
            });
        } catch (error) {
            console.warn('Error loading sound:', error);
            return null;
        }
    }

    /**
     * Get the appropriate sound file for a block type
     */
    public getSoundFileForBlockType(blockType: string): string {
        return this.soundFileMapping[blockType] || this.soundFileMapping.default;
    }

    /**
     * Play sound for a specific block type with randomized pitch and timing
     */
    public async playBlockFallSound(blockType: string, delayMs: number = 0): Promise<AudioBufferSourceNode | null> {
        if (!this.enabled) return null;

        if (!this.initialized || !this.audioContext) {
            const success = this.initialize();
            if (!success) return null;
        }

        try {
            // Get the appropriate buffer for this block type
            let buffer = this.soundBuffers[blockType];

            // If the buffer isn't loaded yet, load it now
            if (!buffer) {
                try {
                    const soundUrl = this.getSoundFileForBlockType(blockType);
                    buffer = await this.loadSound(soundUrl);

                    if (buffer) {
                        this.soundBuffers[blockType] = buffer;
                    } else {
                        return null; // Failed to load sound
                    }
                } catch (e) {
                    console.warn(`Couldn't load sound for ${blockType}:`, e);
                    return null;
                }
            }

            if (!buffer) return null;

            // Create source node
            const source = this.audioContext!.createBufferSource();
            source.buffer = buffer;

            // Add slight pitch variation for more natural sound
            source.playbackRate.value = 0.9 + Math.random() * 0.3; // Random pitch between 0.9 and 1.2

            // Create gain node for volume control
            const gainNode = this.audioContext!.createGain();
            gainNode.gain.value = 0.7; // Set volume to 70%

            // Connect nodes
            source.connect(gainNode);
            gainNode.connect(this.audioContext!.destination);

            // Play with delay if specified
            source.start(this.audioContext!.currentTime + (delayMs / 1000));

            return source;
        } catch (error) {
            console.warn('Error playing sound:', error);
            return null;
        }
    }

    /**
     * Play a sequence of sounds for multiple falling blocks
     */
    public playMultipleBlockFallSounds(blockType: string, count: number = 3): void {
        if (!this.enabled) return;

        // Initialize if not done yet
        if (!this.initialized) {
            const success = this.initialize();
            if (!success) return;
        }

        // Play multiple sounds with slight delays
        for (let i = 0; i < Math.min(count, 5); i++) { // Limit to max 5 sounds at once
            const delay = i * Math.random() * 150; // Random delay between sounds
            this.playBlockFallSound(blockType, delay).catch(err => {
                // Just log the error and continue
                console.warn('Error in sound sequence:', err);
            });
        }
    }

    /**
     * Resume audio context if it was suspended (needed for browsers that suspend audio until user interaction)
     */
    public resumeAudioContext(): void {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume().catch(e => {
                console.warn('Failed to resume audio context:', e);
            });
        }
    }
}

// Create singleton instance
const blockSoundPlayer = new BlockSoundPlayer();

// Export the player
export default blockSoundPlayer; 