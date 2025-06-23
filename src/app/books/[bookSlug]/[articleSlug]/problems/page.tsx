import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAllArticles, getArticleBySlug } from '@/features/article/api/articles';
import { ProblemPage } from '@/features/problem';

interface PageProps {
    params: Promise<{
        bookSlug: string;
        articleSlug: string;
    }>;
}

/** SSG 用パラメータ生成 - problems ページ用 */
export async function generateStaticParams() {
    const fs = await import('fs');
    const path = await import('path');

    // すべてのブックを取得
    const dirPath = path.join(process.cwd(), 'public/books');
    const bookSlugs = fs.readdirSync(dirPath).filter(file => {
        return fs.statSync(path.join(dirPath, file)).isDirectory();
    });

    const allParams: { bookSlug: string; articleSlug: string }[] = [];

    // 各ブックの記事を取得し、問題ファイルが存在するもののみを対象にする
    bookSlugs.forEach(bookSlug => {
        const articles = getAllArticles(bookSlug);

        articles.forEach(({ slug }) => {
            // 問題ファイルが存在するかチェック
            const probPath = path.join(
                process.cwd(),
                `public/books/${bookSlug}/prob`,
                `${slug}.md`,
            );
            if (fs.existsSync(probPath)) {
                allParams.push({
                    bookSlug,
                    articleSlug: slug,
                });
            }
        });
    });

    return allParams;
}

interface PageProps {
    params: Promise<{
        bookSlug: string;
        articleSlug: string;
    }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { bookSlug, articleSlug } = await params;

    try {
        const { data } = getArticleBySlug(bookSlug, articleSlug);

        return {
            title: `問題: ${data.title || 'Untitled'} | KeNJi CodeLab`,
            description: `${data.title || 'Untitled'}の問題にチャレンジしよう`,
        };
    } catch {
        return {
            title: '問題 | KeNJi CodeLab',
            description: 'プログラミング問題にチャレンジしよう',
        };
    }
}

export default async function ProblemsPage({ params }: PageProps) {
    const { bookSlug, articleSlug } = await params;

    try {
        const { problem, data } = getArticleBySlug(bookSlug, articleSlug);

        // If no problem file exists, show 404
        if (!problem) {
            notFound();
        }

        return (
            <ProblemPage
                problemMarkdown={problem}
                articleSlug={articleSlug}
                bookSlug={bookSlug}
                articleTitle={data.title || 'Untitled'}
            />
        );
    } catch (error) {
        console.error('Error loading problem page:', error);
        notFound();
    }
}
