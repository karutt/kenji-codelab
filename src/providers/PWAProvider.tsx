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

        const UPDATE_PROMPT_SHOWN_KEY = 'pwa-update-prompt-shown';
        const SW_VERSION_KEY = 'pwa-sw-version';

        // セッションストレージから状態を取得
        const hasShownUpdatePrompt = sessionStorage.getItem(UPDATE_PROMPT_SHOWN_KEY) === 'true';
        const storedVersion = sessionStorage.getItem(SW_VERSION_KEY);

        // Service Workerのスクリプトファイルからバージョンを取得
        const getWorkerVersion = async () => {
            try {
                const response = await fetch('/sw.js?t=' + Date.now());
                const text = await response.text();
                const versionMatch = text.match(/const CACHE_VERSION = '([^']+)'/);
                return versionMatch ? versionMatch[1] : null;
            } catch (error) {
                console.error('Failed to get worker version:', error);
                return null;
            }
        };

        const onUpdate = async () => {
            const newVersion = await getWorkerVersion();

            // 新しいバージョンが利用可能で、まだプロンプトを表示していない場合
            if (newVersion && (newVersion !== storedVersion || !hasShownUpdatePrompt)) {
                // プロンプト表示済みフラグを設定
                sessionStorage.setItem(UPDATE_PROMPT_SHOWN_KEY, 'true');
                sessionStorage.setItem(SW_VERSION_KEY, newVersion);

                setNewContentAvailable(true);
                console.log(
                    '新しいバージョンが利用可能です。更新するにはページを再読み込みしてください。',
                );

                // 簡易な通知を表示（UIライブラリなしの場合）
                if (window.confirm('アプリの新しいバージョンがあります。今すぐ更新しますか？')) {
                    // Service Workerを強制的に更新
                    registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
                    // 更新後はフラグをクリア
                    sessionStorage.removeItem(UPDATE_PROMPT_SHOWN_KEY);
                    window.location.reload();
                } else {
                    // ユーザーが拒否した場合もバージョンを記録してこのセッション中は再表示しない
                    sessionStorage.setItem(SW_VERSION_KEY, newVersion);
                }
            }
        };

        // 初回ロード時に現在のバージョンを確認・設定
        const initializeVersion = async () => {
            const currentVersion = await getWorkerVersion();
            if (currentVersion && !storedVersion) {
                sessionStorage.setItem(SW_VERSION_KEY, currentVersion);
            }
        };

        initializeVersion();

        // 既に waiting 状態のService Workerがある場合（ページ読み込み時に更新が待機している）
        if (registration.waiting && !hasShownUpdatePrompt) {
            onUpdate();
            return;
        }

        // Service Worker の更新を監視
        const handleUpdateFound = () => {
            const newWorker = registration.installing;
            if (!newWorker) return;

            const handleStateChange = () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                    onUpdate();
                }
            };

            newWorker.addEventListener('statechange', handleStateChange);

            // クリーンアップ関数を返す
            return () => {
                newWorker.removeEventListener('statechange', handleStateChange);
            };
        };

        registration.addEventListener('updatefound', handleUpdateFound);

        // 定期的な更新チェック（30分ごと）- 開発中は無効にする
        let interval: NodeJS.Timeout | null = null;
        if (process.env.NODE_ENV === 'production') {
            interval = setInterval(
                () => {
                    registration.update().catch(err => {
                        console.error('Error checking for Service Worker updates:', err);
                    });
                },
                30 * 60 * 1000,
            );
        }

        return () => {
            if (interval) clearInterval(interval);
            registration.removeEventListener('updatefound', handleUpdateFound);
        };
    }, [registration]);

    return <>{children}</>;
}
