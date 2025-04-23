import React, { useState, useEffect } from 'react';
import { hasSavedGame, clearSavedGame } from '../utils/gameUtils';
import styles from '../styles/Home.module.css';

interface HomeScreenProps {
    onStartNewGame: () => void;
    onContinueGame: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartNewGame, onContinueGame }) => {
    const [isClient, setIsClient] = useState(false);
    const [savedGameExists, setSavedGameExists] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setSavedGameExists(hasSavedGame());
    }, []);

    const handleNewGame = () => {
        // Clear any existing saved game
        clearSavedGame();
        onStartNewGame();
    };

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.homeScreen}>
            <div className={styles.title}>
                <h1>MathCrafter</h1>
            </div>

            <div className={styles.buttonContainer}>
                <button
                    className={styles.buttonPrimary}
                    onClick={handleNewGame}
                >
                    New Game
                </button>

                {savedGameExists && (
                    <button
                        className={styles.buttonSecondary}
                        onClick={onContinueGame}
                    >
                        Continue Game
                    </button>
                )}
            </div>
        </div>
    );
};

export default HomeScreen; 