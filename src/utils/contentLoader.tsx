import fs from 'fs';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import path from 'path';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

export interface BookMeta {
    id: string;
    title: string;
    description: string;
    category: string;
    level: string;
    tags: string[];
    author: string;
    lastModified: string;
    isPublished: boolean;
    estimatedReadTime: number;
    chapters: ChapterMeta[];
}

export interface ChapterMeta {
    id: string;
    title: string;
    description: string;
    readTime: number;
}

export interface ArticleFrontMatter {
    title: string;
    lastModified: string;
    description?: string;
    tags?: string[];
    readTime?: number;
    [key: string]: unknown;
}

export interface ArticleData {
    frontMatter: ArticleFrontMatter;
    content: string;
    slug: string;
}

const CONTENT_BASE_PATH = path.join(process.cwd(), 'public/content/books');

// 書籍メタデータを取得
export async function getBookMeta(bookId: string): Promise<BookMeta | null> {
    try {
        const metaPath = path.join(CONTENT_BASE_PATH, bookId, 'meta.json');
        const metaContent = fs.readFileSync(metaPath, 'utf8');
        return JSON.parse(metaContent);
    } catch (error) {
        console.error(`Error loading book meta for ${bookId}:`, error);
        return null;
    }
}

// 全書籍メタデータを取得
export async function getAllBooksMeta(): Promise<BookMeta[]> {
    try {
        const bookDirs = fs.readdirSync(CONTENT_BASE_PATH);
        const booksMeta: BookMeta[] = [];

        for (const bookDir of bookDirs) {
            const bookPath = path.join(CONTENT_BASE_PATH, bookDir);
            if (fs.statSync(bookPath).isDirectory()) {
                const meta = await getBookMeta(bookDir);
                if (meta && meta.isPublished) {
                    booksMeta.push(meta);
                }
            }
        }

        return booksMeta;
    } catch (error) {
        console.error('Error loading all books meta:', error);
        return [];
    }
}

// 記事データを取得
export async function getArticleData(
    bookId: string,
    chapterId: string,
): Promise<ArticleData | null> {
    try {
        const articlePath = path.join(CONTENT_BASE_PATH, bookId, `${chapterId}.md`);
        const fileContent = fs.readFileSync(articlePath, 'utf8');
        const { data, content } = matter(fileContent);

        return {
            frontMatter: data as ArticleFrontMatter,
            content,
            slug: chapterId,
        };
    } catch (error) {
        console.error(`Error loading article ${bookId}/${chapterId}:`, error);
        return null;
    }
}

// 書籍の全記事を取得
export async function getBookArticles(bookId: string): Promise<ArticleData[]> {
    try {
        const bookPath = path.join(CONTENT_BASE_PATH, bookId);
        const files = fs.readdirSync(bookPath);
        const articles: ArticleData[] = [];

        for (const file of files) {
            if (file.endsWith('.md')) {
                const chapterId = file.replace('.md', '');
                const article = await getArticleData(bookId, chapterId);
                if (article) {
                    articles.push(article);
                }
            }
        }

        // チャプターIDでソート
        articles.sort((a, b) => {
            const aNum = parseChapterNumber(a.slug);
            const bNum = parseChapterNumber(b.slug);
            return aNum - bNum;
        });

        return articles;
    } catch (error) {
        console.error(`Error loading book articles for ${bookId}:`, error);
        return [];
    }
}

// チャプター番号を解析（例: "1-1" → 1.1）
function parseChapterNumber(chapterId: string): number {
    const parts = chapterId.split('-');
    if (parts.length === 2) {
        const major = parseInt(parts[0], 10);
        const minor = parseInt(parts[1], 10);
        return major + minor * 0.1;
    }
    return parseInt(chapterId, 10) || 0;
}

// 前後の記事を取得
export async function getNeighborArticles(bookId: string, currentChapterId: string) {
    const articles = await getBookArticles(bookId);
    const currentIndex = articles.findIndex(article => article.slug === currentChapterId);

    return {
        prev: currentIndex > 0 ? articles[currentIndex - 1] : null,
        next: currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null,
    };
}

// マークダウンをMDXコンポーネントとしてレンダリング
export function MarkdownRenderer({ content }: { content: string }) {
    return (
        <MDXRemote
            source={content}
            options={{
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeHighlight],
                },
            }}
        />
    );
}

// パンくずナビゲーション生成
export function generateBreadcrumbs(bookMeta: BookMeta | null, chapterId?: string) {
    const breadcrumbs = [
        { label: 'Home', href: '/' },
        { label: 'Books', href: '/books' },
    ];

    if (bookMeta) {
        breadcrumbs.push({
            label: bookMeta.title,
            href: `/books/${bookMeta.id}`,
        });

        if (chapterId) {
            const chapter = bookMeta.chapters.find(ch => ch.id === chapterId);
            if (chapter) {
                breadcrumbs.push({
                    label: chapter.title,
                    href: `/books/${bookMeta.id}/${chapterId}`,
                });
            }
        }
    }

    return breadcrumbs;
}
