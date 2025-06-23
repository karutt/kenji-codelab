'use client';

import { Box, BoxProps, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';

export interface NeighborLinkCardProps extends BoxProps {
    /**
     * The URL to navigate to when the card is clicked
     */
    link: string;
    /**
     * The title text to display
     */
    title: string;
    /**
     * Whether this is the next article link (vs previous)
     * Affects the layout and arrow direction
     * @default false
     */
    next?: boolean;
    /**
     * Custom label for the link type
     * @default "Prev" or "Next" based on next prop
     */
    label?: string;
    /**
     * Whether to show the arrow icon
     * @default true
     */
    showArrow?: boolean;
    /**
     * Custom arrow icon or text
     * @default "←" or "→" based on next prop
     */
    arrow?: React.ReactNode;
}

/**
 * NeighborLinkCard component for navigation between articles
 *
 * Provides a card-style link to the previous or next article in a series,
 * with appropriate styling and directional indicators.
 */
export function NeighborLinkCard({
    link,
    title,
    next = false,
    label,
    showArrow = true,
    arrow,
    ...props
}: NeighborLinkCardProps) {
    const defaultLabel = next ? 'Next' : 'Prev';
    const defaultArrow = next ? '→' : '←';

    return (
        <Box flex={1} maxW={['100%', '360px']} {...props}>
            <Link href={link} passHref style={{ display: 'block', height: '100%' }}>
                <Flex
                    align="center"
                    justify={next ? 'space-between' : 'flex-start'}
                    direction={next ? 'row-reverse' : 'row'}
                    gap={3}
                    h="100%"
                    px={6}
                    py={4}
                    bg="white"
                    border="1px solid"
                    borderColor="brand.black12"
                    borderRadius="8px"
                    _hover={{
                        opacity: 0.9,
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    _active={{
                        transform: 'translateY(0)',
                        boxShadow: '0 1px 4px rgba(0, 123, 255, 0.1)',
                    }}
                    cursor="pointer"
                    transition="all 0.2s"
                >
                    {showArrow && (
                        <Box as="span" color="brand.blue" fontSize="lg" fontWeight="bold">
                            {arrow || defaultArrow}
                        </Box>
                    )}
                    <Box flex="1" fontSize="md">
                        <Box mb={1} color="brand.hitGray" fontSize="sm">
                            {label || defaultLabel}
                        </Box>
                        <Box
                            color="brand.shark"
                            fontWeight="semibold"
                            lineHeight="1.3"
                            lineClamp={2}
                        >
                            {title}
                        </Box>
                    </Box>
                </Flex>
            </Link>
        </Box>
    );
}

export default NeighborLinkCard;
