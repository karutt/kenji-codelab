const CACHE_NAME = 'kenji-codelab-v2';
const STATIC_CACHE_NAME = 'kenji-codelab-static-v2';
const ARTICLE_CACHE_NAME = 'kenji-codelab-articles-v2';
const IMAGE_CACHE_NAME = 'kenji-codelab-images-v2';

// 静的リソース（App Shell）
const STATIC_ASSETS = [
    '/',
    '/books',
    '/offline',
    '/cache',
    '/manifest.json',
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
    // 重要なSVGファイル
    '/svg/logo.svg',
    '/svg/logo_text.svg',
    '/svg/p5_tutorial_thumnail.svg',
    '/svg/python_tutorial_thumnail.svg',
    '/svg/slide_design_thumnail.svg',
];

// Service Worker インストール
self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE_NAME)
            .then(cache => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting()),
    );
});

// Service Worker アクティベート
self.addEventListener('activate', event => {
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
                            return caches.delete(cacheName);
                        }
                    }),
                );
            })
            .then(() => self.clients.claim()),
    );
});

// Fetch イベント処理
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);

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
                    .catch(() => {
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

    // 静的リソース: Cache First
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/_next/static/')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                return cachedResponse || fetch(request);
            }),
        );
        return;
    }

    // その他: Network First
    event.respondWith(
        fetch(request)
            .then(response => {
                // レスポンスが成功した場合のみキャッシュ
                if (response && response.ok) {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, responseClone);
                    });
                }
                return response;
            })
            .catch(error => {
                console.log('Network failed, trying cache:', error);
                return caches.match(request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // オフラインページを返す
                    if (request.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                    // 画像リクエストには透明なGIFを返す
                    if (request.destination === 'image') {
                        const transparentGif =
                            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
                        return fetch(transparentGif);
                    }
                    // その他のリクエストは404を返す
                    return new Response('Not Found', {
                        status: 404,
                        statusText: 'Not Found (Offline)',
                    });
                });
            }),
    );
});
