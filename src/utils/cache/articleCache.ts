import { CachedArticle, CachedBook, CachedImage, getDB } from '@/utils/storage/indexedDB';

// APIヘルパー関数
const fetchArticles = async (bookSlug: string): Promise<{ slug: string }[]> => {
    const response = await fetch(`/api/articles?bookSlug=${bookSlug}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch articles: ${response.statusText}`);
    }
    return response.json();
};

const fetchArticleBySlug = async (
    bookSlug: string,
    articleSlug: string,
): Promise<{
    content: string;
    data: { title?: string; [key: string]: unknown };
    card: string;
    problem: string;
    neighborsPage: {
        prePage: { title: string; link: string } | null;
        nextPage: { title: string; link: string } | null;
    };
}> => {
    const response = await fetch(`/api/articles?bookSlug=${bookSlug}&articleSlug=${articleSlug}`);
    if (!response.ok) {
        throw new Error(`Failed to fetch article: ${response.statusText}`);
    }
    return response.json();
};

// 画像URLを抽出する関数
export const extractImageUrls = (content: string): string[] => {
    const imageUrls: string[] = [];

    // Markdown画像パターン: ![alt](url)
    const markdownImageRegex = /!\[.*?\]\(([^)]+)\)/g;
    let match;

    while ((match = markdownImageRegex.exec(content)) !== null) {
        imageUrls.push(match[1]);
    }

    // HTML imgタグパターン: <img src="url">
    const htmlImageRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/g;

    while ((match = htmlImageRegex.exec(content)) !== null) {
        imageUrls.push(match[1]);
    }

    // SVGファイルの参照パターン
    const svgRegex = /['"]([^'"]*\.svg)['"]|src=["']([^"']*\.svg)["']/g;
    
    while ((match = svgRegex.exec(content)) !== null) {
        const url = match[1] || match[2];
        if (url) {
            imageUrls.push(url);
        }
    }

    // 重複を除去し、相対パスを絶対パスに変換
    return [...new Set(imageUrls)].map(url => {
        if (url.startsWith('http')) {
            return url;
        }
        // 相対パスの場合は絶対パスに変換
        return url.startsWith('/') ? url : `/${url}`;
    });
};

// 画像をフェッチしてキャッシュする関数
export const cacheImage = async (url: string): Promise<boolean> => {
    try {
        const db = getDB();

        // 既にキャッシュされているかチェック
        const existingImage = await db.getImage(url);
        if (existingImage) {
            return true;
        }

        // 画像をフェッチ
        const response = await fetch(url);
        if (!response.ok) {
            console.warn(`Failed to fetch image: ${url}`);
            return false;
        }

        const blob = await response.blob();
        const cachedImage: CachedImage = {
            url,
            blob,
            mimeType: response.headers.get('content-type') || 'image/jpeg',
            cachedAt: Date.now(),
        };

        await db.saveImage(cachedImage);
        return true;
    } catch (error) {
        console.error(`Error caching image ${url}:`, error);
        return false;
    }
};

// 複数の画像を並列でキャッシュする関数
export const cacheImages = async (urls: string[]): Promise<{ success: number; failed: number }> => {
    const results = await Promise.allSettled(urls.map(cacheImage));

    const success = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
    const failed = results.length - success;

    return { success, failed };
};

// 単一記事をキャッシュする関数
export const cacheArticle = async (bookSlug: string, articleSlug: string): Promise<boolean> => {
    try {
        const db = getDB();

        // 記事データを取得
        const articleData = await fetchArticleBySlug(bookSlug, articleSlug);
        const { content, data, card, problem, neighborsPage } = articleData;

        // 画像URLを抽出
        const allContent = [content, card, problem].join('\n');
        const imageUrls = extractImageUrls(allContent);

        // 記事をキャッシュ
        const cachedArticle: CachedArticle = {
            id: `${bookSlug}-${articleSlug}`,
            bookSlug,
            articleSlug,
            title: data.title || articleSlug,
            content,
            data,
            card,
            problem,
            neighborsPage,
            images: imageUrls,
            cachedAt: Date.now(),
        };

        await db.saveArticle(cachedArticle);

        // 画像をキャッシュ（バックグラウンドで実行）
        if (imageUrls.length > 0) {
            cacheImages(imageUrls).then(({ success, failed }) => {
                console.log(
                    `Images cached for ${bookSlug}/${articleSlug}: ${success} success, ${failed} failed`,
                );
            });
        }

        return true;
    } catch (error) {
        console.error(`Error caching article ${bookSlug}/${articleSlug}:`, error);
        return false;
    }
};

