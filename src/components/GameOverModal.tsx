'use client';

import React from 'react';
import styles from '../styles/Game.module.css';

interface GameOverModalProps {
    isOpen: boolean;
    onRestart: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onRestart }) => {
    return (
        <div className={`${styles.modal} ${isOpen ? styles.modalShow : ''}`}>
            <div className={styles.modalContent}>
                <h2>Game Over!</h2>
                <p>You've lost all your pickaxes!</p>
                <button className={styles.restartBtn} onClick={onRestart}>Play Again</button>
            </div>
        </div>
    );
};

export default GameOverModal; 