"use client";

import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark-dimmed.css";
import { useState, useEffect } from "react";
import "zenn-content-css";

import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { parseProblemContent } from "./utils";
import { addCodeToNotion } from "@/components/notion/actions"; // Server Actionをインポート
import { ProbBtn2, BlueBtn } from "@/components/common/Btn";

function ProblemSet({ problemMarkdown, articleSlug, bookSlug, onClick, showProblem }) {
    hljs.registerLanguage("javascript", javascript);

    // MarkdownをHTMLに変換
    const problemHtml = markdownHtml(problemMarkdown);

    // HTMLをDOMとして解析する
    const parser = new DOMParser();
    const doc = parser.parseFromString(problemHtml, "text/html");
    console.log(doc);

    // 問題文を取得（<h1>要素が各問題のタイトル）
    const problemHeaders = Array.from(doc.querySelectorAll("h1"));

    // 状態管理：ユーザーが入力したコードの状態を管理
    const [submittedCodes, setSubmittedCodes] = useState(Array(problemHeaders.length).fill(""));
    const [isSubmitting, setIsSubmitting] = useState(Array(problemHeaders.length).fill(false)); // 提出状態を管理

    // コード提出ハンドラー
    const handleCodeSubmit = async (ind) => {
        if (isSubmitting[ind]) return; // 既に提出中の場合は何もしない

        // 提出中状態に設定
        const updatedIsSubmitting = [...isSubmitting];
        updatedIsSubmitting[ind] = true;
        setIsSubmitting(updatedIsSubmitting); // 状態を更新

        const code = submittedCodes[ind];
        const title = `問題 ${ind + 1}`;
        const name = localStorage.getItem("kenji_name");
        const index = ind + 1;

        try {
            await addCodeToNotion({ title, code, name, index, articleSlug, bookSlug }); // Server Actionを呼び出してコードをストック
            alert(`問題 ${ind + 1} のコードがNotionに提出されました！`);
        } catch (error) {
            console.error("Notionへの提出エラー:", error);
            alert("コードの提出に失敗しました。再度お試しください。");
        } finally {
            // 提出処理完了後に提出状態をリセット
            const resetIsSubmitting = [...isSubmitting];
            resetIsSubmitting[ind] = false;
            setIsSubmitting(resetIsSubmitting); // 状態を再度更新
        }
    };

    // コード入力変更ハンドラー
    const handleCodeChange = (index, value) => {
        const updatedCodes = [...submittedCodes];
        updatedCodes[index] = value;
        console.log(value, updatedCodes);
        setSubmittedCodes(updatedCodes);
    };

    useEffect(() => {
        const updatedCodes = [...submittedCodes];
        problemHeaders.forEach((header, index) => {
            const { _, defaultCode } = parseProblemContent(header);
            updatedCodes[index] = defaultCode;
            setSubmittedCodes(updatedCodes);
        });
    }, []);
    useEffect(() => {
        import("zenn-embed-elements");
    }, []);

    const formattedProblems = problemHeaders.map((header, index) => {
        // 問題文の詳細を解析
        const { problemContent } = parseProblemContent(header);

        return (
            <div key={index} className='problem' style={{ marginBottom: "32px" }}>
                <h3>{header.textContent}</h3>
                {/* 問題文の詳細を表示 */}
                <div dangerouslySetInnerHTML={{ __html: problemContent }} />

                {/* コード提出フォーム */}
                <div style={{ marginTop: "16px" }}>
                    <Editor
                        value={submittedCodes[index]}
                        onValueChange={(code) => handleCodeChange(index, code)}
                        highlight={(code) => hljs.highlight(code, { language: "javascript" }).value} // 言語を指定
                        padding={10}
                        placeholder='提出コードを入力してください'
                        className='editor'
                        style={{
                            fontFamily:
                                '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
                            fontSize: 15,
                            border: "1px solid #ddd",
                            borderRadius: "6px",
                            backgroundColor: "#192638",
                            minHeight: "200px",
                            lineHeight: "1.5em",
                            color: "#C0C5DB",
                            marginBottom: "16px",
                        }}
                    />

                    <BlueBtn
                        onClick={() => handleCodeSubmit(index)}
                        disabled={isSubmitting[index]} // 提出中はボタンを無効化
                    >
                        {isSubmitting[index] ? "提出中..." : "コードを提出"}
                    </BlueBtn>
                </div>
            </div>
        );
    });

    return (
        <div>
            {formattedProblems}

            <ProbBtn2 toggle={showProblem} onClick={onClick} />
        </div>
    );
}

export default ProblemSet;
