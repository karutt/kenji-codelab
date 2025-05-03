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
            <div style={{ marginTop: 24 }}>
                <button onClick={onClick}>{showProblem ? "問題を隠す" : "問題を表示"}</button>
            </div>
        </div>
    );
}
