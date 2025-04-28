'use client';

import React, { useState } from 'react';
import styles from '../styles/Game.module.css';
import { GameState } from '@/models/GameState';
import gameController from '@/controllers/GameController';

interface ExportGameModalProps {
    isOpen: boolean;
    onClose: () => void;
    gameState: GameState;
}

const ExportGameModal: React.FC<ExportGameModalProps> = ({ isOpen, onClose, gameState }) => {
    const [copied, setCopied] = useState<boolean>(false);

    if (!isOpen) return null;

    const exportedState = gameController.exportGameState(gameState);

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(exportedState);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const element = document.createElement('a');
        const file = new Blob([exportedState], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = `mathcrafter-save-${Date.now()}.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className={styles.modal + ' ' + styles.modalShow}>
            <div className={styles.modalContent}>
                <div className={styles.modalHeader}>
                    <h2>Export Game Save</h2>
                    <button className={styles.closeBtn} onClick={onClose}>×</button>
                </div>
                <div className={styles.modalBody}>
                    <p>Copy the code below or download it as a file to save your current game progress:</p>

                    <div className={styles.exportCodeContainer}>
                        <textarea
                            className={styles.exportCode}
                            value={exportedState}
                            readOnly
                            rows={6}
                        />
                    </div>

                    <div className={styles.exportActions}>
                        <button
                            className={styles.exportActionButton}
                            onClick={handleCopyToClipboard}
                        >
                            {copied ? 'Copied!' : 'Copy to Clipboard'}
                        </button>

                        <button
                            className={styles.exportActionButton}
                            onClick={handleDownload}
                        >
                            Download as File
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExportGameModal; 