// 書籍の全記事をキャッシュする関数
export const cacheBookArticles = async (
    bookSlug: string,
): Promise<{ success: number; failed: number; total: number }> => {
    try {
        const db = getDB();

        // 書籍の全記事を取得
        const articles = await fetchArticles(bookSlug);
        const total = articles.length;

        if (total === 0) {
            return { success: 0, failed: 0, total: 0 };
        }

        // 全記事を並列でキャッシュ
        const results = await Promise.allSettled(
            articles.map(({ slug }) => cacheArticle(bookSlug, slug)),
        );

        const success = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
        const failed = results.length - success;

        // 書籍情報をキャッシュ
        const cachedBook: CachedBook = {
            bookSlug,
            title: bookSlug, // 実際の書籍タイトルが必要な場合は別途取得
            articles: articles.map(a => a.slug),
            cachedAt: Date.now(),
        };

        await db.saveBook(cachedBook);

        return { success, failed, total };
    } catch (error) {
        console.error(`Error caching book ${bookSlug}:`, error);
        return { success: 0, failed: 0, total: 0 };
    }
};

// 利用可能な全書籍を取得する関数
export const getAvailableBooks = async (): Promise<string[]> => {
    try {
        const response = await fetch('/api/articles?getBooks=true');
        if (!response.ok) {
            throw new Error(`Failed to fetch books: ${response.statusText}`);
        }
        return response.json();
    } catch (error) {
        console.error('Error getting available books:', error);
        return [];
    }
};

// 全書籍をキャッシュする関数
export const cacheAllBooks = async (): Promise<{
    [bookSlug: string]: { success: number; failed: number; total: number };
}> => {
    const availableBooks = await getAvailableBooks();
    const results: { [bookSlug: string]: { success: number; failed: number; total: number } } = {};

    for (const bookSlug of availableBooks) {
        console.log(`Starting cache for book: ${bookSlug}`);
        results[bookSlug] = await cacheBookArticles(bookSlug);
        console.log(`Completed cache for book: ${bookSlug}`, results[bookSlug]);
    }

    return results;
};

// キャッシュされた記事を取得する関数
export const getCachedArticle = async (
    bookSlug: string,
    articleSlug: string,
): Promise<CachedArticle | null> => {
    try {
        const db = getDB();
        return await db.getArticle(bookSlug, articleSlug);
    } catch (error) {
        console.error(`Error getting cached article ${bookSlug}/${articleSlug}:`, error);
        return null;
    }
};

// キャッシュされた画像を取得する関数
export const getCachedImage = async (url: string): Promise<string | null> => {
    try {
        const db = getDB();
        const cachedImage = await db.getImage(url);

        if (cachedImage) {
            return URL.createObjectURL(cachedImage.blob);
        }

        return null;
    } catch (error) {
        console.error(`Error getting cached image ${url}:`, error);
        return null;
    }
};

// キャッシュ統計を取得する関数
export const getCacheStats = async (): Promise<{
    articles: number;
    images: number;
    books: number;
}> => {
    try {
        const db = getDB();
        return await db.getStorageUsage();
    } catch (error) {
        console.error('Error getting cache stats:', error);
        return { articles: 0, images: 0, books: 0 };
    }
};

// キャッシュをクリアする関数
export const clearCache = async (): Promise<void> => {
    try {
        const db = getDB();
        await db.clearAll();
    } catch (error) {
        console.error('Error clearing cache:', error);
    }
};

// 古いキャッシュを削除する関数
export const cleanupOldCache = async (): Promise<void> => {
    try {
        const db = getDB();
        await db.cleanupOldCache();
    } catch (error) {
        console.error('Error cleaning up old cache:', error);
    }
};

// 静的アセットのプリキャッシュ機能
export const cacheStaticAssets = async (): Promise<{ success: number; failed: number }> => {
  const commonAssets = [
    '/svg/logo.svg',
    '/svg/logo_text.svg',
    '/svg/logo_text_v2.svg',
    '/svg/mail.svg',
    '/svg/line.svg',
    '/svg/next.svg',
    '/svg/book_list_bg.svg',
    '/svg/book_list_bg2.svg',
    '/svg/global_chat.svg',
    '/svg/shark_shape.svg',
    '/svg/red_shape.svg',
    '/svg/white_shape.svg',
    '/svg/x.svg',
    '/favicon.ico',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    '/icons/icon0.svg',
    '/icons/icon1.png',
  ];

  const results = await Promise.allSettled(
    commonAssets.map(url => cacheImage(url))
  );

  const success = results.filter(r => r.status === 'fulfilled' && r.value === true).length;
  const failed = results.length - success;

  return { success, failed };
};
