'use client';

import { Avatar, Box, Button, Flex, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { MarkdownContent } from '@/components/common/MarkdownContent';
import { NeighborLinkCard } from '@/components/common/NeighborLinkCard';
import { ProblemModal } from '@/features/problem';

interface ArticleProps {
    markdown: string;
    card: string;
    problem: string;
    frontMatter: {
        title?: string;
        lastModified?: string;
    };
    articleSlug: string;
    bookSlug: string;
    neighborsPage: {
        prePage: { title: string; link: string } | null;
        nextPage: { title: string; link: string } | null;
    };
}

export default function Article({
    markdown,
    problem,
    frontMatter,
    articleSlug,
    bookSlug,
    neighborsPage,
}: ArticleProps) {
    const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);

    // Convert book slug to readable display name
    const getBookDisplayName = (slug: string) => {
        // Remove _en suffix if present
        const cleanSlug = slug.replace(/_en$/, '');
        // Convert snake_case to readable format
        return cleanSlug
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const bookDisplayName = getBookDisplayName(bookSlug);

    return (
        <Box
            as="article"
            w="100%"
            maxW={800}
            my={8}
            mr={[2, 3, 4]}
            ml={[2, 3, 0]}
            color="brand.shark"
        >
            <Box
                overflow="hidden"
                bg="white"
                border="1px solid"
                borderColor="brand.black12"
                borderRadius="10px"
            >
                {/* Article Header - styled like original ArticleHead */}
                <Box
                    pos="relative"
                    px={[4, 6, 16]}
                    py={10}
                    bg="brand.lilac2"
                    borderBottom="1px solid #E5E5E5"
                    borderRadius="10px 10px 0 0"
                >
                    <Box>
                        {/* Breadcrumb */}
                        <Breadcrumb
                            items={[
                                {
                                    label: 'Books',
                                    href: '/books',
                                },
                                {
                                    label: bookDisplayName,
                                    href: `/books/${bookSlug}`,
                                },
                                {
                                    label: '§' + articleSlug,
                                    href: `/books/${bookSlug}/${articleSlug}`,
                                },
                            ]}
                            size="sm"
                        />

                        {/* Article Title */}
                        <Flex align="center" justify="space-between" mt={3} mb={4}>
                            <Box
                                flex={1}
                                pb={1}
                                color="brand.shark"
                                fontSize="2xl"
                                fontWeight="600"
                                borderBottom="1px solid #E5E5E5"
                            >
                                {frontMatter.title || 'Untitled'}
                            </Box>

                            {/* Problem Button */}
                            {problem && (
                                <Button
                                    ml={4}
                                    px={6}
                                    color="white"
                                    bg="brand.blue"
                                    _hover={{
                                        bg: 'brand.blue',
                                        opacity: 0.9,
                                    }}
                                    onClick={() => {
                                        setIsProblemModalOpen(true);
                                    }}
                                    size="sm"
                                >
                                    問題を解く
                                </Button>
                            )}
                        </Flex>

                        {/* Author and Date */}
                        <Flex align="center" gap={2}>
                            <Avatar.Root size="lg">
                                <Avatar.Fallback name="Koyama Mitsuru" />
                                <Avatar.Image src="/svg/profile_karutt.svg" />
                            </Avatar.Root>
                            <VStack align="flex-start" gap={1.5} fontSize="14px" lineHeight="1">
                                <Box>
                                    <Text as="span" mr={1} color="brand.abbey">
                                        by
                                    </Text>
                                    <Text as="span" color="brand.blue" fontWeight={700}>
                                        karutt
                                    </Text>
                                </Box>
                                <Text color="brand.hitGray">{frontMatter.lastModified}</Text>
                            </VStack>
                        </Flex>
                    </Box>
                </Box>

                {/* Article Content */}
                <Box px={[4, 6, 16]} py={6} pb={16}>
                    <MarkdownContent content={markdown} />
                </Box>
            </Box>

            {/* Navigation using NeighborLinkCard */}
            {(neighborsPage.prePage || neighborsPage.nextPage) && (
                <Box mt={6}>
                    <Flex align="stretch" justify="space-between" gap={4}>
                        {neighborsPage.prePage ? (
                            <NeighborLinkCard
                                link={neighborsPage.prePage.link}
                                title={neighborsPage.prePage.title}
                                next={false}
                            />
                        ) : (
                            <Box flex={1} />
                        )}

                        {neighborsPage.nextPage && (
                            <NeighborLinkCard
                                link={neighborsPage.nextPage.link}
                                title={neighborsPage.nextPage.title}
                                next={true}
                            />
                        )}
                    </Flex>
                </Box>
            )}

            {/* Problem Modal */}
            {problem && (
                <ProblemModal
                    isOpen={isProblemModalOpen}
                    onClose={() => setIsProblemModalOpen(false)}
                    articleSlug={articleSlug}
                    bookSlug={bookSlug}
                />
            )}
        </Box>
    );
}
