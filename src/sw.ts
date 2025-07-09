import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { Serwist } from 'serwist';

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

// オフライン専用のシンプルなService Worker
const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: false, // ナビゲーションプリロードを無効化
    runtimeCaching: [
        // オンライン時は一切干渉しない
        // オフライン時のみキャッシュから返す
        {
            matcher: () => {
                // 全てのリクエストにマッチ
                return true;
            },
            handler: async ({ request }) => {
                // オンライン時は常にネットワークを優先（キャッシュを使わない）
                if (navigator.onLine) {
                    return fetch(request);
                }

                // オフライン時のみキャッシュから返す
                const cacheNames = [
                    'images',
                    'article-content',
                    'pages',
                    'static-assets',
                    'article-images',
                    'api-cache',
                    'fonts',
                    'icons',
                ];

                for (const cacheName of cacheNames) {
                    const cache = await caches.open(cacheName);
                    const cachedResponse = await cache.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                }

                // オフライン時でキャッシュにない場合のフォールバック
                if (request.mode === 'navigate') {
                    return new Response(
                        `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <title>オフライン</title>
                            <meta charset="utf-8">
                        </head>
                        <body>
                            <h1>オフラインです</h1>
                            <p>このページはオフラインでは利用できません。</p>
                            <p>インターネット接続を確認してください。</p>
                        </body>
                        </html>
                    `,
                        {
                            headers: { 'Content-Type': 'text/html' },
                        },
                    );
                }

                return new Response('オフラインです', { status: 503 });
            },
        },
    ],
});

serwist.addEventListeners();

// カスタムメッセージハンドラー（オフライン時のコンテンツ事前キャッシュ用）
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

            if (urlsToCache.length === 0) {
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
                            return { url, success: true };
                        } catch (error) {
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
