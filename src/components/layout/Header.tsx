'use client';

import { Avatar, Box, Button, Flex, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MdOutlineKeyboardArrowLeft } from 'react-icons/md';

import { MobileNavigation, Navigation } from '@/components/common';
import { useAuth } from '@/contexts/AuthContext';
import { useHeader } from '@/contexts/HeaderContext';

export default function Header() {
    const pathname = usePathname();
    const { showHeader } = useHeader();
    const { user, loading } = useAuth();

    // ルートパスか、もしくは"/chat"で始まるパスの場合は透明にする
    const isTransparent = pathname === '/' || pathname.startsWith('/chat');

    return (
        <Box
            as="header"
            pos="fixed"
            zIndex={100}
            top={0}
            left={0}
            w="100vw"
            h={16}
            px={[4, 4, '10%']}
            color="white"
            bg={isTransparent ? 'none' : '#1B1F3B'}
            borderBottom="1px solid rgba(255, 255, 255, 0.2)"
            transform={showHeader ? 'translateY(0)' : 'translateY(-100%)'}
            transition="transform 0.3s cubic-bezier(.4,0,.2,1)"
        >
            <Flex align="center" justify="space-between" maxW={1140} h="100%" mx="auto">
                {/* ロゴ（デスクトップのみ） */}
                <Flex align="center" display={['none', 'none', 'flex']}>
                    <Link href="/">
                        <Text fontSize="lg" fontWeight="bold" cursor="pointer">
                            KeNJi CodeLab
                        </Text>
                    </Link>
                </Flex>

                {/* ナビゲーション */}
                <Box justifyContent="center" flex={1} display={{ base: 'none', md: 'flex' }}>
                    <Navigation user={user} variant="compact" />
                </Box>

                {/* 右側のアクション */}
                <Flex align="center" gap={4} ml={{ base: 'auto', md: 6 }}>
                    {/* "一覧に戻る"ボタン（書籍記事ページで表示） */}
                    {(() => {
                        const segments = pathname.split('/').filter(Boolean);
                        if (segments.length === 3 && segments[0] === 'books') {
                            const chapterPath = `/books/${segments[1]}`;
                            return (
                                <Link href={chapterPath}>
                                    <Button
                                        px={4}
                                        py={4}
                                        color="white"
                                        bg="whiteAlpha.200"
                                        borderColor="whiteAlpha.400"
                                        borderRadius="full"
                                        _hover={{ bg: 'whiteAlpha.300' }}
                                        size="xs"
                                        variant="outline"
                                    >
                                        <MdOutlineKeyboardArrowLeft
                                            style={{ marginRight: -4, marginTop: 2 }}
                                        />
                                        一覧に戻る
                                    </Button>
                                </Link>
                            );
                        }
                        return null;
                    })()}

                    {/* ログイン・ユーザー表示 */}
                    {!loading && !user && (
                        <Link href="/login">
                            <Text
                                fontSize="sm"
                                fontWeight="500"
                                opacity={0.85}
                                _hover={{ opacity: 1 }}
                                cursor="pointer"
                            >
                                Sign in
                            </Text>
                        </Link>
                    )}

                    {!loading && user && (
                        <Link href="/profile">
                            <Avatar.Root size="sm" cursor="pointer">
                                {user.displayName && <Avatar.Fallback name={user.displayName} />}
                                {user.photoURL && <Avatar.Image src={user.photoURL} />}
                            </Avatar.Root>
                        </Link>
                    )}

                    {/* モバイルナビゲーション */}
                    <Box display={{ base: 'block', md: 'none' }}>
                        <MobileNavigation user={user} />
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}
