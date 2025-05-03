// src/contexts/BookConfigContext.js
"use client";

import React, { createContext, useContext } from "react";

// React クライアントコンテキストのみを定義します。
// サーバーサイドの fs 読み込みは app/[bookSlug]/layout.js 側で行い、
// ここでは受け取った config をコンテキストとして提供します。
const BookConfigContext = createContext(null);

/**
 * コンテキストプロバイダー
 * @param {{ children: React.ReactNode, config: object }} props
 */
export function BookConfigProvider({ children, config }) {
    if (!config) {
        throw new Error("BookConfigProvider requires a `config` prop");
    }
    return <BookConfigContext.Provider value={config}>{children}</BookConfigContext.Provider>;
}

/**
 * コンテキスト値を取得するカスタムフック
 */
export function useBookConfig() {
    const context = useContext(BookConfigContext);
    if (!context) {
        throw new Error("useBookConfig must be used within a BookConfigProvider");
    }
    return context;
}
