'use client';

import { useEffect, useRef } from 'react';

import { useOfflineState } from '@/hooks/useOfflineState';
import { getDB } from '@/utils/storage/indexedDB';

// グローバル状態で初期化を一度だけ行うようにする
let isPWAInitialized = false;
let isDBInitialized = false;

export function PWAProvider({ children }: { children: React.ReactNode }) {
    const { isOnline } = useOfflineState();
    const previousOnlineState = useRef<boolean | null>(null);

    // オンライン/オフライン状態の通知（実際に変化した時のみ）
    useEffect(() => {
        if (
            isOnline !== null &&
            previousOnlineState.current !== null &&
            previousOnlineState.current !== isOnline
        ) {
            console.log(isOnline ? 'オンラインに戻りました' : 'オフラインになりました');
        }
        previousOnlineState.current = isOnline;
    }, [isOnline]);

    // PWA機能の初期化（最小限、オフライン時のみ必要）
    useEffect(() => {
        if (isPWAInitialized) return;

        const initializePWA = async () => {
            isPWAInitialized = true;

            // オンライン時はPWA機能を最小限に
            if ('serviceWorker' in navigator) {
                try {
                    // Service Workerは自動登録されるので確認のみ
                    await navigator.serviceWorker.getRegistration();

                    // IndexedDBを初期化（一度だけ）
                    if (!isDBInitialized) {
                        const db = getDB();
                        await db.init();
                        isDBInitialized = true;
                    }

                    // 開発時のみログ出力
                    if (process.env.NODE_ENV === 'development') {
                        console.log('PWA features initialized (offline-only mode)');
                    }
                } catch (error) {
                    console.error('Failed to initialize PWA features:', error);
                    // エラーが発生した場合は次回再試行できるようにする
                    isPWAInitialized = false;
                }
            }
        };

        // PWA初期化の遅延を削除（オフライン専用なので影響最小限）
        initializePWA();
    }, []); // 空の依存配列で一度だけ実行

    return <>{children}</>;
}
