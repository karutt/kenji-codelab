import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, NetworkFirst, Serwist } from 'serwist';

// この宣言により、serwistの型が利用可能になります
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: WorkerGlobalScope;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // 画像のキャッシュ戦略
        {
            matcher: /^https?:\/\/.*\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: new CacheFirst({
                cacheName: 'images',
            }),
        },

        // 記事画像（ローカル）
        {
            matcher: /\/books\/.*\/images\/.*/,
            handler: new CacheFirst({
                cacheName: 'article-images',
            }),
        },

        // 記事コンテンツ（Markdownファイル）
        {
            matcher: /\/books\/.*\/md\/.*/,
            handler: new NetworkFirst({
                cacheName: 'article-content',
                networkTimeoutSeconds: 3,
            }),
        },

        // API レスポンス
        {
            matcher: /^https?:\/\/.*\/api\/.*/,
            handler: new NetworkFirst({
                cacheName: 'api-cache',
                networkTimeoutSeconds: 5,
            }),
        },

        // フォント
        {
            matcher: /\.(?:woff|woff2|ttf|otf)$/,
            handler: new CacheFirst({
                cacheName: 'fonts',
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
