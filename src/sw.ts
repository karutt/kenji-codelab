import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, NetworkFirst, Serwist } from 'serwist';

// この宣言により、serwistの型が利用可能になります
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
        caches: CacheStorage;
        addEventListener: (type: string, listener: EventListener) => void;
    }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // すべての画像（より包括的）
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.destination === 'image' ||
                    /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(request.url)
                );
            },
            handler: new CacheFirst({
                cacheName: 'images',
            }),
        },

        // 記事画像（ローカル）- より明確なパターン
        {
            matcher: ({ request }: { request: Request }) => {
                return /\/books\/.*\/images\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i.test(request.url);
            },
            handler: new CacheFirst({
                cacheName: 'article-images',
            }),
        },

        // 記事コンテンツ（Markdownファイル）
        {
            matcher: ({ request }: { request: Request }) => {
                return /\/books\/.*\/md\/.*\.md$/i.test(request.url);
            },
            handler: new NetworkFirst({
                cacheName: 'article-content',
                networkTimeoutSeconds: 3,
            }),
        },

        // API レスポンス
        {
            matcher: ({ request }: { request: Request }) => {
                return request.url.includes('/api/');
            },
            handler: new NetworkFirst({
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
            }),
        },

        // フォント
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.destination === 'font' ||
                    /\.(woff|woff2|ttf|otf|eot)$/i.test(request.url)
                );
            },
            handler: new CacheFirst({
                cacheName: 'fonts',
            }),
        },

        // 静的アセット（JS, CSS）
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.destination === 'script' ||
                    request.destination === 'style' ||
                    /\/_next\/static\//.test(request.url)
                );
            },
            handler: new CacheFirst({
                cacheName: 'static-assets',
            }),
        },

        // HTML ページ（ナビゲーション）
        {
            matcher: ({ request }: { request: Request }) => request.mode === 'navigate',
            handler: new NetworkFirst({
                cacheName: 'pages',
                networkTimeoutSeconds: 3,
            }),
        },
    ],
});

serwist.addEventListeners();

// カスタムメッセージハンドラー
self.addEventListener('message', async (event: Event) => {
    const messageEvent = event as MessageEvent;

    if (messageEvent.data && messageEvent.data.type === 'CACHE_URLS') {
        const { urlsToCache } = messageEvent.data.payload;

        try {
            // 複数のキャッシュに分けて保存
            const imageCache = await self.caches.open('images');
            const articleContentCache = await self.caches.open('article-content');
            const pagesCache = await self.caches.open('pages');
            const staticAssetsCache = await self.caches.open('static-assets');

            console.log(`Service Worker: Caching ${urlsToCache.length} URLs`);

            // URLを適切なキャッシュに分類して保存
            for (const url of urlsToCache) {
                try {
                    if (/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url)) {
                        await imageCache.add(url);
                    } else if (/\.md$/i.test(url)) {
                        await articleContentCache.add(url);
                    } else if (/\/_next\/static\//.test(url)) {
                        await staticAssetsCache.add(url);
                    } else {
                        await pagesCache.add(url);
                    }
                } catch (error) {
                    // 個別のURLキャッシュエラーは無視（404等）
                    console.warn(`Failed to cache ${url}:`, error);
                }
            }

            console.log('Service Worker: Cache installation complete');

            // 完了をクライアントに通知
            if (messageEvent.ports && messageEvent.ports[0]) {
                messageEvent.ports[0].postMessage({ success: true });
            }
        } catch (error) {
            console.error('Service Worker: Cache installation failed:', error);
            if (messageEvent.ports && messageEvent.ports[0]) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                messageEvent.ports[0].postMessage({ success: false, error: errorMessage });
            }
        }
    }
});
