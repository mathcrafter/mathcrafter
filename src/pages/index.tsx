import type { NextPage } from 'next';
import dynamic from 'next/dynamic';

// Import GameDisplay with no SSR to avoid hydration mismatches
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

const Home: NextPage = () => {
    return (
        <div>
            <GameDisplay />
        </div>
    );
};

export default Home; 