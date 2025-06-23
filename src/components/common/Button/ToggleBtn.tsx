'use client';

import { Box, IconButton } from '@chakra-ui/react';
import React from 'react';

interface ToggleBtnProps {
    toggle: boolean;
    onClick: () => void;
    activeIcon?: React.ReactNode;
    inactiveIcon?: React.ReactNode;
    position?: 'fixed' | 'absolute' | 'relative';
    bottom?: string | number;
    right?: string | number;
    size?: 'sm' | 'md' | 'lg';
    colorScheme?: string;
}

export type { ToggleBtnProps };

/**
 * トグル機能付きボタンコンポーネント
 * 元プロジェクトのToggleBtnを再実装
 * カード表示切り替えなどに使用
 */
export const ToggleBtn: React.FC<ToggleBtnProps> = ({
    toggle,
    onClick,
    activeIcon,
    inactiveIcon,
    position = 'fixed',
    bottom = '120px',
    right = '40px',
    size = 'lg',
    colorScheme = 'blue',
    ...props
}) => {
    // デフォルトアイコン（カード表示切り替え用）
    const defaultActiveIcon = '📚';
    const defaultInactiveIcon = '📖';

    return (
        <Box pos={position} zIndex={1000} right={right} bottom={bottom} {...props}>
            <IconButton
                color={toggle ? 'white' : 'brand.shark'}
                bg={toggle ? 'brand.blue' : 'white'}
                border="2px solid"
                borderColor={toggle ? 'brand.blue' : 'brand.black12'}
                borderRadius="full"
                shadow="lg"
                _hover={{
                    transform: 'scale(1.05)',
                    boxShadow: 'xl',
                }}
                _active={{
                    transform: 'scale(0.95)',
                }}
                transition="all 0.2s"
                aria-label={toggle ? 'Hide content' : 'Show content'}
                colorScheme={colorScheme}
                onClick={onClick}
                size={size}
            >
                {toggle ? activeIcon || defaultActiveIcon : inactiveIcon || defaultInactiveIcon}
            </IconButton>
        </Box>
    );
};
