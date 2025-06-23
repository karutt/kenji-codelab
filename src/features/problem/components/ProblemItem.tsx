'use client';

import { Box, Button, Spinner } from '@chakra-ui/react';

import { MarkdownContent } from '@/components/common/MarkdownContent';

import { ProblemData } from '../types';
import CodeEditorPanel from './CodeEditorPanel';

interface ProblemItemProps {
    index: number;
    problem: ProblemData;
    code: string;
    loading: boolean;
    onChange: (index: number, value: string) => void;
    onSubmit: (index: number) => void;
}

export default function ProblemItem({
    index,
    problem,
    code,
    loading,
    onChange,
    onSubmit,
}: ProblemItemProps) {
    const initialValue = code || problem.defaultCode;

    return (
        <Box mb={8}>
            {/* Use MarkdownContent to render the problem content properly */}
            <Box mb={4}>
                <MarkdownContent content={problem.content || ''} hideTemplateBlocks={true} />
            </Box>

            <CodeEditorPanel value={initialValue} onChange={v => onChange(index, v)} />

            <Button
                w="100%"
                py={5}
                color="white"
                fontSize="md"
                bg="brand.blue"
                _hover={
                    !loading
                        ? {
                              bg: 'brand.blue',
                              opacity: 0.9,
                          }
                        : {}
                }
                disabled={loading}
                onClick={() => {
                    if (!loading) {
                        onSubmit(index);
                    }
                }}
            >
                {loading ? (
                    <>
                        コードを提出中...
                        <Spinner />
                    </>
                ) : (
                    'コードを提出する'
                )}
            </Button>
        </Box>
    );
}
