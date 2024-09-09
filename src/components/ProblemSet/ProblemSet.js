// components/ProblemSet/ProblemSet.jsx
"use client";

import Editor from "react-simple-code-editor";
import hljs from "highlight.js/lib/core"; // highlight.jsのコアモジュールをインポート
import javascript from "highlight.js/lib/languages/javascript"; // JavaScriptのシンタックスハイライトをインポート
import "highlight.js/styles/github-dark-dimmed.css"; // ダークテーマのCSSをインポート
import { useState } from "react";

import markdownHtml from "zenn-markdown-html";
import "zenn-content-css";
import { parseProblemContent } from "./utils";
import { addCodeToNotion } from "@/components/notion/actions"; // Server Actionをインポート
import { ProbBtn2, BlueBtn } from "@/components/common/Btn";
import { background } from "styled-system";

function ProblemSet({
    problemMarkdown,
    articleSlug,
    bookSlug,
    onClick,
    showProblemBtn,
    showProblem,
}) {
    hljs.registerLanguage("javascript", javascript);

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
    const handleCodeSubmit = async (ind) => {
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
                        highlight={(code) => hljs.highlight(code, { language: "javascript" }).value} // 言語を指定
                        padding={10}
                        placeholder='提出コードを入力してください'
                        className='editor'
                        style={{
                            fontFamily: '"Fira code", "Fira Mono", monospace',
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

                    <BlueBtn onClick={() => handleCodeSubmit(index)}>コードを提出</BlueBtn>
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
