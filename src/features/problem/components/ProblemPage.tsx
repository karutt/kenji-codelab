'use client';

import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { useAuth } from '@/contexts/AuthContext';
import { useSideMenu } from '@/features/article/components/SideMenu/SideMenuContext';

import ProblemSet from './ProblemSet';

interface ProblemPageProps {
    problemMarkdown: string;
    articleSlug: string;
    bookSlug: string;
    articleTitle: string;
}

export default function ProblemPage({
    problemMarkdown,
    articleSlug,
    bookSlug,
    articleTitle,
}: ProblemPageProps) {
    const { user } = useAuth();
    const router = useRouter();
    const { setShowSideMenu } = useSideMenu();
    const [userName, setUserName] = useState<string>('');

    // Hide side menu when component mounts, restore when unmounts
    useEffect(() => {
        setShowSideMenu(false);

        return () => {
            setShowSideMenu(true);
        };
    }, [setShowSideMenu]);

    // Convert book slug to readable display name
    const getBookDisplayName = (slug: string) => {
        const cleanSlug = slug.replace(/_en$/, '');
        return cleanSlug
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const bookDisplayName = getBookDisplayName(bookSlug);

    useEffect(() => {
        // Get user name from localStorage if not logged in
        if (!user) {
            const storedName = localStorage.getItem('kenji_name');
            if (!storedName) {
                // If no name is stored, redirect back to article
                router.push(`/books/${bookSlug}/${articleSlug}`);
                return;
            }
            setUserName(storedName);
        }
    }, [user, router, bookSlug, articleSlug]);

    const handleBackToArticle = () => {
        router.push(`/books/${bookSlug}/${articleSlug}`);
    };

    return (
        <Box
            className="problem-page"
            w="100%"
            maxW={900}
            mx="auto"
            my={8}
            px={[2, 3, 4]}
            color="brand.shark"
        >
            {/* Header */}
            <Box
                overflow="hidden"
                mb={6}
                bg="white"
                border="1px solid"
                borderColor="brand.black12"
                borderRadius="10px"
                shadow="0 2px 10px rgba(0, 0, 0, 0.05)"
            >
                <Box
                    px={[4, 6, 16]}
                    py={6}
                    bg="brand.lilac2"
                    borderBottom="1px solid #E5E5E5"
                    borderRadius="10px 10px 0 0"
                >
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
                            {
                                label: '問題',
                                href: `/books/${bookSlug}/${articleSlug}/problems`,
                            },
                        ]}
                        size="sm"
                    />

                    {/* Title and Back Button */}
                    <Flex align="center" justify="space-between" mt={4} mb={2}>
                        <Box>
                            <Text color="brand.shark" fontSize="24px" fontWeight="600">
                                {articleTitle} - 問題
                            </Text>
                            {!user && userName && (
                                <Text mt={1} color="brand.hitGray" fontSize="14px">
                                    回答者: {userName}
                                </Text>
                            )}
                            {user && (
                                <Text mt={1} color="brand.hitGray" fontSize="14px">
                                    ログイン済み
                                </Text>
                            )}
                        </Box>

                        <Button
                            px={6}
                            color="brand.abbey"
                            bg="white"
                            border="1px solid"
                            borderColor="brand.black12"
                            _hover={{
                                bg: 'brand.black04',
                            }}
                            onClick={handleBackToArticle}
                            size="sm"
                        >
                            記事に戻る
                        </Button>
                    </Flex>
                </Box>
            </Box>

            {/* Problem Content */}
            <Box
                p={8}
                px={[4, 6, 16]}
                bg="white"
                border="1px solid"
                borderColor="brand.black12"
                borderRadius="10px"
                shadow="0 2px 10px rgba(0, 0, 0, 0.05)"
            >
                <ProblemSet
                    problemMarkdown={problemMarkdown}
                    articleSlug={articleSlug}
                    bookSlug={bookSlug}
                />
            </Box>
        </Box>
    );
}
