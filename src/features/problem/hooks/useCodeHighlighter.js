// src/features/problem/hooks/useCodeHighlighter.js
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import python from "highlight.js/lib/languages/python";
import { useEffect, useMemo, useState } from "react";

const registered = new Set();
const languageMap = {
    javascript,
    python,
};

export function useCodeHighlighter(language) {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!languageMap[language]) {
            console.warn(`Unsupported language: ${language}`);
            setIsReady(false);
            return;
        }

        if (!registered.has(language)) {
            hljs.registerLanguage(language, languageMap[language]);
            registered.add(language);
        }

        setIsReady(true);
    }, [language]);

    return useMemo(() => {
        return (code) => {
            if (!isReady) return code;
            try {
                return hljs.highlight(code, { language }).value;
            } catch (e) {
                console.warn("highlight error:", e);
                return code;
            }
        };
    }, [isReady, language]);
}
