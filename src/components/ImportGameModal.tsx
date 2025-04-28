'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import gameController from '@/controllers/GameController';

interface ImportGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onImportSuccess: () => void;
}

const ImportGameModal: React.FC<ImportGameModalProps> = ({ isOpen, onClose, onImportSuccess }) => {
    const [importData, setImportData] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    if (!isOpen) return null;

    const handleImport = () => {
        // Check if import data is provided
        if (!importData.trim()) {
            setError('Please enter a game save code');
            return;
        }

        // Show confirmation dialog
        setError(null);
        setShowConfirm(true);
    };

    const confirmImport = () => {
        try {
            // Attempt to import the game state
            const importedState = gameController.importGameState(importData.trim());

            if (!importedState) {
                setError('Invalid game save data. Please check your input and try again.');
                setShowConfirm(false);
                return;
            }

            // Save the imported state to local storage
            gameController.saveGameState(importedState);

            // Notify parent component of successful import
            onImportSuccess();

            // Close the modal
            onClose();
        } catch (error) {
            console.error('Import failed:', error);
            setError('Failed to import game data. The save code may be invalid.');
            setShowConfirm(false);
        }
    };

    const cancelImport = () => {
        setShowConfirm(false);
    };

    return (
        <div className={styles.modal + ' ' + styles.modalShow}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Import Game Save</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    {!showConfirm ? (
                        <>
                            <p>Paste your game save code below to import your progress:</p>

                            <div className={styles.exportCodeContainer}>
                                <textarea
                                    className={styles.exportCode}
                                    value={importData}
                                    onChange={(e) => setImportData(e.target.value)}
                                    rows={6}
                                    placeholder="Paste your save code here..."
                                />
                            </div>

                            {error && <div className={styles.errorMessage}>{error}</div>}

                            <div className={styles.exportActions}>
                                <button
                                    className={styles.exportActionButton}
                                    onClick={handleImport}
                                >
                                    Import Game
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.confirmImport}>
                            <div className={styles.warningMessage}>
                                <p><strong>Warning:</strong> Importing this game save will overwrite your current progress.</p>
                                <p>This action cannot be undone. Are you sure you want to continue?</p>
                            </div>

                            <div className={styles.exportActions}>
                                <button
                                    className={styles.cancelButton}
                                    onClick={cancelImport}
                                >
                                    Cancel
                                </button>
                                <button
                                    className={styles.confirmButton}
                                    onClick={confirmImport}
                                >
                                    Yes, Import
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImportGameModal; 