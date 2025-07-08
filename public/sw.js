const CACHE_NAME = 'kenji-codelab-v3';
const STATIC_CACHE_NAME = 'kenji-codelab-static-v3';
const ARTICLE_CACHE_NAME = 'kenji-codelab-articles-v3';
const IMAGE_CACHE_NAME = 'kenji-codelab-images-v3';

// 静的リソース（App Shell）- This will be replaced during build
const STATIC_ASSETS = [
    
    "/",
    
    "/books",
    
    "/books/p5_tutorial/images/1-0/1.png",
    
    "/books/p5_tutorial/images/1-0/2.png",
    
    "/books/p5_tutorial/images/1-0/3.png",
    
    "/books/p5_tutorial/images/1-1/1.png",
    
    "/books/p5_tutorial/images/1-1/2.png",
    
    "/books/p5_tutorial/images/1-1/3.png",
    
    "/books/p5_tutorial/images/1-1/4.png",
    
    "/books/p5_tutorial/images/1-1/5.png",
    
    "/books/p5_tutorial/images/1-1/6.png",
    
    "/books/p5_tutorial/images/1-1/7.png",
    
    "/books/p5_tutorial/images/1-2/1.png",
    
    "/books/p5_tutorial/images/1-2/2.png",
    
    "/books/p5_tutorial/images/1-3/0.png",
    
    "/books/p5_tutorial/images/1-3/1.png",
    
    "/books/p5_tutorial/images/1-4/1.png",
    
    "/books/p5_tutorial/images/1-4/2.png",
    
    "/books/p5_tutorial/images/1-5/1.png",
    
    "/books/p5_tutorial/images/1-5/2.png",
    
    "/books/p5_tutorial/images/1-5/3.png",
    
    "/books/p5_tutorial/images/1-5/4.png",
    
    "/books/p5_tutorial/images/2-0/1.png",
    
    "/books/p5_tutorial/images/2-0/2.png",
    
    "/books/p5_tutorial/images/2-1/1.png",
    
    "/books/p5_tutorial/images/2-1/2.png",
    
    "/books/p5_tutorial/images/2-1/3.png",
    
    "/books/p5_tutorial/images/2-1/4.png",
    
    "/books/p5_tutorial/images/2-1/5.png",
    
    "/books/p5_tutorial/images/2-1/6.png",
    
    "/books/p5_tutorial/images/2-1/p/1.png",
    
    "/books/p5_tutorial/images/2-1/p/2.png",
    
    "/books/p5_tutorial/images/2-2/1.png",
    
    "/books/p5_tutorial/images/2-2/2.png",
    
    "/books/p5_tutorial/images/2-2/3.png",
    
    "/books/p5_tutorial/images/2-2/4.png",
    
    "/books/p5_tutorial/images/2-2/5.png",
    
    "/books/p5_tutorial/images/2-2/6.png",
    
    "/books/p5_tutorial/images/2-2/7.png",
    
    "/books/p5_tutorial/images/2-2/8.png",
    
    "/books/p5_tutorial/images/2-3/0.png",
    
    "/books/p5_tutorial/images/2-3/1.png",
    
    "/books/p5_tutorial/images/2-3/2.png",
    
    "/books/p5_tutorial/images/2-3/3.png",
    
    "/books/p5_tutorial/images/2-3/4.png",
    
    "/books/p5_tutorial/images/2-4/1.png",
    
    "/books/p5_tutorial/images/2-4/2.png",
    
    "/books/p5_tutorial/images/2-4/3.png",
    
    "/books/p5_tutorial/images/2-5/1.png",
    
    "/books/p5_tutorial/images/2-5/2.png",
    
    "/books/p5_tutorial/images/2-5/3.png",
    
    "/books/p5_tutorial/images/2-5/4.png",
    
    "/books/p5_tutorial/images/2-5/5.png",
    
    "/books/p5_tutorial/images/2-5/6.png",
    
    "/books/p5_tutorial/images/2-5/7.png",
    
    "/books/p5_tutorial/images/2-6/1.png",
    
    "/books/p5_tutorial/images/2-6/2.png",
    
    "/books/p5_tutorial/images/2-6/3.png",
    
    "/books/p5_tutorial/images/2-6/4.png",
    
    "/books/p5_tutorial/images/3-0/0.png",
    
    "/books/p5_tutorial/images/3-0/1.png",
    
    "/books/p5_tutorial/images/3-1/1.png",
    
    "/books/p5_tutorial/images/3-1/2.png",
    
    "/books/p5_tutorial/images/3-1/3.png",
    
    "/books/p5_tutorial/images/3-1/4.png",
    
    "/books/p5_tutorial/images/3-1/5.png",
    
    "/books/p5_tutorial/images/3-1/main.png",
    
    "/books/p5_tutorial/images/3-2/1.png",
    
    "/books/p5_tutorial/images/3-2/2.png",
    
    "/books/p5_tutorial/images/3-2/2en.png",
    
    "/books/p5_tutorial/images/3-2/3.png",
    
    "/books/p5_tutorial/images/3-2/4.png",
    
    "/books/p5_tutorial/images/3-2/5.png",
    
    "/books/p5_tutorial/images/3-2/6.png",
    
    "/books/p5_tutorial/images/3-2/7.png",
    
    "/books/p5_tutorial/images/3-2/8.png",
    
    "/books/p5_tutorial/images/3-2/9.png",
    
    "/books/p5_tutorial/images/prac.png",
    
    "/books/python_tutorial/img/1-0/1.png",
    
    "/books/python_tutorial/img/1-0/2.png",
    
    "/books/python_tutorial/img/1-1/1.png",
    
    "/books/python_tutorial/img/1-1/2.png",
    
    "/books/python_tutorial/img/1-3/0.png",
    
    "/books/python_tutorial/img/1-3/1.png",
    
    "/books/python_tutorial/img/1-3/2.png",
    
    "/books/python_tutorial/img/1-3/3.png",
    
    "/books/python_tutorial/img/1-3/4.png",
    
    "/books/python_tutorial/img/1-3/5.png",
    
    "/books/python_tutorial/img/1-3/6.png",
    
    "/books/python_tutorial/img/1-3/7.png",
    
    "/books/python_tutorial/img/1-4/1.png",
    
    "/books/python_tutorial/img/2-1/1.png",
    
    "/books/python_tutorial/img/2-3/1.png",
    
    "/books/python_tutorial/img/2-4/1.png",
    
    "/books/python_tutorial/img/3-1/1.png",
    
    "/books/python_tutorial/img/global/human1.png",
    
    "/books/python_tutorial_en/img/1-0/1.png",
    
    "/books/python_tutorial_en/img/1-0/2.png",
    
    "/books/python_tutorial_en/img/1-1/1.png",
    
    "/books/python_tutorial_en/img/1-1/2.png",
    
    "/books/python_tutorial_en/img/1-3/0.png",
    
    "/books/python_tutorial_en/img/1-3/1.png",
    
    "/books/python_tutorial_en/img/1-3/2.png",
    
    "/books/python_tutorial_en/img/1-3/3.png",
    
    "/books/python_tutorial_en/img/1-3/4.png",
    
    "/books/python_tutorial_en/img/1-3/5.png",
    
    "/books/python_tutorial_en/img/1-3/6.png",
    
    "/books/python_tutorial_en/img/1-3/7.png",
    
    "/books/python_tutorial_en/img/1-4/1.png",
    
    "/books/python_tutorial_en/img/2-3/1.png",
    
    "/books/python_tutorial_en/img/global/human1.png",
    
    "/books/slide_design/images/1-0/1.png",
    
    "/books/slide_design/images/1-0/2.png",
    
    "/books/slide_design/images/1-0/3.png",
    
    "/books/slide_design/images/1-0/4.png",
    
    "/books/slide_design/images/1-0/5.png",
    
    "/books/slide_design/images/1-1/1.jpeg",
    
    "/books/slide_design/images/1-2/1.png",
    
    "/books/slide_design/images/1-2/2.png",
    
    "/books/slide_design/images/1-2/3.png",
    
    "/books/slide_design/images/2-1/1.png",
    
    "/books/slide_design/images/2-1/2.png",
    
    "/books/slide_design/images/2-1/3.png",
    
    "/books/slide_design/images/2-2/1.png",
    
    "/books/slide_design/images/2-2/2.png",
    
    "/books/slide_design/images/2-2/3.png",
    
    "/books/slide_design/images/2-2/4.png",
    
    "/books/slide_design/images/2-3/1.png",
    
    "/books/slide_design/images/2-3/2.png",
    
    "/books/slide_design/images/2-3/3.png",
    
    "/books/slide_design/images/2-3/4.png",
    
    "/books/slide_design/images/2-3/5.png",
    
    "/books/slide_design/images/2-3/6.png",
    
    "/books/slide_design/images/3-1/1.png",
    
    "/books/slide_design/images/3-1/2.png",
    
    "/books/slide_design/images/3-1/3.png",
    
    "/books/slide_design/images/3-1/4.png",
    
    "/books/slide_design/images/3-1/5.png",
    
    "/books/slide_design_en/images/1-0/1.png",
    
    "/books/slide_design_en/images/1-0/2.png",
    
    "/books/slide_design_en/images/1-0/3.png",
    
    "/books/slide_design_en/images/1-0/4.png",
    
    "/books/slide_design_en/images/1-0/5.png",
    
    "/books/slide_design_en/images/1-1/1.jpeg",
    
    "/books/slide_design_en/images/1-2/1.png",
    
    "/books/slide_design_en/images/1-2/2.png",
    
    "/books/slide_design_en/images/1-2/3.png",
    
    "/books/slide_design_en/images/2-1/1.png",
    
    "/books/slide_design_en/images/2-1/2.png",
    
    "/books/slide_design_en/images/2-1/3.png",
    
    "/books/slide_design_en/images/2-2/1.png",
    
    "/books/slide_design_en/images/2-2/2.png",
    
    "/books/slide_design_en/images/2-2/3.png",
    
    "/books/slide_design_en/images/2-2/4.png",
    
    "/books/slide_design_en/images/2-3/1.png",
    
    "/books/slide_design_en/images/2-3/2.png",
    
    "/books/slide_design_en/images/2-3/3.png",
    
    "/books/slide_design_en/images/2-3/4.png",
    
    "/books/slide_design_en/images/2-3/5.png",
    
    "/books/slide_design_en/images/2-3/6.png",
    
    "/books/slide_design_en/images/3-1/1.png",
    
    "/books/slide_design_en/images/3-1/2.png",
    
    "/books/slide_design_en/images/3-1/3.png",
    
    "/books/slide_design_en/images/3-1/4.png",
    
    "/books/slide_design_en/images/3-1/5.png",
    
    "/cache",
    
    "/icons/icon0.svg",
    
    "/icons/icon1.png",
    
    "/manifest.webmanifest",
    
    "/offline",
    
    "/svg/Frame 21.png",
    
    "/svg/book_list_bg.svg",
    
    "/svg/book_list_bg2.svg",
    
    "/svg/global_chat.svg",
    
    "/svg/line.svg",
    
    "/svg/logo.svg",
    
    "/svg/logo_text.svg",
    
    "/svg/logo_text_v2.svg",
    
    "/svg/mail.svg",
    
    "/svg/next.svg",
    
    "/svg/p5_tutorial_en_icon.svg",
    
    "/svg/p5_tutorial_en_icon1.svg",
    
    "/svg/p5_tutorial_en_icon2.svg",
    
    "/svg/p5_tutorial_en_icon3.svg",
    
    "/svg/p5_tutorial_en_icon4.svg",
    
    "/svg/p5_tutorial_en_thumnail.svg",
    
    "/svg/p5_tutorial_icon.svg",
    
    "/svg/p5_tutorial_icon1.svg",
    
    "/svg/p5_tutorial_icon2.svg",
    
    "/svg/p5_tutorial_icon3.svg",
    
    "/svg/p5_tutorial_icon4.svg",
    
    "/svg/p5_tutorial_thumnail.svg",
    
    "/svg/profile_karutt.svg",
    
    "/svg/prog_chat.svg",
    
    "/svg/python_tutorial.svg",
    
    "/svg/python_tutorial_icon.svg",
    
    "/svg/python_tutorial_icon1.svg",
    
    "/svg/python_tutorial_icon2.svg",
    
    "/svg/python_tutorial_icon3.svg",
    
    "/svg/python_tutorial_thumnail.svg",
    
    "/svg/red_shape.svg",
    
    "/svg/search.svg",
    
    "/svg/shark_shape.svg",
    
    "/svg/slide_design_en_icon.svg",
    
    "/svg/slide_design_en_icon1.svg",
    
    "/svg/slide_design_en_icon2.svg",
    
    "/svg/slide_design_en_icon3.svg",
    
    "/svg/slide_design_en_icon4.svg",
    
    "/svg/slide_design_icon.svg",
    
    "/svg/slide_design_icon1.svg",
    
    "/svg/slide_design_icon2.svg",
    
    "/svg/slide_design_icon3.svg",
    
    "/svg/slide_design_icon4.svg",
    
    "/svg/slide_design_thumnail.svg",
    
    "/svg/toggle.svg",
    
    "/svg/toggle_off.svg",
    
    "/svg/toggle_on.svg",
    
    "/svg/triangle.svg",
    
    "/svg/vercel.svg",
    
    "/svg/white_shape.svg",
    
    "/svg/x.svg",
    
    "/web-app-manifest-192x192.png",
    
    "/web-app-manifest-512x512.png"

];

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
                console.log('[Service Worker] Skip waiting...');
                return self.skipWaiting();
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
    if (!response || !response.ok) {
        return;
    }

    const responseClone = response.clone();
    caches.open(STATIC_CACHE_NAME).then(cache => {
        cache.put(request, responseClone);
        
        // HTMLページの場合、関連するNext.jsのチャンクを事前に取得してキャッシュ
        if (request.destination === 'document') {
            responseClone.text().then(text => {
                const matches = text.matchAll(/_next\/static\/chunks\/[^"]+/g);
                const chunks = [...matches].map(m => m[0]);
                if (chunks.length > 0) {
                    console.log('[Service Worker] Found page chunks to cache:', chunks);
                    const chunkUrls = chunks.map(chunk => new URL(chunk, self.location.origin).href);
                    Promise.all(
                        chunkUrls.map(url => 
                            fetch(url)
                                .then(resp => {
                                    if (resp.ok) {
                                        return cache.put(url, resp);
                                    }
                                })
                                .catch(err => console.error('[Service Worker] Failed to cache chunk:', url, err))
                        )
                    );
                }
            }).catch(err => {
                console.error('[Service Worker] Failed to parse HTML for chunks:', err);
            });
        }
    });
};

// Fetch イベント処理
self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    
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

    // Next.jsのチャンク: Cache First, Network Fallback
    if (url.pathname.startsWith('/_next/static/')) {
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
    if (STATIC_ASSETS.includes(url.pathname) || url.pathname.includes('/svg/') || url.pathname.includes('/icons/')) {
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
                    return caches.match(request)
                        .then(cachedResponse => {
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
                console.log('[Service Worker] Network failed, trying cache:', error);
                return caches.match(request).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
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
