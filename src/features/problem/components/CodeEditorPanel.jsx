// src/features/problem/components/CodeEditorPanel.jsx
"use client";

import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import "highlight.js/styles/github-dark-dimmed.css";
import Editor from "react-simple-code-editor";

// JavaScript 分のハイライトを一度だけ登録
hljs.registerLanguage("javascript", javascript);

export default function CodeEditorPanel({ value, onChange }) {
    return (
        <Editor
            value={value}
            onValueChange={onChange}
            highlight={(code) => hljs.highlight(code, { language: "javascript" }).value}
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
                margin: "16px 0",
            }}
        />
    );
}
