import Article from "@/components/Article/Article";
import fs from "fs";
import matter from "gray-matter";
import path from "path";

function readFileContent(filePath) {
    if (!fs.existsSync(filePath)) return "";
    return fs.readFileSync(filePath, "utf8");
}

function readMdTitle(dirPath, fileName) {
    if (!fileName) return "";
    const content = readFileContent(path.join(dirPath, `${fileName}.md`));
    if (!content) return "";
    return matter(content).data.title || "";
}

export default function Page({ params }) {
    const { bookSlug, articleSlug } = params;
    const mdDirPath = path.join(process.cwd(), `public/books/${bookSlug}/md`);
    const mdFiles = fs
        .readdirSync(mdDirPath)
        .map((file) => file.replace(".md", ""))
        .sort();
    const currentIndex = mdFiles.indexOf(articleSlug);

    const hasPre = currentIndex > 0;
    const hasNext = currentIndex < mdFiles.length - 1;

    const prePage = hasPre
        ? {
              title: readMdTitle(mdDirPath, mdFiles[currentIndex - 1]),
              link: `/books/${bookSlug}/${mdFiles[currentIndex - 1]}`,
          }
        : null;

    const nextPage = hasNext
        ? {
              title: readMdTitle(mdDirPath, mdFiles[currentIndex + 1]),
              link: `/books/${bookSlug}/${mdFiles[currentIndex + 1]}`,
          }
        : null;

    const neighborsPage = { prePage, nextPage };

    const articlePath = path.join(mdDirPath, `${articleSlug}.md`);
    const { content, data } = matter(readFileContent(articlePath));

    const cardPath = path.join(process.cwd(), `public/books/${bookSlug}/card`, `${articleSlug}.md`);
    const cardContent = readFileContent(cardPath);

    const problemPath = path.join(
        process.cwd(),
        `public/books/${bookSlug}/prob`,
        `${articleSlug}.md`
    );
    const problemContent = readFileContent(problemPath);

    return (
        <>
            <Article
                markdown={content}
                card={cardContent}
                problem={problemContent}
                frontMatter={data}
                articleSlug={articleSlug}
                bookSlug={bookSlug}
                neighborsPage={neighborsPage}
            />
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
