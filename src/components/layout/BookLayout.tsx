'use client';

import { Box, Container, Flex, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';

import { Breadcrumb, NeighborLinkCard } from '@/components/common';

export interface BookLayoutProps {
    children: ReactNode;
    bookTitle?: string;
    currentChapter?: string;
    breadcrumbItems?: Array<{
        label: string;
        href?: string;
        isCurrent?: boolean;
    }>;
    sidebarContent?: ReactNode;
    previousArticle?: {
        title: string;
        href: string;
    };
    nextArticle?: {
        title: string;
        href: string;
    };
    showSidebar?: boolean;
}

export function BookLayout({
    children,
    bookTitle,
    currentChapter,
    breadcrumbItems = [],
    sidebarContent,
    previousArticle,
    nextArticle,
    showSidebar = true,
}: BookLayoutProps) {
    return (
        <Box minH="100vh" bg="brand.lilac">
            <Container maxW="1200px" mx="auto" px={6} py={8}>
                {/* Breadcrumb Navigation */}
                {breadcrumbItems.length > 0 && (
                    <Box mb={6}>
                        <Breadcrumb items={breadcrumbItems} />
                    </Box>
                )}

                {/* Book Title */}
                {bookTitle && (
                    <Box mb={8} textAlign="center">
                        <Text mb={2} color="brand.shark" fontSize="3xl" fontWeight="bold">
                            {bookTitle}
                        </Text>
                        {currentChapter && (
                            <Text color="brand.abbey" fontSize="lg">
                                {currentChapter}
                            </Text>
                        )}
                    </Box>
                )}

                <Flex align="flex-start" direction={{ base: 'column', lg: 'row' }} gap={8}>
                    {/* Main Content Area */}
                    <Box flex="1" minW="0">
                        {children}

                        {/* Previous/Next Navigation */}
                        {(previousArticle || nextArticle) && (
                            <Box mt={12}>
                                <HStack justify="space-between" flexWrap="wrap" gap={4}>
                                    {previousArticle ? (
                                        <NeighborLinkCard
                                            link={previousArticle.href}
                                            title={previousArticle.title}
                                            next={false}
                                        />
                                    ) : (
                                        <Box /> // Spacer
                                    )}

                                    {nextArticle ? (
                                        <NeighborLinkCard
                                            link={nextArticle.href}
                                            title={nextArticle.title}
                                            next={true}
                                        />
                                    ) : (
                                        <Box /> // Spacer
                                    )}
                                </HStack>
                            </Box>
                        )}
                    </Box>

                    {/* Sidebar */}
                    {showSidebar && sidebarContent && (
                        <Box
                            pos={{ lg: 'sticky' }}
                            top={{ lg: '100px' }}
                            flexShrink={0}
                            overflowY={{ lg: 'auto' }}
                            w={{ base: 'full', lg: '300px' }}
                            maxH={{ lg: 'calc(100vh - 120px)' }}
                        >
                            {sidebarContent}
                        </Box>
                    )}
                </Flex>
            </Container>
        </Box>
    );
}

export default BookLayout;
