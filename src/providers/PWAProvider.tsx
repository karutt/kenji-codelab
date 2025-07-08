'use client';

import { useEffect, useState } from 'react';

import { useOfflineState } from '@/hooks/useOfflineState';
import { useServiceWorker } from '@/hooks/useServiceWorker';
import { getDB } from '@/utils/storage/indexedDB';

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { isSupported, isRegistered, registration } = useServiceWorker();
    const { isOnline } = useOfflineState();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [newContentAvailable, setNewContentAvailable] = useState(false);

    // Service Worker とオフライン機能の初期化
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

    // オンライン/オフライン状態の通知
    useEffect(() => {
        if (isOnline !== null) {
            console.log(isOnline ? 'オンラインに戻りました' : 'オフラインになりました');
        }
    }, [isOnline]);

    // Service Worker の更新チェック
    useEffect(() => {
        if (!registration) return;

        const onUpdate = () => {
            setNewContentAvailable(true);
            console.log(
                '新しいバージョンが利用可能です。更新するにはページを再読み込みしてください。',
            );

            // 簡易な通知を表示（UIライブラリなしの場合）
            if (window.confirm('アプリの新しいバージョンがあります。今すぐ更新しますか？')) {
                window.location.reload();
            }
        };

        // Service Worker の更新を監視
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    onUpdate();
                }
            });
        });

        // 定期的な更新チェック（30分ごと）
        const interval = setInterval(
            () => {
                registration.update().catch(err => {
                    console.error('Error checking for Service Worker updates:', err);
                });
            },
            30 * 60 * 1000,
        );

        return () => clearInterval(interval);
    }, [registration]);

    return <>{children}</>;
}
