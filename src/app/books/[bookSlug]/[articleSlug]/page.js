import fs from "fs";
import path from "path";
import Article from "@/components/Article/Article";
import matter from "gray-matter";

export default function Page({ params }) {
    const { bookSlug, articleSlug } = params;
    const filePath = path.join(process.cwd(), "public/books/p5_tutorial/md", `${articleSlug}.md`);
    const fileContent = fs.readFileSync(filePath, "utf8");
    const { content, data } = matter(fileContent);

    return (
        <div>
            <Article
                markdown={content}
                frontMatter={data}
                articleSlug={articleSlug}
                bookSlug={bookSlug}
            />
        </div>
    );
}

export async function generateStaticParams({ params }) {
    const dirPath = path.join(process.cwd(), `public/books/${params.bookSlug}/md`);
    const files = fs.readdirSync(dirPath);
    return files.map((file) => ({
        bookSlug: params.bookSlug,
        articleSlug: file.replace(".md", ""),
    }));
}
