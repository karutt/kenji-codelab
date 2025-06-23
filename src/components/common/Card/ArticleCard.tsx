'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface ArticleCardProps extends BoxProps {
    children: React.ReactNode;
    maxWidth?: string | number;
}

export type { ArticleCardProps };

/**
 * 記事表示用のCardコンポーネント
 * 元プロジェクトのArticleCardを再実装
 */
export const ArticleCard: React.FC<ArticleCardProps> = ({
    children,
    maxWidth = '860px',
    ...props
}) => {
    return (
        <Box
            pos="relative"
            zIndex={1}
            w="full"
            maxW={maxWidth}
            px={0}
            py={0}
            pb={8}
            bg="white"
            border="1px solid"
            borderColor="brand.black12"
            borderRadius="lg"
            shadow="0 2px 10px rgba(0, 0, 0, 0.05)"
            {...props}
        >
            {children}
        </Box>
    );
};
