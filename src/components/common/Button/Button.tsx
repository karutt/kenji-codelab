'use client';

import { Button as ChakraButton, ButtonProps as ChakraButtonProps } from '@chakra-ui/react';
import React from 'react';

interface ButtonProps extends ChakraButtonProps {
    children: React.ReactNode;
    variant?: 'solid' | 'outline' | 'ghost' | 'subtle';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    colorScheme?: string;
}

export type { ButtonProps };

/**
 * 基本的なButtonコンポーネント
 * Chakra UI v3のButtonを拡張し、プロジェクト共通スタイルを適用
 */
export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'solid',
    size = 'md',
    colorScheme,
    ...props
}) => {
    // デフォルトのcolorScheme設定
    const defaultColorScheme = colorScheme || 'blue';

    // カスタムスタイル
    const customStyles = {
        fontWeight: 'medium',
        borderRadius: 'md',
        transition: 'all 0.2s',
        _hover: {
            ...props._hover,
        },
        _active: {
            ...props._active,
        },
    };

    return (
        <ChakraButton
            colorScheme={defaultColorScheme}
            size={size}
            variant={variant}
            {...customStyles}
            {...props}
        >
            {children}
        </ChakraButton>
    );
};
