import { Provider } from "@/components/ui/provider";
import { AuthProvider } from "@/contexts/AuthContext";
import "@/css/globals.css";
import "@/css/normalize.css";
import AuthSync from "@/features/user/components/AuthSync";
import { ThemeProvider } from "next-themes";
import { Noto_Sans_JP } from "next/font/google";
import StyledComponentsRegistry from "../utils/registry";
const notosansjp = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"], // 400: normal, 500: semibold, 700: bold
});

import Footer from "@/components/common/Footer/Footer";
import Header from "@/components/common/header/Header";

export const metadata = {
    title: "KeNJi CodeLab",
    description:
        "KeNJi CodeLabは、プログラミングを楽しく学べる場所。創造力を刺激する学習記事やチュートリアルも充実した学内コミュニティです。",
    icons: {
        icon: "/icon.svg",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang='ja'>
            <body className={notosansjp.className}>
                <ThemeProvider attribute='class' defaultTheme='light' enableSystem={false}>
                    <Provider>
                        <StyledComponentsRegistry>
                            <AuthProvider>
                                <Header />
                                {children}
                                <Footer />
                                <AuthSync />
                            </AuthProvider>
                        </StyledComponentsRegistry>
                    </Provider>
                </ThemeProvider>
            </body>
        </html>
    );
}
