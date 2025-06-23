'use client';

import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface HeaderBoxProps extends Omit<BoxProps, 'children'> {
    children: ReactNode;
    variant?: 'default' | 'accent' | 'minimal';
    active?: boolean;
    hover?: boolean;
}

export function HeaderBox({
    children,
    variant = 'default',
    active = false,
    hover = true,
    ...props
}: HeaderBoxProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case 'accent':
                return {
                    bg: active ? 'blue.100' : 'transparent',
                    borderColor: active ? 'blue.300' : 'gray.200',
                    color: active ? 'blue.700' : 'gray.700',
                    _hover: hover
                        ? {
                              bg: 'blue.50',
                              borderColor: 'blue.200',
                              color: 'blue.600',
                              transform: 'translateY(-1px)',
                              shadow: 'sm',
                          }
                        : undefined,
                    _dark: {
                        bg: active ? 'blue.800' : 'transparent',
                        borderColor: active ? 'blue.600' : 'gray.600',
                        color: active ? 'blue.200' : 'gray.200',
                        _hover: hover
                            ? {
                                  bg: 'blue.900',
                                  borderColor: 'blue.500',
                                  color: 'blue.100',
                              }
                            : undefined,
                    },
                };
            case 'minimal':
                return {
                    bg: 'transparent',
                    border: 'none',
                    color: active ? 'blue.600' : 'gray.600',
                    _hover: hover
                        ? {
                              color: 'blue.600',
                              bg: 'blue.50',
                          }
                        : undefined,
                    _dark: {
                        color: active ? 'blue.300' : 'gray.300',
                        _hover: hover
                            ? {
                                  color: 'blue.300',
                                  bg: 'blue.900',
                              }
                            : undefined,
                    },
                };
            default:
                return {
                    bg: active ? 'gray.100' : 'white',
                    borderColor: active ? 'gray.300' : 'gray.200',
                    color: active ? 'gray.800' : 'gray.600',
                    _hover: hover
                        ? {
                              bg: 'gray.50',
                              borderColor: 'gray.300',
                              transform: 'translateY(-1px)',
                              shadow: 'sm',
                          }
                        : undefined,
                    _dark: {
                        bg: active ? 'gray.700' : 'gray.800',
                        borderColor: active ? 'gray.600' : 'gray.700',
                        color: active ? 'gray.100' : 'gray.300',
                        _hover: hover
                            ? {
                                  bg: 'gray.600',
                                  borderColor: 'gray.500',
                              }
                            : undefined,
                    },
                };
        }
    };

    return (
        <Box
            px={4}
            py={2}
            border="1px solid"
            borderRadius="md"
            userSelect="none"
            cursor={hover ? 'pointer' : 'default'}
            transition="all 0.2s ease-in-out"
            {...getVariantStyles()}
            {...props}
        >
            {children}
        </Box>
    );
}

export default HeaderBox;
