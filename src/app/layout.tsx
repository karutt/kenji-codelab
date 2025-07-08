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
