'use client';

import { useEffect, useState } from 'react';

import { useOfflineState } from '@/hooks/useOfflineState';
import {
    cacheAllBooks,
    cacheBookArticles,
    cacheStaticAssets,
    cleanupOldCache,
    getCacheStats,
} from '@/utils/cache/articleCache';

export interface PreloadProgress {
    isLoading: boolean;
    currentBook: string | null;
    completedBooks: string[];
    totalBooks: number;
    completedArticles: number;
    totalArticles: number;
    errors: string[];
}

export interface CacheStats {
    articles: number;
    images: number;
    books: number;
}

export const usePWAPreload = () => {
    const [progress, setProgress] = useState<PreloadProgress>({
        isLoading: false,
        currentBook: null,
        completedBooks: [],
        totalBooks: 0,
        completedArticles: 0,
        totalArticles: 0,
        errors: [],
    });

    const [cacheStats, setCacheStats] = useState<CacheStats>({
        articles: 0,
        images: 0,
        books: 0,
    });

    const { isOnline } = useOfflineState();

    // キャッシュ統計を更新
    const updateCacheStats = async () => {
        try {
            const stats = await getCacheStats();
            setCacheStats(stats);
        } catch (error) {
            console.error('Error updating cache stats:', error);
        }
    };

    // 全書籍をプリロード
    const preloadAllBooks = async () => {
        if (!isOnline) {
            console.warn('Cannot preload books while offline');
            return;
        }

        setProgress(prev => ({ ...prev, isLoading: true, errors: [] }));

        try {
            const results = await cacheAllBooks();
            const bookSlugs = Object.keys(results);

            let totalArticles = 0;
            let completedArticles = 0;
            const errors: string[] = [];

            for (const bookSlug of bookSlugs) {
                const result = results[bookSlug];
                totalArticles += result.total;
                completedArticles += result.success;

                if (result.failed > 0) {
                    errors.push(`${bookSlug}: ${result.failed} articles failed to cache`);
                }
            }

            setProgress({
                isLoading: false,
                currentBook: null,
                completedBooks: bookSlugs,
                totalBooks: bookSlugs.length,
                completedArticles,
                totalArticles,
                errors,
            });

            await updateCacheStats();
        } catch (error) {
            setProgress(prev => ({
                ...prev,
                isLoading: false,
                errors: [...prev.errors, `Failed to preload books: ${error}`],
            }));
        }
    };

    // 特定の書籍をプリロード
    const preloadBook = async (bookSlug: string) => {
        if (!isOnline) {
            console.warn('Cannot preload book while offline');
            return;
        }

        setProgress(prev => ({
            ...prev,
            isLoading: true,
            currentBook: bookSlug,
            errors: [],
        }));

        try {
            const result = await cacheBookArticles(bookSlug);

            setProgress(prev => ({
                ...prev,
                isLoading: false,
                currentBook: null,
                completedBooks: [...prev.completedBooks, bookSlug],
                totalBooks: prev.totalBooks + 1,
                completedArticles: prev.completedArticles + result.success,
                totalArticles: prev.totalArticles + result.total,
                errors:
                    result.failed > 0
                        ? [...prev.errors, `${bookSlug}: ${result.failed} articles failed to cache`]
                        : prev.errors,
            }));

            await updateCacheStats();
        } catch (error) {
            setProgress(prev => ({
                ...prev,
                isLoading: false,
                currentBook: null,
                errors: [...prev.errors, `Failed to preload book ${bookSlug}: ${error}`],
            }));
        }
    };

    // ページをプリロード（Service WorkerでHTMLとチャンクをキャッシュ）
    const preloadPages = async () => {
        if (!isOnline) {
            console.warn('Cannot preload pages while offline');
            return;
        }

        setProgress(prev => ({ ...prev, isLoading: true, errors: [] }));

        try {
            // 利用可能な書籍を取得
            const response = await fetch('/api/articles?getBooks=true');
            if (!response.ok) {
                throw new Error('Failed to fetch books');
            }
            const books: string[] = await response.json();

            const errors: string[] = [];
            let successCount = 0;

            // 各書籍のメインページをプリロード
            for (const bookSlug of books) {
                try {
                    setProgress(prev => ({ ...prev, currentBook: bookSlug }));

                    // 書籍のページを訪問（Service Workerでキャッシュされる）
                    const pageResponse = await fetch(`/books/${bookSlug}`, {
                        method: 'GET',
                        headers: {
                            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                        },
                    });

                    if (pageResponse.ok) {
                        successCount++;
                        console.log(`Successfully preloaded page: /books/${bookSlug}`);
                    } else {
                        errors.push(
                            `Failed to preload page /books/${bookSlug}: ${pageResponse.statusText}`,
                        );
                    }
                } catch (error) {
                    errors.push(`Error preloading page /books/${bookSlug}: ${error}`);
                    console.error(`Error preloading page /books/${bookSlug}:`, error);
                }
            }

            setProgress(prev => ({
                ...prev,
                isLoading: false,
                currentBook: null,
                errors,
            }));

            console.log(`Pages preloaded: ${successCount}/${books.length}`);
        } catch (error) {
            console.error('Error preloading pages:', error);
            setProgress(prev => ({
                ...prev,
                isLoading: false,
                currentBook: null,
                errors: [
                    ...prev.errors,
                    `Error preloading pages: ${error instanceof Error ? error.message : 'Unknown error'}`,
                ],
            }));
        }
    };

    // 静的アセットをプリロード
    const preloadStaticAssets = async () => {
        if (!isOnline) {
            console.warn('Cannot preload static assets while offline');
            return;
        }

        setProgress(prev => ({ ...prev, isLoading: true, errors: [] }));

        try {
            const result = await cacheStaticAssets();

            setProgress(prev => ({
                ...prev,
                isLoading: false,
                errors: result.failed > 0 ? [`Failed to cache ${result.failed} static assets`] : [],
            }));

            await updateCacheStats();
        } catch (error) {
            console.error('Error preloading static assets:', error);
            setProgress(prev => ({
                ...prev,
                isLoading: false,
                errors: [
                    ...prev.errors,
                    `Error preloading static assets: ${error instanceof Error ? error.message : 'Unknown error'}`,
                ],
            }));
        }
    };

    // 古いキャッシュを削除
    const cleanup = async () => {
        try {
            await cleanupOldCache();
            await updateCacheStats();
        } catch (error) {
            console.error('Error during cleanup:', error);
        }
    };

    // 初期化時にキャッシュ統計を取得
    useEffect(() => {
        updateCacheStats();
    }, []);

    return {
        progress,
        cacheStats,
        preloadAllBooks,
        preloadBook,
        preloadPages,
        preloadStaticAssets,
        cleanup,
        updateCacheStats,
        isOnline,
    };
};
