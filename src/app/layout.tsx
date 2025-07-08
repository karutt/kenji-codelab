import '../styles/globals.css';
import '../styles/markdown.css';

import type { Metadata } from 'next';
import { Noto_Sans_JP } from 'next/font/google';

import Footer from '@/components/layout/Footer';
import Header from '@/components/layout/Header';
import { Provider } from '@/components/ui/provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/contexts/AuthContext';
import { HeaderProvider } from '@/contexts/HeaderContext';
import AuthSync from '@/features/auth/components/AuthSync';
import { PWAProvider } from '@/providers/PWAProvider';

const notosansjp = Noto_Sans_JP({
    subsets: ['latin'],
    weight: ['300', '400', '500', '700'],
});

export const metadata: Metadata = {
    title: 'KeNJi CodeLab',
    description:
        'KeNJi CodeLabは、プログラミングを楽しく学べる場所。創造力を刺激する学習記事やチュートリアルも充実した学内コミュニティです。',
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon.ico',
        apple: '/web-app-manifest-192x192.png',
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ja">
            <head>
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#000000" />
                <link rel="apple-touch-icon" href="/web-app-manifest-192x192.png" />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            // Service Worker関連のエラーを静かに処理
                            window.addEventListener('error', function(event) {
                                if (event.error && event.error.message && 
                                    (event.error.message.includes('no-response') ||
                                     event.error.message.includes('Failed to fetch RSC payload') ||
                                     event.error.message.includes('vercel.live') ||
                                     event.error.message.includes('_next-live'))) {
                                    // これらのエラーは表示しない（デバッグモードでは表示）
                                    if (window.location.hostname === 'localhost') {
                                        console.debug('Service Worker warning (expected):', event.error.message);
                                    }
                                    event.preventDefault();
                                    return false;
                                }
                            });
                            
                            // 未処理のPromise rejectionを処理
                            window.addEventListener('unhandledrejection', function(event) {
                                if (event.reason && 
                                    (event.reason.message?.includes('no-response') ||
                                     event.reason.message?.includes('Failed to fetch RSC payload') ||
                                     event.reason.message?.includes('vercel.live') ||
                                     event.reason.message?.includes('_next-live'))) {
                                    // これらのエラーは表示しない
                                    if (window.location.hostname === 'localhost') {
                                        console.debug('Service Worker rejection (expected):', event.reason.message);
                                    }
                                    event.preventDefault();
                                }
                            });
                        `,
                    }}
                />
            </head>
            <body className={notosansjp.className}>
                <Provider>
                    <PWAProvider>
                        <AuthProvider>
                            <HeaderProvider>
                                <AuthSync />
                                <Header />
                                {children}
                                <Footer />
                                <Toaster />
                            </HeaderProvider>
                        </AuthProvider>
                    </PWAProvider>
                </Provider>
            </body>
        </html>
    );
}
