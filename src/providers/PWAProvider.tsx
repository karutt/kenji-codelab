'use client';

import { useEffect } from 'react';

import { useOfflineState } from '@/hooks/useOfflineState';
import { getDB } from '@/utils/storage/indexedDB';

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { isOnline } = useOfflineState();

    // オンライン/オフライン状態の通知
    useEffect(() => {
        if (isOnline !== null) {
            console.log(isOnline ? 'オンラインに戻りました' : 'オフラインになりました');
        }
    }, [isOnline]);

    // PWA機能の初期化
    useEffect(() => {
        // Service Worker の登録チェック
        const initializePWA = async () => {
            if ('serviceWorker' in navigator) {
                try {
                    // Serwistが自動的にService Workerを管理するため、手動登録は不要
                    console.log('Service Worker is supported');

                    // IndexedDBを初期化
                    const db = getDB();
                    await db.init();
                    console.log('IndexedDB initialized');

                    console.log('PWA features are ready');
                } catch (error) {
                    console.error('Failed to initialize PWA features:', error);
                }
            }
        };

        initializePWA();
    }, []);

    return <>{children}</>;
}
