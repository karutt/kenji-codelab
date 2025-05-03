import React from "react";
import Article from "@/features/article/components/Article";
import { getAllArticles, getArticleBySlug } from "@/features/article/api/articles";

/** SSG 用パラメータ生成 */
export async function generateStaticParams({ params }) {
    return getAllArticles(params.bookSlug).map(({ slug }) => ({
        bookSlug: params.bookSlug,
        articleSlug: slug,
    }));
}

/** 各記事ページ */
export default async function Page({ params }) {
    const { bookSlug, articleSlug } = params;
    const { content, data, card, problem, neighborsPage } = getArticleBySlug(bookSlug, articleSlug);

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
}
