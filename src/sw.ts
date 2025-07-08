import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, NetworkFirst, Serwist } from 'serwist';

// この宣言により、serwistの型が利用可能になります
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
        caches: CacheStorage;
        addEventListener: (type: string, listener: EventListener) => void;
        location: Location;
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

            if (urlsToCache.length === 0) {
                console.warn('Service Worker: No URLs to cache');
                if (messageEvent.ports && messageEvent.ports[0]) {
                    messageEvent.ports[0].postMessage({
                        success: false,
                        error: 'No URLs to cache',
                    });
                }
                return;
            }

            let successCount = 0;
            let errorCount = 0;
            const failedUrls: string[] = [];

            // バッチでキャッシュ処理（並列度を制限）
            const batchSize = 5;
            for (let i = 0; i < urlsToCache.length; i += batchSize) {
                const batch = urlsToCache.slice(i, i + batchSize);

                const batchResults = await Promise.allSettled(
                    batch.map(async (url: string) => {
                        try {
                            // URLを正規化（絶対URLに変換）
                            const fullUrl = new URL(url, self.location.origin).href;

                            if (/\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(url)) {
                                await imageCache.add(fullUrl);
                            } else if (/\.md$/i.test(url)) {
                                await articleContentCache.add(fullUrl);
                            } else if (/\/_next\/static\//.test(url)) {
                                await staticAssetsCache.add(fullUrl);
                            } else {
                                await pagesCache.add(fullUrl);
                            }
                            console.log(`Cached: ${fullUrl}`);
                            return { url, success: true };
                        } catch (error) {
                            console.warn(`Failed to cache ${url}:`, error);
                            return { url, success: false, error };
                        }
                    }),
                );

                // バッチ結果を集計
                batchResults.forEach(result => {
                    if (result.status === 'fulfilled') {
                        if (result.value.success) {
                            successCount++;
                        } else {
                            errorCount++;
                            failedUrls.push(result.value.url);
                        }
                    } else {
                        errorCount++;
                    }
                });
            }

            console.log(
                `Service Worker: Cache installation complete - Success: ${successCount}, Errors: ${errorCount}`,
            );

            if (failedUrls.length > 0) {
                console.warn('Failed URLs:', failedUrls);
            }

            // 完了をクライアントに通知
            if (messageEvent.ports && messageEvent.ports[0]) {
                messageEvent.ports[0].postMessage({
                    success: true,
                    stats: {
                        successCount,
                        errorCount,
                        total: urlsToCache.length,
                        failedUrls: failedUrls.slice(0, 10), // 最初の10個のみ
                    },
                });
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
