// components/ProblemSet/ProblemSet.jsx
"use client";

import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import highlight from "highlight.js";
import "highlight.js/styles/github.css";
import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { parseProblemContent } from "./utils";
import { addCodeToNotion } from "@/components/notion/actions"; // Server Actionをインポート

function ProblemSet({ problemMarkdown }) {
    // MarkdownをHTMLに変換
    const problemHtml = markdownHtml(problemMarkdown);

    // HTMLをDOMとして解析する
    const parser = new DOMParser();
    const doc = parser.parseFromString(problemHtml, "text/html");

    // 問題文を取得（<h1>要素が各問題のタイトル）
    const problemHeaders = Array.from(doc.querySelectorAll("h1"));

    // 状態管理：ユーザーが入力したコードの状態を管理
    const [submittedCodes, setSubmittedCodes] = useState(Array(problemHeaders.length).fill(""));

    // コード提出ハンドラー
    const handleCodeSubmit = async (index) => {
        const code = submittedCodes[index];
        const title = `問題 ${index + 1}`;

        try {
            await addCodeToNotion({ title, code }); // Server Actionを呼び出してコードをストック
            alert(`問題 ${index + 1} のコードがNotionに提出されました！`);
        } catch (error) {
            console.error("Notionへの提出エラー:", error);
            alert("コードの提出に失敗しました。再度お試しください。");
        }
    };

    // コード入力変更ハンドラー
    const handleCodeChange = (index, value) => {
        const updatedCodes = [...submittedCodes];
        updatedCodes[index] = value;
        setSubmittedCodes(updatedCodes);
    };

    // 各問題を解析し、表示するための要素を生成
    const formattedProblems = problemHeaders.map((header, index) => {
        // 問題文の詳細を解析
        const { problemContent, codeSnippet } = parseProblemContent(header);

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
                        highlight={(code) => highlight.highlightAuto(code).value}
                        padding={10}
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
                            fontSize: 14,
                            border: "1px solid #ddd",
                            borderRadius: "4px",
                            minHeight: "200px",
                        }}
                    />
                    <button
                        onClick={() => handleCodeSubmit(index)}
                        style={{
                            marginTop: "8px",
                            padding: "10px 20px",
                            backgroundColor: "#28a745",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                        }}>
                        コードを提出
                    </button>
                </div>
            </div>
        );
    });

    return <div>{formattedProblems}</div>;
}

export default ProblemSet;
