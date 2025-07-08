const CACHE_VERSION = 'v11';
const CACHE_NAME = 'kenji-codelab-v11';
const STATIC_CACHE_NAME = 'kenji-codelab-static-v11';
const ARTICLE_CACHE_NAME = 'kenji-codelab-articles-v11';
const IMAGE_CACHE_NAME = 'kenji-codelab-images-v11';

// 静的リソース（App Shell）- This will be replaced during build
const STATIC_ASSETS = __STATIC_ASSETS__;

// 更新通知の状態管理
let hasNotifiedUpdate = false;

// メッセージハンドラー（SKIP_WAITING対応）
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        console.log('[Service Worker] Received SKIP_WAITING message');
        self.skipWaiting();
    }
});

// Service Worker インストール
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing...');
    event.waitUntil(
        caches
            .open(STATIC_CACHE_NAME)
            .then(cache => {
                console.log('[Service Worker] Caching static assets...');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => {
                console.log('[Service Worker] Installation complete, waiting for activation...');
                // 自動的にskipWaitingしない - メッセージを受け取った時のみ
                // return self.skipWaiting();
            })
            .catch(error => {
                console.error('[Service Worker] Install failed:', error);
            }),
    );
});

// Service Worker アクティベート
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating...');
    event.waitUntil(
        caches
            .keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (
                            cacheName !== STATIC_CACHE_NAME &&
                            cacheName !== ARTICLE_CACHE_NAME &&
                            cacheName !== IMAGE_CACHE_NAME
                        ) {
                            console.log('[Service Worker] Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => {
                console.log('[Service Worker] Claiming clients...');
                return self.clients.claim();
            })
            .catch(error => {
                console.error('[Service Worker] Activation failed:', error);
            }),
    );
});

