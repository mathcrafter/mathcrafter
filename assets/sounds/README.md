# Sound Effects

This directory contains sound effects for the game.

## Sounds
- `error.mp3` - Sound played when the user answers a question incorrectly

## Usage

Sounds are managed through the SoundManager utility class located at `src/utils/SoundManager.ts`.

Example:
```typescript
import soundManager from '@/utils/SoundManager';

// Play the error sound
soundManager.playSound('error');
```

## Adding New Sounds

1. Add the sound file to this directory
2. Update the SoundManager.ts constructor to preload the sound
3. Use the `playSound()` method where needed

## Credits

Sound effects are either created for this project or sourced from public domain/free resources. 