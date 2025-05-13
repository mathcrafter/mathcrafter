import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import gameController from '../controllers/GameController';
import ImportGameModal from './ImportGameModal';
import { getAssetPath } from '../utils/assetPath';

interface HomeScreenProps {
    onStartNewGame: () => void;
    onContinueGame: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onStartNewGame, onContinueGame }) => {
    const [isClient, setIsClient] = useState(false);
    const [savedGameExists, setSavedGameExists] = useState(false);
    const [showImportModal, setShowImportModal] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setSavedGameExists(gameController.hasSavedGame());
    }, []);

    const handleNewGame = () => {
        // Clear any existing saved game
        gameController.clearSavedGame();
        onStartNewGame();
    };

    const toggleImportModal = () => {
        setShowImportModal(prev => !prev);
    };

    const handleImportSuccess = () => {
        // Update saved game status
        setSavedGameExists(true);
        // Show some feedback if needed
    };

    // Don't render anything substantial on the server to avoid hydration mismatches
    if (!isClient) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.homeScreen}>
            <div className={styles.logo}>
                <Image
                    src={getAssetPath('/assets/favicon.webp')}
                    alt="MathCrafter Logo"
                    width={100}
                    height={100}
                    priority
                />
            </div>
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

                <button
                    className={styles.buttonImport}
                    onClick={toggleImportModal}
                >
                    Import Game
                </button>
            </div>

            {/* Import Game Modal */}
            <ImportGameModal
                isOpen={showImportModal}
                onClose={toggleImportModal}
                onImportSuccess={handleImportSuccess}
            />
        </div>
    );
};

export default HomeScreen; 