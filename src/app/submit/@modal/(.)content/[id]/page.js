// src/app/submit/@modal/(.)content/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchSubmissionById } from "@/components/notion/actions"; // 提出物を取得する関数をインポート
import Modal from "@/components/common/Modal"; // モーダルコンポーネントをインポート

export default function SubmissionModalPage({ params }) {
    const router = useRouter();
    const id = params.id;
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const loadSubmission = async () => {
            try {
                const data = await fetchSubmissionById(id);
                setSubmission(data);
            } catch (error) {
                console.error("Failed to fetch submission details:", error);
            } finally {
                setLoading(false);
            }
        };

        loadSubmission();
    }, [id]);

    const handleClose = () => {
        router.back(); // モーダルを閉じるときに前のページに戻る
    };

    if (loading) {
        return null; // モーダルが開くまで何も表示しない
    }

    if (!submission) {
        return null;
    }

    return (
        <Modal onClose={handleClose}>
            <h1>{submission.Title}の詳細</h1>
            {/* 詳細情報を表示 */}
            <p>
                <strong>ID:</strong> {submission.id}
            </p>
            {/* 他の詳細情報 */}
        </Modal>
    );
}
