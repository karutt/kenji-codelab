'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

interface HeaderContextType {
    showHeader: boolean;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: React.ReactNode }) {
    const [showHeader, setShowHeader] = useState(true);
    const lastScrollY = useRef(0);
    const scrollDelta = useRef(0);
    const HIDE_THRESHOLD = 120;

    useEffect(() => {
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (currentY < 128) {
                setShowHeader(true);
                scrollDelta.current = 0;
            } else if (currentY > lastScrollY.current) {
                scrollDelta.current += currentY - lastScrollY.current;
                if (scrollDelta.current > HIDE_THRESHOLD) {
                    setShowHeader(false);
                }
            } else {
                setShowHeader(true);
                scrollDelta.current = 0;
            }
            lastScrollY.current = currentY;
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return <HeaderContext.Provider value={{ showHeader }}>{children}</HeaderContext.Provider>;
}

export function useHeader() {
    const context = useContext(HeaderContext);
    if (context === undefined) {
        throw new Error('useHeader must be used within a HeaderProvider');
    }
    return context;
}
