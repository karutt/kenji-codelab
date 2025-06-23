'use client';

import 'zenn-content-css';

import { useProblems } from '../hooks/useProblems';
import ProblemList from './ProblemList';

interface ProblemSetProps {
    problemMarkdown: string;
    articleSlug: string;
    bookSlug: string;
}

export default function ProblemSet({ problemMarkdown, articleSlug, bookSlug }: ProblemSetProps) {
    const { problemData, codes, loading, onChange, onSubmit } = useProblems(
        problemMarkdown,
        articleSlug,
        bookSlug,
    );

    return (
        <div>
            <ProblemList
                problemData={problemData}
                codes={codes}
                loading={loading}
                onChange={onChange}
                onSubmit={onSubmit}
            />
        </div>
    );
}
