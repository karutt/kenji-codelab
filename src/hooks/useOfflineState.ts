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

// グローバル状態管理でイベントリスナーの重複を防ぐ
let globalState: OfflineState = {
    isOnline: typeof window !== 'undefined' ? window.navigator.onLine : true,
    isOffline: typeof window !== 'undefined' ? !window.navigator.onLine : false,
    lastOnlineAt: null,
    connectionType: null,
};

let isInitialized = false;
const listeners = new Set<(state: OfflineState) => void>();

const initializeOfflineDetection = () => {
    if (isInitialized || typeof window === 'undefined') return;

    const updateOnlineStatus = () => {
        const isOnline = window.navigator.onLine;
        const now = Date.now();

        globalState = {
            ...globalState,
            isOnline,
            isOffline: !isOnline,
            lastOnlineAt: isOnline ? now : globalState.lastOnlineAt,
        };

        // 全てのリスナーに変更を通知
        listeners.forEach(listener => listener(globalState));
    };

    const updateConnectionType = () => {
        const nav = navigator as NavigatorWithConnection;
        const connection = nav.connection || nav.mozConnection || nav.webkitConnection;

        globalState = {
            ...globalState,
            connectionType: connection ? connection.effectiveType : null,
        };

        listeners.forEach(listener => listener(globalState));
    };

    // 初期状態を設定
    updateOnlineStatus();
    updateConnectionType();

    // イベントリスナーを追加（グローバルに一度だけ）
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    const nav = navigator as NavigatorWithConnection;
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (connection) {
        connection.addEventListener('change', updateConnectionType);
    }

    isInitialized = true;
};

export const useOfflineState = () => {
    const [state, setState] = useState<OfflineState>(globalState);

    useEffect(() => {
        // グローバル初期化
        initializeOfflineDetection();

        // リスナーを追加
        listeners.add(setState);

        // 現在の状態を設定
        setState(globalState);

        return () => {
            // リスナーを削除
            listeners.delete(setState);
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
