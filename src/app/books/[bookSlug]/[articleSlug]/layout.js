// layout.js
import SideMenu from "@/components/SideMenu/SideMenu";
import { SideMenuProvider } from "@/components/SideMenu/SideMenuContext";
import fs from "fs";
import path from "path";

export default function Layout({ children, params }) {
    const { bookSlug, articleSlug } = params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

    return (
        <SideMenuProvider>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "stretch",
                    background: "#EDF2F6",
                    marginTop: "64px",
                }}>
                {/* SideMenuはContextの状態に基づいて表示・非表示を切り替える */}
                <SideMenu config={config} bookName={bookSlug} articleSlug={articleSlug} />
                {children}
            </div>
        </SideMenuProvider>
    );
}
