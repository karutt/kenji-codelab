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
            <body className={notosansjp.className}>
                <Provider>
                    <AuthProvider>
                        <HeaderProvider>
                            <AuthSync />
                            <Header />
                            {children}
                            <Footer />
                            <Toaster />
                        </HeaderProvider>
                    </AuthProvider>
                </Provider>
            </body>
        </html>
    );
}
