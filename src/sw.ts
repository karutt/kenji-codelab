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

// より効率的なキャッシュファースト戦略のカスタマイザー
const createOptimizedCacheFirst = (cacheName: string) => ({
    cacheName,
    cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
        // クエリパラメータを正規化してキャッシュキーを最適化
        const url = new URL(request.url);
        // 開発時のホットリロード関連パラメータを除去
        url.searchParams.delete('_rsc');
        url.searchParams.delete('_next-live');
        return url.href;
    },
    cacheWillUpdate: async ({ response }: { response: Response }) => {
        // 成功レスポンスのみキャッシュ
        return response.status === 200;
    },
});

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // 開発ツール・外部サービス・Next.jsの内部リクエストの除外
        {
            matcher: ({ request }: { request: Request }) => {
                const url = request.url;
                return (
                    url.includes('vercel.live') ||
                    url.includes('_next-live') ||
                    url.includes('hot-reloader') ||
                    url.includes('webpack-hmr') ||
                    url.includes('_vercel') ||
                    url.includes('?_rsc=') || // Next.js RSC プリフェッチ
                    url.includes('/_next/webpack-hmr') ||
                    url.includes('/__nextjs_original-stack-frame') ||
                    url.includes('/_next/static/webpack/') ||
                    (process.env.NODE_ENV === 'development' && url.includes('/_next/static/chunks/'))
                );
            },
            handler: async () => {
                // 静かに失敗させる（エラーを投げない）
                return new Response('', { status: 200 });
            },
        },

        // ファビコンとアイコン類
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.url.endsWith('/favicon.ico') ||
                    request.url.includes('apple-icon') ||
                    request.url.includes('android-chrome') ||
                    /\/(favicon|icon)-/.test(request.url)
                );
            },
            handler: async ({ request }) => {
                try {
                    // まずキャッシュから確認
                    const cache = await caches.open('icons');
                    const cachedResponse = await cache.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // ネットワークから取得を試行
                    const response = await fetch(request);
                    if (response.ok) {
                        // 成功した場合はキャッシュして返す
                        await cache.put(request, response.clone());
                        return response;
                    }

                    // 失敗した場合は透明な1x1ピクセルのPNG画像を返す
                    const fallbackIcon = new Response(
                        new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
                            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
                            0x0b, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
                            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
                            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
                        ]),
                        {
                            status: 200,
                            headers: { 'Content-Type': 'image/png' },
                        },
                    );
                    return fallbackIcon;
                } catch {
                    // ファビコンのエラーは静かに処理（ログなし）
                    // エラーの場合も同じフォールバックを返す
                    return new Response(
                        new Uint8Array([
                            0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
                            0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
                            0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
                            0x0b, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
                            0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
                            0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
                        ]),
                        {
                            status: 200,
                            headers: { 'Content-Type': 'image/png' },
                        },
                    );
                }
            },
        },

        // すべての画像（より包括的）
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.destination === 'image' ||
                    /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i.test(request.url)
                );
            },
            handler: new CacheFirst({
                ...createOptimizedCacheFirst('images'),
            }),
        },

        // 記事画像（ローカル）- より明確なパターン
        {
            matcher: ({ request }: { request: Request }) => {
                return /\/books\/.*\/images\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i.test(request.url);
            },
            handler: new CacheFirst({
                ...createOptimizedCacheFirst('article-images'),
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
                ...createOptimizedCacheFirst('fonts'),
            }),
        },

        // 静的アセット（JS, CSS）- 開発時は最小限
        {
            matcher: ({ request }: { request: Request }) => {
                return (
                    request.destination === 'script' ||
                    request.destination === 'style' ||
                    /\/_next\/static\//.test(request.url)
                );
            },
            handler: async ({ request }) => {
                // 開発時はキャッシュを無効化してHMRを優先
                if (process.env.NODE_ENV === 'development') {
                    return fetch(request);
                } else {
                    // 本番時のみCacheFirstを適用
                    const cache = await caches.open('static-assets');
                    const cachedResponse = await cache.match(request);
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    
                    const response = await fetch(request);
                    if (response.ok) {
                        cache.put(request, response.clone());
                    }
                    return response;
                }
            },
        },

        // HTML ページ（ナビゲーション）- 開発時はバイパス
        {
            matcher: ({ request }: { request: Request }) => request.mode === 'navigate',
            handler: async ({ request }) => {
                // 開発時はService Workerをバイパスしてパフォーマンスを優先
                if (process.env.NODE_ENV === 'development') {
                    // 開発時は直接ネットワークから取得（キャッシュなし）
                    return fetch(request);
                } else {
                    // 本番時のみキャッシュ戦略を適用
                    try {
                        const response = await fetch(request);
                        const cache = await caches.open('pages');
                        cache.put(request, response.clone());
                        return response;
                    } catch (error) {
                        const cache = await caches.open('pages');
                        const cachedResponse = await cache.match(request);
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        throw error;
                    }
                }
            },
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

            // 開発時のみ詳細ログ
            if (process.env.NODE_ENV === 'development') {
                console.log(`Service Worker: Caching ${urlsToCache.length} URLs`);
            }

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
                            // 個別URLのログは削除（バッチ完了時のみログ出力）
                            return { url, success: true };
                        } catch (error) {
                            // エラーの詳細ログも削除（最終集計時のみ表示）
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

            // 開発時のみログ出力
            if (process.env.NODE_ENV === 'development') {
                console.log(
                    `Service Worker: Cache installation complete - Success: ${successCount}, Errors: ${errorCount}`,
                );

                if (failedUrls.length > 0) {
                    console.warn('Failed URLs:', failedUrls);
                }
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
