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

    // PWA機能の初期化（一度だけ実行）
    useEffect(() => {
        if (isPWAInitialized) return;

        const initializePWA = async () => {
            isPWAInitialized = true;

            // 開発時のパフォーマンス最適化のため、Service Workerの登録を遅延
            const shouldDelayServiceWorker = process.env.NODE_ENV === 'development';
            
            if ('serviceWorker' in navigator) {
                try {
                    if (shouldDelayServiceWorker) {
                        // 開発時は1秒遅延してService Workerの影響を最小化
                        await new Promise(resolve => setTimeout(resolve, 1000));
                    }

                    // Service Worker の状態確認（ログなし）
                    await navigator.serviceWorker.getRegistration();

                    // IndexedDBを初期化（一度だけ、ログ削除）
                    if (!isDBInitialized) {
                        const db = getDB();
                        await db.init();
                        isDBInitialized = true;
                    }

                    // 開発時のみログ出力
                    if (process.env.NODE_ENV === 'development') {
                        console.log('PWA features initialized');
                    }
                } catch (error) {
                    console.error('Failed to initialize PWA features:', error);
                    // エラーが発生した場合は次回再試行できるようにする
                    isPWAInitialized = false;
                }
            }
        };

        initializePWA();
    }, []); // 空の依存配列で一度だけ実行

    return <>{children}</>;
}
