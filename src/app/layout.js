import { Noto_Sans_JP } from "next/font/google";
import "@/css/globals.css";
import "@/css/normalize.css";
import StyledComponentsRegistry from "../lib/registry";

const notosansjp = Noto_Sans_JP({
    subsets: ["latin"],
    weight: ["400", "500", "700"], // 400: normal, 500: semibold, 700: bold
});

import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer.";

export const metadata = {
    title: "KeNJi CodeLab",
    description:
        "KeNJi CodeLabは、プログラミングを楽しく学べる場所。創造力を刺激する学習記事やチュートリアルも充実した学内コミュニティです。",
};

export default function RootLayout({ children }) {
    return (
        <html lang='ja'>
            <body className={notosansjp.className}>
                <StyledComponentsRegistry>
                    <Header />
                    {children}
                    <Footer />
                </StyledComponentsRegistry>
            </body>
        </html>
    );
}
