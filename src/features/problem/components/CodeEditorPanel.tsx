'use client';

import 'highlight.js/styles/github-dark-dimmed.css';

import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import { useEffect, useMemo, useState } from 'react';
import Editor from 'react-simple-code-editor';

import { useBookConfig } from '@/contexts/BookConfigContext';

const registered = new Set<string>();

const languageMap = {
    javascript,
    python,
} as const;

interface CodeEditorPanelProps {
    value: string;
    onChange: (value: string) => void;
}

export default function CodeEditorPanel({ value, onChange }: CodeEditorPanelProps) {
    const config = useBookConfig();
    const language = config.language || 'javascript';

    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!registered.has(language) && language in languageMap) {
            hljs.registerLanguage(language, languageMap[language as keyof typeof languageMap]);
            registered.add(language);
        }
        setIsReady(true);
    }, [language]);

    const highlightCode = useMemo(() => {
        if (!isReady) return (code: string) => code;
        return (code: string) => {
            try {
                return hljs.highlight(code, { language }).value;
            } catch (e) {
                console.warn('ハイライトエラー:', e);
                return code;
            }
        };
    }, [isReady, language]);

    return (
        <Editor
            value={value}
            onValueChange={onChange}
            highlight={highlightCode}
            padding={18}
            placeholder={'提出コードを入力してください'}
            className="editor"
            style={{
                fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: 15,
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#192638',
                minHeight: '200px',
                lineHeight: '1.5em',
                color: '#C0C5DB',
                margin: '16px 0',
                cursor: 'text',
                opacity: 1,
            }}
        />
    );
}
