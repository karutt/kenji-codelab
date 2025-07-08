import { IDBPDatabase, openDB } from 'idb';

export interface CachedArticle {
    id: string;
    bookSlug: string;
    articleSlug: string;
    title: string;
    content: string;
    data: Record<string, unknown>;
    card: string;
    problem: string;
    neighborsPage: {
        prePage: { title: string; link: string } | null;
        nextPage: { title: string; link: string } | null;
    };
    images: string[];
    cachedAt: number;
}

export interface CachedImage {
    url: string;
    blob: Blob;
    mimeType: string;
    cachedAt: number;
}

export interface CachedBook {
    bookSlug: string;
    title: string;
    articles: string[];
    cachedAt: number;
}

const DB_NAME = 'kenji-codelab-pwa';
const DB_VERSION = 1;

export class IndexedDBStorage {
    private db: IDBPDatabase | null = null;

    async init(): Promise<void> {
        if (this.db) return;

        this.db = await openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                // 記事ストア
                if (!db.objectStoreNames.contains('articles')) {
                    const articleStore = db.createObjectStore('articles', { keyPath: 'id' });
                    articleStore.createIndex('bookSlug', 'bookSlug');
                    articleStore.createIndex('articleSlug', 'articleSlug');
                    articleStore.createIndex('cachedAt', 'cachedAt');
                }

                // 画像ストア
                if (!db.objectStoreNames.contains('images')) {
                    const imageStore = db.createObjectStore('images', { keyPath: 'url' });
                    imageStore.createIndex('cachedAt', 'cachedAt');
                }

                // 書籍ストア
                if (!db.objectStoreNames.contains('books')) {
                    const bookStore = db.createObjectStore('books', { keyPath: 'bookSlug' });
                    bookStore.createIndex('cachedAt', 'cachedAt');
                }
            },
        });
    }

    // 記事関連
    async saveArticle(article: CachedArticle): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.put('articles', article);
    }

    async getArticle(bookSlug: string, articleSlug: string): Promise<CachedArticle | null> {
        if (!this.db) await this.init();

        const tx = this.db!.transaction('articles', 'readonly');
        const store = tx.objectStore('articles');
        const index = store.index('bookSlug');

        const articles = await index.getAll(bookSlug);
        return articles.find(a => a.articleSlug === articleSlug) || null;
    }

    async getArticlesByBook(bookSlug: string): Promise<CachedArticle[]> {
        if (!this.db) await this.init();

        const tx = this.db!.transaction('articles', 'readonly');
        const store = tx.objectStore('articles');
        const index = store.index('bookSlug');

        return await index.getAll(bookSlug);
    }

    async deleteArticle(bookSlug: string, articleSlug: string): Promise<void> {
        if (!this.db) await this.init();

        const article = await this.getArticle(bookSlug, articleSlug);
        if (article) {
            await this.db!.delete('articles', article.id);
        }
    }

    // 画像関連
    async saveImage(image: CachedImage): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.put('images', image);
    }

    async getImage(url: string): Promise<CachedImage | null> {
        if (!this.db) await this.init();
        return (await this.db!.get('images', url)) || null;
    }

    async deleteImage(url: string): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.delete('images', url);
    }

    // 書籍関連
    async saveBook(book: CachedBook): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.put('books', book);
    }

    async getBook(bookSlug: string): Promise<CachedBook | null> {
        if (!this.db) await this.init();
        return (await this.db!.get('books', bookSlug)) || null;
    }

    async getAllBooks(): Promise<CachedBook[]> {
        if (!this.db) await this.init();
        return await this.db!.getAll('books');
    }

    async deleteBook(bookSlug: string): Promise<void> {
        if (!this.db) await this.init();
        await this.db!.delete('books', bookSlug);
    }

    // ユーティリティ
    async clearAll(): Promise<void> {
        if (!this.db) await this.init();

        const tx = this.db!.transaction(['articles', 'images', 'books'], 'readwrite');
        await Promise.all([
            tx.objectStore('articles').clear(),
            tx.objectStore('images').clear(),
            tx.objectStore('books').clear(),
        ]);
    }

    async getStorageUsage(): Promise<{ articles: number; images: number; books: number }> {
        if (!this.db) await this.init();

        const [articles, images, books] = await Promise.all([
            this.db!.count('articles'),
            this.db!.count('images'),
            this.db!.count('books'),
        ]);

        return { articles, images, books };
    }

    // 古いキャッシュの削除（30日以上）
    async cleanupOldCache(): Promise<void> {
        if (!this.db) await this.init();

        const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

        const tx = this.db!.transaction(['articles', 'images', 'books'], 'readwrite');

        // 古い記事を削除
        const articleStore = tx.objectStore('articles');
        const articleIndex = articleStore.index('cachedAt');
        let articleCursor = await articleIndex.openCursor(IDBKeyRange.upperBound(thirtyDaysAgo));

        while (articleCursor) {
            await articleCursor.delete();
            articleCursor = await articleCursor.continue();
        }

        // 古い画像を削除
        const imageStore = tx.objectStore('images');
        const imageIndex = imageStore.index('cachedAt');
        let imageCursor = await imageIndex.openCursor(IDBKeyRange.upperBound(thirtyDaysAgo));

        while (imageCursor) {
            await imageCursor.delete();
            imageCursor = await imageCursor.continue();
        }

        // 古い書籍情報を削除
        const bookStore = tx.objectStore('books');
        const bookIndex = bookStore.index('cachedAt');
        let bookCursor = await bookIndex.openCursor(IDBKeyRange.upperBound(thirtyDaysAgo));

        while (bookCursor) {
            await bookCursor.delete();
            bookCursor = await bookCursor.continue();
        }
    }
}

// シングルトンインスタンス
let dbInstance: IndexedDBStorage | null = null;

export const getDB = (): IndexedDBStorage => {
    if (!dbInstance) {
        dbInstance = new IndexedDBStorage();
    }
    return dbInstance;
};
