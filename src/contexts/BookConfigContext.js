// src/contexts/BookConfigContext.js
"use client";

import { createContext, useContext } from "react";

/**
 * Context to provide book-specific configuration.
 */
export const BookConfigContext = createContext(null);

/**
 * Provider component to wrap parts of the app that need access to book config.
 */
export function BookConfigProvider({ config, children }) {
    return <BookConfigContext.Provider value={config}>{children}</BookConfigContext.Provider>;
}

/**
 * useBookConfig:
 * Hook to consume the book config in client components.
 */
export function useBookConfig() {
    const context = useContext(BookConfigContext);
    if (!context) {
        throw new Error("useBookConfig must be used within a BookConfigProvider");
    }
    return context;
}
