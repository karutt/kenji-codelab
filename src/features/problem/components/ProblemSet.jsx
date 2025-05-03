"use client";
import "zenn-content-css";
import { useProblems } from "../hooks/useProblems";
import ProblemList from "./ProblemList";

export default function ProblemSet({
    problemMarkdown,
    articleSlug,
    bookSlug,
    onClick,
    showProblem,
}) {
    const { headers, codes, loading, onChange, onSubmit } = useProblems(
        problemMarkdown,
        articleSlug,
        bookSlug
    );

    return (
        <div>
            <ProblemList
                headers={headers}
                codes={codes}
                loading={loading}
                onChange={onChange}
                onSubmit={onSubmit}
            />
        </div>
    );
}
