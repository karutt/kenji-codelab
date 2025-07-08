'use client';

import { useEffect, useState } from 'react';

// Navigator Connection API の型定義
interface NetworkInformation extends EventTarget {
    effectiveType: string;
    addEventListener(type: 'change', listener: () => void): void;
    removeEventListener(type: 'change', listener: () => void): void;
}

interface NavigatorWithConnection extends Navigator {
    connection?: NetworkInformation;
    mozConnection?: NetworkInformation;
    webkitConnection?: NetworkInformation;
}

export interface OfflineState {
    isOnline: boolean;
    isOffline: boolean;
    lastOnlineAt: number | null;
    connectionType: string | null;
}

export const useOfflineState = () => {
    const [state, setState] = useState<OfflineState>({
        isOnline: typeof window !== 'undefined' ? window.navigator.onLine : true,
        isOffline: typeof window !== 'undefined' ? !window.navigator.onLine : false,
        lastOnlineAt: null,
        connectionType: null,
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const updateOnlineStatus = () => {
            const isOnline = window.navigator.onLine;
            const now = Date.now();

            setState(prev => ({
                ...prev,
                isOnline,
                isOffline: !isOnline,
                lastOnlineAt: isOnline ? now : prev.lastOnlineAt,
            }));
        };

        const updateConnectionType = () => {
            const nav = navigator as NavigatorWithConnection;
            const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

            setState(prev => ({
                ...prev,
                connectionType: connection ? connection.effectiveType : null,
            }));
        };

        // 初期状態を設定
        updateOnlineStatus();
        updateConnectionType();

        // イベントリスナーを追加
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);

        const nav = navigator as NavigatorWithConnection;
        const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
        if (connection) {
            connection.addEventListener('change', updateConnectionType);
        }

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);

            if (connection) {
                connection.removeEventListener('change', updateConnectionType);
            }
        };
    }, []);

    return state;
};

// ユーティリティ関数
export const useOnlineStatus = () => {
    const { isOnline } = useOfflineState();
    return isOnline;
};

export const useOfflineStatus = () => {
    const { isOffline } = useOfflineState();
    return isOffline;
};

// 接続品質の判定
export const useConnectionQuality = () => {
    const { connectionType } = useOfflineState();

    const getQuality = (type: string | null): 'good' | 'fair' | 'poor' | 'unknown' => {
        if (!type) return 'unknown';

        switch (type) {
            case '4g':
                return 'good';
            case '3g':
                return 'fair';
            case '2g':
            case 'slow-2g':
                return 'poor';
            default:
                return 'unknown';
        }
    };

    return {
        connectionType,
        quality: getQuality(connectionType),
    };
};
