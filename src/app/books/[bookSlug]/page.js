import fs from "fs";
import path from "path";
import SectionList from "@/components/books/SectionList";
import SectionHead from "@/components/books/SectionHead";

export default async function Page({ params }) {
    const { bookSlug } = params;
    const configPath = path.join(process.cwd(), `public/books/${bookSlug}/config.json`);
    const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
    return (
        <div>
            <SectionHead config={config} />
            <SectionList bookList={config.bookList} bookName={bookSlug} />
        </div>
    );
}
