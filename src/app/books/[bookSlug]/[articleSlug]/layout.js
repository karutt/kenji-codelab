import SideMenu from "@/components/SideMenu/SideMenu";
import fs from "fs";
import path from "path";

export default function Layout({ children, params }) {
    const { bookSlug, articleSlug } = params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "stretch",
                background: "#F3F5FB",
            }}>
            <SideMenu config={config} bookName={bookSlug} articleSlug={articleSlug} />
            {children}
        </div>
    );
}
