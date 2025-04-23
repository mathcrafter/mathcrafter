import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { useState } from 'react';

// Import components with no SSR to avoid hydration mismatches
const GameDisplay = dynamic(() => import('../components/GameDisplay'), {
    ssr: false,
    loading: () => <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#222',
        border: '5px solid #555',
        borderRadius: '10px',
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem'
    }}>
        Loading MathCrafter...
    </div>
});

const HomeScreen = dynamic(() => import('../components/HomeScreen'), {
    ssr: false,
    loading: () => <div style={{
        maxWidth: '900px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#222',
        border: '5px solid #555',
        borderRadius: '10px',
        height: '500px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '1.5rem'
    }}>
        Loading MathCrafter...
    </div>
});

const Home: NextPage = () => {
    const [gameStarted, setGameStarted] = useState(false);

    const handleStartNewGame = () => {
        setGameStarted(true);
    };

    const handleContinueGame = () => {
        setGameStarted(true);
    };

    return (
        <div>
            {!gameStarted ? (
                <HomeScreen
                    onStartNewGame={handleStartNewGame}
                    onContinueGame={handleContinueGame}
                />
            ) : (
                <GameDisplay />
            )}
        </div>
    );
};

export default Home; 