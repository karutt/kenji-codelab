'use client';

import React, { createContext, useContext } from 'react';

interface BookConfig {
    title: string;
    subTitle: string;
    category: string;
    description: string;
    estimatedTime: string;
    language: string;
    bookList: string[][];
    articleCount: number;
    n: number;
}

const BookConfigContext = createContext<BookConfig | undefined>(undefined);

export const BookConfigProvider: React.FC<{
    children: React.ReactNode;
    config: BookConfig;
}> = ({ children, config }) => {
    return <BookConfigContext.Provider value={config}>{children}</BookConfigContext.Provider>;
};

export const useBookConfig = (): BookConfig => {
    const context = useContext(BookConfigContext);
    if (context === undefined) {
        throw new Error('useBookConfig must be used within a BookConfigProvider');
    }
    return context;
};
