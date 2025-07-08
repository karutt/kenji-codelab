'use client';

import { useEffect, useState } from 'react';

export function useServiceWorker() {
    const [isSupported, setIsSupported] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
            setIsSupported(true);
            console.log('Service Worker is supported');
            registerServiceWorker();
        } else {
            console.log('Service Worker is not supported');
        }
    }, []);

    async function registerServiceWorker() {
        try {
            console.log('Attempting to register Service Worker...');
            const reg = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            });
            setRegistration(reg);
            setIsRegistered(true);
            console.log('Service Worker registered successfully:', reg);

            // 登録状況の確認
            if (reg.installing) {
                console.log('Service Worker installing');
            } else if (reg.waiting) {
                console.log('Service Worker waiting');
            } else if (reg.active) {
                console.log('Service Worker active');
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }

    return { isSupported, isRegistered, registration };
}
