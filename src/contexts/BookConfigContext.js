// src/contexts/BookConfigContext.js
"use client";

import React, { createContext, useContext } from "react";

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
