'use client';

import { useEffect } from 'react';

import { useServiceWorker } from '@/hooks/useServiceWorker';

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { isSupported, isRegistered } = useServiceWorker();

    useEffect(() => {
        if (isSupported && isRegistered) {
            console.log('PWA features are ready');
        }
    }, [isSupported, isRegistered]);

    return <>{children}</>;
}
