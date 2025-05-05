import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { initGA, logPageView } from '@/utils/analytics';
import { GA_MEASUREMENT_ID } from '@/config/analytics';

function MyApp({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        // Initialize Google Analytics
        initGA(GA_MEASUREMENT_ID);

        // Track initial page view
        logPageView();

        // Track page views on route change
        const handleRouteChange = () => {
            logPageView();
        };

        router.events.on('routeChangeComplete', handleRouteChange);

        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <title>MathCrafter - Math Practice Game</title>
                <meta name="description" content="Minecraft-inspired math practice game for kids" />
                <link rel="icon" href="/favicon.ico" />
                <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet" />
            </Head>
            <Component {...pageProps} />
        </>
    );
}

export default MyApp; 