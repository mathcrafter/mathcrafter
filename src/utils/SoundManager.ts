/**
 * Sound Manager Utility Class
 * Handles loading and playing sound effects
 */

class SoundManager {
    private sounds: Map<string, HTMLAudioElement> = new Map();
    private soundEnabled: boolean = true;

    constructor() {
        // Register sounds
        this.preloadSound('error', '/assets/sounds/error.mp3');
    }

    /**
     * Enable or disable all sounds
     */
    public toggleSound(enabled: boolean): void {
        this.soundEnabled = enabled;
    }

    /**
     * Preload a sound into memory
     */
    public preloadSound(name: string, url: string): void {
        try {
            const audio = new Audio(url);
            this.sounds.set(name, audio);
        } catch (error) {
            console.error(`Error loading sound ${name}: ${error}`);
        }
    }

    /**
     * Play a sound by name
     */
    public playSound(name: string): void {
        if (!this.soundEnabled) return;

        try {
            // Get sound from map or create a fallback
            let sound = this.sounds.get(name);

            // If sound exists, play it
            if (sound) {
                // Reset to beginning if already playing
                sound.currentTime = 0;
                sound.play().catch(e => {
                    console.error(`Error playing sound ${name}: ${e}`);
                });
            } else {
                console.warn(`Sound "${name}" not found`);
            }
        } catch (error) {
            console.error(`Error playing sound ${name}: ${error}`);
        }
    }
}

// Create a singleton instance
const soundManager = new SoundManager();
export default soundManager; 