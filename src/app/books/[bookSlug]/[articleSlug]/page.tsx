import { Box } from '@chakra-ui/react';

import { getAllArticles, getArticleBySlug } from '@/features/article/api/articles';
import Article from '@/features/article/components/Article';

/** SSG 用パラメータ生成 */
export async function generateStaticParams({ params }: { params: Promise<{ bookSlug: string }> }) {
    const { bookSlug } = await params;
    return getAllArticles(bookSlug).map(({ slug }) => ({
        bookSlug: bookSlug,
        articleSlug: slug,
    }));
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
