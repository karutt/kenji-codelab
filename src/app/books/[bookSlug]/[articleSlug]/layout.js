// src/app/[bookSlug]/layout.js
import { BookConfigProvider } from "@/contexts/BookConfigContext";
import SideMenu from "@/features/article/components/SideMenu/SideMenu";
import { SideMenuProvider } from "@/features/article/components/SideMenu/SideMenuContext";
import fs from "fs";
import path from "path";

export default function Layout({ children, params }) {
    const { bookSlug, articleSlug } = params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    return (
        <SideMenuProvider>
            <BookConfigProvider config={config}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "stretch",
                        background: "#EDF2F6",
                        marginTop: "64px",
                    }}>
                    <SideMenu bookName={bookSlug} articleSlug={articleSlug} />
                    {children}
                </div>
            </BookConfigProvider>
        </SideMenuProvider>
    );
}