// Next.jsのチャンクとページをキャッシュするヘルパー関数
const cacheNextJsPage = (request, response) => {
    if (!response || !response.ok || request.method !== 'GET') {
        return;
    }

    const responseClone = response.clone();
    caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.put(request, responseClone);

        // HTMLページの場合、関連するNext.jsのチャンクを事前に取得してキャッシュ
        if (request.destination === 'document') {
            responseClone
                .text()
                .then(text => {
                    console.log(`[Service Worker] Parsing HTML for chunks: ${request.url}`);

                    // より包括的なチャンク検出パターン
                    const chunkPatterns = [
                        /_next\/static\/chunks\/[^"'\s]+/g, // 基本のチャンクパターン
                        /_next\/static\/[^"'\s]+\.js/g, // その他のNext.js JSファイル
                        /\/_next\/static\/chunks\/app\/[^"'\s]+\.js/g, // アプリチャンク
                    ];

                    const allChunks = new Set();

                    chunkPatterns.forEach(pattern => {
                        const matches = text.matchAll(pattern);
                        [...matches].forEach(match => allChunks.add(match[0]));
                    });

                    const chunks = [...allChunks];

                    if (chunks.length > 0) {
                        console.log(
                            `[Service Worker] Found ${chunks.length} chunks to cache:`,
                            chunks,
                        );

                        const chunkUrls = chunks.map(
                            chunk => new URL(chunk, self.location.origin).href,
                        );

                        Promise.all(
                            chunkUrls.map(url =>
                                fetch(url)
                                    .then(resp => {
                                        if (resp.ok) {
                                            console.log(
                                                `[Service Worker] Successfully cached chunk: ${url}`,
                                            );
                                            return cache.put(url, resp);
                                        } else {
                                            console.warn(
                                                `[Service Worker] Failed to fetch chunk (${resp.status}): ${url}`,
                                            );
                                        }
                                    })
                                    .catch(err => {
                                        console.error(
                                            `[Service Worker] Error caching chunk: ${url}`,
                                            err,
                                        );
                                    }),
                            ),
                        )
                            .then(() => {
                                console.log(
                                    `[Service Worker] Completed caching chunks for: ${request.url}`,
                                );
                            })
                            .catch(err => {
                                console.error(
                                    `[Service Worker] Error in chunk caching process:`,
                                    err,
                                );
                            });
                    } else {
                        console.log(`[Service Worker] No chunks found in HTML: ${request.url}`);
                    }
                })
                .catch(err => {
                    console.error('[Service Worker] Failed to parse HTML for chunks:', err);
                });
        }
    });
};

// Fetch イベント処理
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

    // 外部ドメインのリクエストは処理しない
    if (url.origin !== self.location.origin) {
        return;
    }

    // GETリクエストのみを処理（OPTIONS、HEAD、POSTなどは除外）
    if (request.method !== 'GET') {
        return;
    }

    // リクエストのURLをログ（デバッグ用）
    // console.log('[Service Worker] Fetch:', request.url);

    // 記事コンテンツ: Network First with Cache Fallback
    if (url.pathname.startsWith('/books/') && url.pathname.includes('/md/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches
                            .open(ARTICLE_CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                }),
        );
        return;
    }

    // Next.jsのRSC（React Server Components）リクエスト: Network First, Cache Fallback
    if (url.searchParams.has('_rsc')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches
                            .open(STATIC_CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // RSCリクエストが失敗した場合、空のJSONを返す
                        return new Response('{}', {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    });
                }),
        );
        return;
    }

    // Next.jsのチャンク: Cache First, Network Fallback
    if (url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches
                .match(request)
                .then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return fetch(request)
                        .then(response => {
                            if (response.ok) {
                                const responseClone = response.clone();
                                caches
                                    .open(STATIC_CACHE_NAME)
                                    .then(cache => cache.put(request, responseClone))
                                    .catch(cacheError => {
                                        console.log(
                                            '[Service Worker] Failed to cache chunk:',
                                            url.pathname,
                                            cacheError,
                                        );
                                    });
                            }
                            return response;
                        })
                        .catch(error => {
                            console.log(
                                '[Service Worker] Failed to fetch Next.js chunk:',
                                url.pathname,
                                error,
                            );
                            // チャンクが見つからない場合は404を返す
                            return new Response('', {
                                status: 404,
                                statusText: 'Not Found (Offline)',
                            });
                        });
                })
                .catch(cacheMatchError => {
                    console.log(
                        '[Service Worker] Cache match failed for chunk:',
                        url.pathname,
                        cacheMatchError,
                    );
                    return new Response('', {
                        status: 404,
                        statusText: 'Cache Error',
                    });
                }),
        );
        return;
    }

    // Next.jsのデータ（SSR/SSG用）: Network First, Cache Fallback
    if (url.pathname.startsWith('/_next/data/')) {
        event.respondWith(
            fetch(request)
                .then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches
                            .open(STATIC_CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                }),
        );
        return;
    }

    // フォント: Cache First
    if (
        url.pathname.includes('.woff') ||
        url.pathname.includes('.woff2') ||
        url.pathname.includes('.ttf')
    ) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request)
                    .then(response => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches
                                .open(STATIC_CACHE_NAME)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    })
                    .catch(error => {
                        console.log('[Service Worker] Failed to fetch font:', url.pathname, error);
                        // フォントが読み込めない場合は空のレスポンスを返す
                        return new Response('', { status: 404 });
                    });
            }),
        );
        return;
    }

    // 画像: Cache First
    if (
        url.pathname.startsWith('/books/') &&
        (url.pathname.includes('/images/') || url.pathname.includes('/img/'))
    ) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches
                            .open(IMAGE_CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                });
            }),
        );
        return;
    }

    // Manifest と Web App Manifest: Cache First
    if (url.pathname === '/manifest.json' || url.pathname === '/manifest.webmanifest') {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request)
                    .then(response => {
                        if (response.ok) {
                            const responseClone = response.clone();
                            caches
                                .open(STATIC_CACHE_NAME)
                                .then(cache => cache.put(request, responseClone));
                        }
                        return response;
                    })
                    .catch(() => {
                        // Manifestが見つからない場合、最小限のマニフェストを返す
                        const fallbackManifest = {
                            name: 'Kenji Codelab',
                            short_name: 'Kenji',
                            start_url: '/',
                            display: 'standalone',
                            background_color: '#ffffff',
                            theme_color: '#000000',
                        };
                        return new Response(JSON.stringify(fallbackManifest), {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    });
            }),
        );
        return;
    }

    // 静的リソース: Cache First
    if (
        STATIC_ASSETS.includes(url.pathname) ||
        url.pathname.includes('/svg/') ||
        url.pathname.includes('/icons/')
    ) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then(response => {
                    if (response.ok) {
                        const responseClone = response.clone();
                        caches
                            .open(STATIC_CACHE_NAME)
                            .then(cache => cache.put(request, responseClone));
                    }
                    return response;
                });
            }),
        );
        return;
    }

    // ページナビゲーション: Network First, Cache Fallback, Offline Page Fallback
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .then(response => {
                    // ページをキャッシュして関連するチャンクも取得
                    cacheNextJsPage(request, response);
                    return response;
                })
                .catch(error => {
                    console.log('[Service Worker] Navigation fetch failed, trying cache:', error);
                    return caches.match(request).then(cachedResponse => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // オフラインページを返す
                        console.log('[Service Worker] No cached page found, serving offline page');
                        return caches.match('/offline');
                    });
                }),
        );
        return;
    }

    // その他: Network First
    event.respondWith(
        fetch(request)
            .then(response => {
                // レスポンスが成功した場合かつGETリクエストの場合のみキャッシュ
                if (response && response.ok && request.method === 'GET') {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(error => {
                console.log('[Service Worker] Network failed, trying cache:', error);
                return caches.match(request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // API リクエストの場合、空のJSONレスポンスを返す
                    if (url.pathname.startsWith('/api/')) {
                        return new Response('{}', {
                            status: 200,
                            headers: { 'Content-Type': 'application/json' },
                        });
                    }

                    // 画像リクエストには透明なGIFを返す
                    if (request.destination === 'image') {
                        const transparentGif =
                            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                        return fetch(transparentGif);
                    }

                    // ページリクエストの場合、オフラインページを返す
                    if (
                        request.destination === 'document' ||
                        request.headers.get('accept')?.includes('text/html')
                    ) {
                        return caches.match('/offline').then(offlinePage => {
                            if (offlinePage) {
                                return offlinePage;
                            }
                            // オフラインページもない場合、シンプルなHTMLを返す
                            return new Response(
                                `
                                <!DOCTYPE html>
                                <html>
                                <head>
                                    <title>オフライン</title>
                                    <meta charset="utf-8">
                                    <meta name="viewport" content="width=device-width, initial-scale=1">
                                </head>
                                <body>
                                    <h1>オフラインです</h1>
                                    <p>インターネット接続を確認してください。</p>
                                </body>
                                </html>
                            `,
                                {
                                    status: 200,
                                    headers: { 'Content-Type': 'text/html' },
                                },
                            );
                        });
                    }

                    // その他のリクエストは404を返すが、ログを抑制
                    return new Response('Not Found', {
                        status: 404,
                        statusText: 'Not Found (Offline)',
                    });
                });
            }),
    );
});
