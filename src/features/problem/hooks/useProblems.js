import { toaster } from "@/components/ui/toaster";
import { useAuth } from "@/contexts/AuthContext";
import { useBookConfig } from "@/contexts/BookConfigContext";
import { addCodeToNotion } from "@/utils/notion/actions";
import { useEffect, useMemo, useState } from "react";
import markdownHtml from "zenn-markdown-html";
import { parseProblemContent } from "../utils/parseProblemContent";

export function useProblems(problemMarkdown, articleSlug, bookSlug) {
    // Markdown→HTML
    const problemHtml = useMemo(() => markdownHtml(problemMarkdown), [problemMarkdown]);
    const config = useBookConfig();
    const language = config["language"] || "javascript";

    // <h1> 要素配列
    const headers = useMemo(() => {
        const doc = new DOMParser().parseFromString(problemHtml, "text/html");
        return Array.from(doc.querySelectorAll("h1"));
    }, [problemHtml]);

    // code 入力と submit フラグ
    const [codes, setCodes] = useState(() => Array(headers.length).fill(""));
    const [loading, setLoading] = useState(() => Array(headers.length).fill(false));

    // 問題数変動時に defaultCode をセット
    useEffect(() => {
        setCodes((prev) => {
            const next = [...prev];
            headers.forEach((h, i) => {
                const { defaultCode } = parseProblemContent(h);
                if (next[i] == null) next[i] = defaultCode;
            });
            return next.slice(0, headers.length);
        });
    }, [headers]);

    // コード変更
    const onChange = (i, v) => {
        setCodes((prev) => {
            const next = [...prev];
            next[i] = v;
            return next;
        });
    };

    const { user } = useAuth();

    // 提出
    const onSubmit = async (i) => {
        if (loading[i]) return;
        setLoading((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
        });

        const promise = addCodeToNotion({
            title: `問題 ${i + 1}`,
            code: codes[i],
            name: (user && user.displayName) || localStorage.getItem("kenji_name") || "",
            index: i + 1,
            language,
            articleSlug,
            bookSlug,
        });

        toaster.promise(promise, {
            loading: {
                title: `問題 ${i + 1} を提出中...`,
                description: "しばらくお待ちください",
            },
            success: {
                title: `問題 ${i + 1} の提出が完了しました！`,
                description: "解答が正常に提出されました。",
                duration: 4000, // 6秒表示
            },
            error: {
                title: `問題 ${i + 1} の提出に失敗しました。`,
                description: "",
            },
        });

        try {
            await promise;
        } finally {
            setLoading((prev) => {
                const next = [...prev];
                next[i] = false;
                return next;
            });
        }
    };

    return { headers, codes, loading, onChange, onSubmit };
}
