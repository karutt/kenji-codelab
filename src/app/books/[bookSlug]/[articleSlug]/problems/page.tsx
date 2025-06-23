import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getArticleBySlug } from '@/features/article/api/articles';
import { ProblemPage } from '@/features/problem';

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
