import ReactGA from 'react-ga4';

// Initialization with your GA measurement ID
export const initGA = (measurementId: string) => {
    if (typeof window !== 'undefined') {
        ReactGA.initialize(measurementId);
    }
};

// Track page views
export const logPageView = () => {
    if (typeof window !== 'undefined') {
        ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
    }
};

// Track events
export const logEvent = (category: string, action: string, label?: string, value?: number) => {
    if (typeof window !== 'undefined') {
        ReactGA.event({
            category,
            action,
            label,
            value
        });
    }
};

// Track user
export const setUser = (userId: string) => {
    if (typeof window !== 'undefined') {
        ReactGA.set({ userId });
    }
}; 