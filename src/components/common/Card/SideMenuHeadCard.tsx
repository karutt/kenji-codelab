'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface SideMenuHeadCardProps extends BoxProps {
    children: React.ReactNode;
}

export type { SideMenuHeadCardProps };

/**
 * サイドメニューヘッダー用のCardコンポーネント
 * 元プロジェクトのSideMenuHeadCardを再実装
 */
export const SideMenuHeadCard: React.FC<SideMenuHeadCardProps> = ({ children, ...props }) => {
    return (
        <Box
            pos="relative"
            zIndex={1}
            w="full"
            maxW="700px"
            mb={2}
            p={0}
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
