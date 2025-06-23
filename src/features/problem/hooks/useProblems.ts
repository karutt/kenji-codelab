'use client';

import { useEffect, useMemo, useState } from 'react';

import { toaster } from '@/components/ui/toaster';
import { useAuth } from '@/contexts/AuthContext';
import { useBookConfig } from '@/contexts/BookConfigContext';
import { addCodeToNotion } from '@/utils/notion/actions';

import { parseProblemContent } from '../utils/parseProblemContent';

export const useProblems = (problemMarkdown: string, articleSlug: string, bookSlug: string) => {
    const { user } = useAuth();
    const { language } = useBookConfig();
    const [codes, setCodes] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean[]>([]);

    // Parse problems from markdown
    const problemData = useMemo(() => {
        if (!problemMarkdown || typeof problemMarkdown !== 'string') {
            return [];
        }

        // Split markdown by H1 headers to get individual problems
        const sections = problemMarkdown.split(/^# /m).filter(Boolean);

        return sections.map((section, index) => {
            const lines = section.split('\n');
            const problemText = lines[0]?.trim() || `問題 ${index + 1}`;

            // Restore the H1 header for all problems
            const contentWithHeader = `# ${problemText}\n${lines.slice(1).join('\n')}`;
            const parsed = parseProblemContent(contentWithHeader);

            return {
                id: index + 1,
                title: problemText,
                content: parsed.content || '',
                defaultCode: parsed.templateCode || '',
            };
        });
    }, [problemMarkdown]);

    // Initialize codes and loading states
    useEffect(() => {
        setCodes(problemData.map(problem => problem.defaultCode));
        setLoading(Array(problemData.length).fill(false));
    }, [problemData]);

    // Handle code changes
    const onChange = (index: number, value: string) => {
        setCodes(prev => {
            const next = [...prev];
            next[index] = value;
            return next;
        });
    };

    // Handle code submission
    const onSubmit = async (index: number) => {
        if (loading[index]) return;

        setLoading(prev => {
            const next = [...prev];
            next[index] = true;
            return next;
        });

        const promise = addCodeToNotion({
            title: `問題 ${index + 1}`,
            code: codes[index],
            name: user?.displayName || localStorage.getItem('kenji_name') || '',
            index: index + 1,
            language,
            articleSlug,
            bookSlug,
        });

        toaster.promise(promise, {
            loading: {
                title: `問題 ${index + 1} を提出中...`,
                description: 'しばらくお待ちください',
            },
            success: {
                title: `問題 ${index + 1} の提出が完了しました！`,
                description: '解答が正常に提出されました。',
                duration: 4000,
            },
            error: {
                title: `問題 ${index + 1} の提出に失敗しました。`,
                description: '',
            },
        });

        try {
            await promise;
        } finally {
            setLoading(prev => {
                const next = [...prev];
                next[index] = false;
                return next;
            });
        }
    };

    return {
        problemData,
        codes,
        loading,
        onChange,
        onSubmit,
    };
};
