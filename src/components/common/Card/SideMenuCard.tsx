'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface SideMenuCardProps extends BoxProps {
    children: React.ReactNode;
    sticky?: boolean;
    scrollBehavior?: 'auto' | 'hidden';
    showHeader?: boolean;
}

export type { SideMenuCardProps };

/**
 * サイドメニュー用のCardコンポーネント
 * 元プロジェクトのSideMenuCardを再実装
 * スクロール連動でヘッダーと同期して動作
 */
export const SideMenuCard: React.FC<SideMenuCardProps> = ({
    children,
    sticky = true,
    scrollBehavior = 'auto',
    showHeader = true,
    ...props
}) => {
    return (
        <Box
            pos={sticky ? 'sticky' : 'static'}
            top={showHeader ? '64px' : '32px'}
            overflowY={scrollBehavior}
            h="calc(100vh - 64px)"
            p={0}
            pb="120px"
            bg="white"
            border="1px solid"
            borderColor="brand.black12"
            borderRadius="xl"
            transition="top 0.3s cubic-bezier(.4,0,.2,1)"
            // スクロールバーを隠す
            css={{
                '&::-webkit-scrollbar': {
                    display: 'none',
                },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
            }}
            {...props}
        >
            {children}
        </Box>
    );
};
