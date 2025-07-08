'use client';

import { useEffect } from 'react';

import { useServiceWorker } from '@/hooks/useServiceWorker';
import { getDB } from '@/utils/storage/indexedDB';

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { isSupported, isRegistered } = useServiceWorker();

    useEffect(() => {
        if (isSupported && isRegistered) {
            console.log('PWA features are ready');

            // IndexedDBを初期化
            const initDB = async () => {
                try {
                    const db = getDB();
                    await db.init();
                    console.log('IndexedDB initialized');
                } catch (error) {
                    console.error('Failed to initialize IndexedDB:', error);
                }
            };

            initDB();
        }
    }, [isSupported, isRegistered]);

    return <>{children}</>;
}
