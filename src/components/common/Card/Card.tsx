'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import React from 'react';

interface CardProps extends BoxProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outline' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
}

export type { CardProps };

/**
 * 基本的なCardコンポーネント
 * 元プロジェクトのstyled-components Cardを Chakra UI v3で再実装
 */
export const Card: React.FC<CardProps> = ({
    children,
    variant = 'outline',
    size = 'md',
    ...props
}) => {
    // サイズに応じたパディング設定
    const paddingMap = {
        sm: 4,
        md: 8,
        lg: 12,
    };

    // バリアント別スタイル設定
    const variantStyles = {
        elevated: {
            bg: 'white',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: 'none',
        },
        outline: {
            bg: 'white',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
            border: '1px solid',
            borderColor: 'brand.black12',
        },
        subtle: {
            bg: 'brand.lilac',
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'brand.black12',
        },
    };

    return (
        <Box
            pos="relative"
            zIndex={1}
            w="full"
            maxW="700px"
            p={paddingMap[size]}
            borderRadius="lg"
            {...variantStyles[variant]}
            {...props}
        >
            {children}
        </Box>
    );
};
