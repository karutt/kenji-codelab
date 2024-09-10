import fs from "fs";
import path from "path";
import Article from "@/components/Article/Article";
import matter from "gray-matter";
import { marked } from "marked";
import WebSocketClient from "@/components/WebSocketClient"; //

export default function Page({ params }) {
    const { bookSlug, articleSlug } = params;
    const articlePath = path.join(
        process.cwd(),
        `public/books/${bookSlug}/md`,
        `${articleSlug}.md`
    );
    const fileContent = fs.readFileSync(articlePath, "utf8");
    const { content, data } = matter(fileContent);

    const cardPath = path.join(process.cwd(), `public/books/${bookSlug}/card`, `${articleSlug}.md`);
    let cardContent = "";
    if (fs.existsSync(cardPath)) {
        cardContent = fs.readFileSync(cardPath, "utf8");
    }

    const problemPath = path.join(
        process.cwd(),
        `public/books/${bookSlug}/prob`,
        `${articleSlug}.md`
    );
    let problemContent = "";
    if (fs.existsSync(problemPath)) {
        problemContent = fs.readFileSync(problemPath, "utf8");
    }

    return (
        <>
            <Article
                markdown={content}
                card={cardContent}
                problem={problemContent}
                frontMatter={data}
                articleSlug={articleSlug}
                bookSlug={bookSlug}
            />
            {/* <WebSocketClient /> */}
        </>
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
