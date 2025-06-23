'use client';

// highlight.jsのテーマをインポート
import 'highlight.js/styles/github-dark.css';

import { Box, Clipboard, IconButton } from '@chakra-ui/react';
import hljs from 'highlight.js';
import { useEffect, useRef, useState } from 'react';

// 言語マッピング（よく使われる言語の略称を正式名称にマッピング）
const languageMap: Record<string, string> = {
    js: 'javascript',
    jsx: 'javascript',
    ts: 'typescript',
    tsx: 'typescript',
    py: 'python',
    rb: 'ruby',
    sh: 'bash',
    shell: 'bash',
    zsh: 'bash',
    yml: 'yaml',
    yaml: 'yaml',
    md: 'markdown',
    markdown: 'markdown',
    html: 'xml',
    htm: 'xml',
    css: 'css',
    scss: 'scss',
    sass: 'scss',
    less: 'less',
    json: 'json',
    sql: 'sql',
    php: 'php',
    java: 'java',
    kt: 'kotlin',
    kotlin: 'kotlin',
    cpp: 'cpp',
    'c++': 'cpp',
    c: 'c',
    go: 'go',
    rust: 'rust',
    rs: 'rust',
    swift: 'swift',
    dart: 'dart',
    vue: 'xml',
    xml: 'xml',
    dockerfile: 'dockerfile',
    docker: 'dockerfile',
    nginx: 'nginx',
    apache: 'apache',
    diff: 'diff',
    patch: 'diff',
    ini: 'ini',
    cfg: 'ini',
    toml: 'ini',
    r: 'r',
    matlab: 'matlab',
    scala: 'scala',
    perl: 'perl',
    pl: 'perl',
    lua: 'lua',
    vim: 'vim',
    tex: 'latex',
    latex: 'latex',
    makefile: 'makefile',
    make: 'makefile',
};

interface CodeBlockProps {
    code: string;
    language?: string;
    isTemplate?: boolean;
}

export function CodeBlock({ code, language, isTemplate = false }: CodeBlockProps) {
    const codeRef = useRef<HTMLElement>(null);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
        if (codeRef.current) {
            let highlightedCode: string;

            if (!language) {
                // 言語が指定されていない場合は自動検出
                const result = hljs.highlightAuto(code);
                highlightedCode = result.value;
            } else {
                // 言語マッピングを適用
                const mappedLanguage =
                    languageMap[language.toLowerCase()] || language.toLowerCase();

                try {
                    // 指定された言語でハイライト
                    const result = hljs.highlight(code, { language: mappedLanguage });
                    highlightedCode = result.value;
                } catch {
                    // 言語が認識できない場合は自動検出にフォールバック
                    console.warn(
                        `Language "${mappedLanguage}" not recognized, falling back to auto-detection`,
                    );
                    const result = hljs.highlightAuto(code);
                    highlightedCode = result.value;
                }
            }

            codeRef.current.innerHTML = highlightedCode;
        }
    }, [code, language]);

    return (
        <Box
            pos="relative"
            overflow="hidden"
            w="100%"
            maxW="100%"
            my={6}
            bg={isTemplate ? 'blue.900' : 'gray.900'}
            border={isTemplate ? '2px solid' : undefined}
            borderColor={isTemplate ? 'blue.500' : undefined}
            borderRadius="md"
            shadow="xl"
            _hover={{
                shadow: '2xl',
                borderColor: isTemplate ? 'blue.400' : 'gray.600',
            }}
            transition="all 0.2s"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Template indicator */}
            {isTemplate && (
                <Box
                    pos="absolute"
                    zIndex={10}
                    top={2}
                    left={3}
                    px={2}
                    py={1}
                    color="white"
                    fontSize="xs"
                    fontWeight="bold"
                    bg="blue.500"
                    borderRadius="sm"
                >
                    テンプレート
                </Box>
            )}
            {/* Copy button - positioned absolutely in top right */}
            <Clipboard.Root value={code}>
                <Clipboard.Trigger asChild>
                    <IconButton
                        pos="absolute"
                        zIndex={10}
                        top={3}
                        right={3}
                        color="gray.400"
                        bg="gray.800"
                        opacity={isHovered ? 1 : 0.7}
                        _hover={{ color: 'gray.200', bg: 'gray.700' }}
                        transition="all 0.2s"
                        aria-label="コードをコピー"
                        size="sm"
                        variant="ghost"
                    >
                        <Clipboard.Indicator />
                    </IconButton>
                </Clipboard.Trigger>
            </Clipboard.Root>

            {/* Code content */}
            <Box
                as="pre"
                overflowX="auto"
                overflowY="auto"
                w="100%"
                minW={0}
                maxW="100%"
                m={0}
                p={5}
                pr={12} // Add right padding to avoid overlap with copy button
                color="#e1e4e8"
                fontFamily="ui-monospace, SF Mono, Monaco, Inconsolata, Roboto Mono, Courier New, monospace"
                fontSize="14px"
                lineHeight="1.6"
                bg="code.bg"
                css={{
                    scrollbarWidth: 'thin',
                    scrollbarColor: 'rgba(255, 255, 255, 0.2) rgba(0, 0, 0, 0.1)',
                    '&::-webkit-scrollbar': {
                        width: '8px',
                        height: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                        background: 'rgba(255, 255, 255, 0.3)',
                    },
                    // highlight.jsテーマのスタイルをオーバーライド
                    '& .hljs': {
                        background: 'transparent !important',
                        padding: '0 !important',
                    },
                }}
            >
                <code
                    ref={codeRef}
                    style={{
                        display: 'block',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'normal',
                        overflowWrap: 'normal',
                        background: 'transparent',
                        color: 'inherit',
                        fontFamily: 'inherit',
                        fontSize: '0.95em',
                        padding: 0,
                        margin: 0,
                        lineHeight: '1.9',
                    }}
                >
                    {code}
                </code>
            </Box>
        </Box>
    );
}
