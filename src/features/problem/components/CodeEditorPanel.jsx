// src/features/problem/components/CodeEditorPanel.jsx
"use client";

import { useBookConfig } from "@/contexts/BookConfigContext";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";

import "highlight.js/styles/github-dark-dimmed.css";
import { useEffect, useMemo, useState } from "react";
import Editor from "react-simple-code-editor";

const registered = new Set();

const languageMap = {
    javascript,
    python,
};

export default function CodeEditorPanel({ value, onChange }) {
    const config = useBookConfig();
    const language = config["language"] || "javascript";

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!registered.has(language) && languageMap[language]) {
            hljs.registerLanguage(language, languageMap[language]);
            registered.add(language);
        }
        setIsReady(true);
    }, [language]);

    const highlightCode = useMemo(() => {
        if (!isReady) return (code) => code;
        return (code) => {
            try {
                return hljs.highlight(code, { language }).value;
            } catch (e) {
                console.warn("ハイライトエラー:", e);
                return code;
            }
        };
    }, [isReady, language]);

    return (
        <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightCode}
            padding={10}
            placeholder='提出コードを入力してください'
            className='editor'
            style={{
                fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
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
