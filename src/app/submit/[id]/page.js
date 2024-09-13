// /app/submit/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { fetchSubmissionById } from "@/components/notion/actions"; // 特定の提出物を取得する関数

export default function SubmissionDetailPage({ params }) {
    const id = params.id; // 動的なidを取得
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return; // IDが取得できていない場合は早期リターン

        const loadSubmission = async () => {
            try {
                const data = await fetchSubmissionById(id); // 提出物の詳細を取得
                setSubmission(data);
            } catch (error) {
                console.error("Failed to fetch submission details:", error);
            } finally {
                setLoading(false); // ローディング終了
            }
        };

        loadSubmission();
    }, [id]);

    if (loading) {
        return <p>ロード中...</p>;
    }

    if (!submission) {
        return <p>提出物が見つかりませんでした。</p>;
    }

    return (
        <div style={{ marginTop: "64px" }}>
            <h1>{submission.Title}の詳細</h1>
            <p>
                <strong>Number:</strong> {submission.Number}
            </p>
            <p>
                <strong>Name:</strong> {submission.Name}
            </p>
            <p>
                <strong>Index:</strong> {submission.Index}
            </p>
            <p>
                <strong>Section:</strong> {submission.Section}
            </p>
            <p>
                <strong>Book:</strong> {submission.Book}
            </p>
            <p>
                <strong>Created:</strong> {submission.Created}
            </p>
            <h2>提出コンテンツ</h2>
            <pre>
                <code>{submission.Content}</code>
            </pre>{" "}
            {/* 提出コンテンツを表示 */}
        </div>
    );
}
