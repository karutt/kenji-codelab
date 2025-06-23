import { Box } from '@chakra-ui/react';

import { getAllArticles, getArticleBySlug } from '@/features/article/api/articles';
import Article from '@/features/article/components/Article';

/** SSG 用パラメータ生成 */
export async function generateStaticParams() {
    const fs = await import('fs');
    const path = await import('path');

    // すべてのブックを取得
    const dirPath = path.join(process.cwd(), 'public/books');
    const bookSlugs = fs.readdirSync(dirPath).filter(file => {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    const allParams: { bookSlug: string; articleSlug: string }[] = [];

    // 各ブックの記事を取得
    bookSlugs.forEach(bookSlug => {
        const articles = getAllArticles(bookSlug);

        articles.forEach(({ slug }) => {
            allParams.push({
                bookSlug,
                articleSlug: slug,
            });
        });
    });

    return allParams;
}

/** 各記事ページ */
export default async function ArticlePage({
    params,
}: {
    params: Promise<{ bookSlug: string; articleSlug: string }>;
}) {
    const { bookSlug, articleSlug } = await params;

    try {
        const { content, data, card, problem, neighborsPage } = getArticleBySlug(
            bookSlug,
            articleSlug,
        );

        return (
            <Article
                markdown={content}
                card={card}
                problem={problem}
                frontMatter={data}
                articleSlug={articleSlug}
                bookSlug={bookSlug}
                neighborsPage={neighborsPage}
            />
        );
    } catch {
        return (
            <Box p={8} textAlign="center">
                <h1>Article not found</h1>
                <p>The requested article could not be found.</p>
            </Box>
        );
    }
}
