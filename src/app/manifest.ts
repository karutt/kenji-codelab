import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'kenji-codelab - プログラミング学習プラットフォーム',
        short_name: 'kenji-codelab',
        description: 'プログラミングの基礎から応用まで学べるオンライン学習プラットフォーム',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#4A90E2',
        orientation: 'portrait-primary',
        categories: ['education', 'productivity'],
        icons: [
            {
                src: '/web-app-manifest-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/web-app-manifest-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
        ],
    };
}
