'use client';

import { Box, Flex, HStack, Link, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons';
import { HiBookOpen, HiChatBubbleLeftRight, HiHome } from 'react-icons/hi2';

import { User } from '@/types/auth';

interface NavigationItem {
    name: string;
    url: string;
    requireAuth?: boolean;
    icon?: IconType;
}

export interface NavigationProps {
    user: User | null;
    variant?: 'default' | 'compact';
}

const navigationItems: NavigationItem[] = [
    {
        name: 'Home',
        url: '/',
        icon: HiHome,
    },
    {
        name: 'Books',
        url: '/books',
        icon: HiBookOpen,
    },
    {
        name: 'Chat',
        url: '/chat',
        requireAuth: true,
        icon: HiChatBubbleLeftRight,
    },
];

export function Navigation({ user, variant = 'default' }: NavigationProps) {
    const pathname = usePathname();

    const visibleItems = navigationItems.filter(item => {
        if (item.requireAuth && !user) {
            return false;
        }
        return true;
    });

    const isActive = (url: string) => {
        if (url === '/') {
            return pathname === '/';
        }
        return pathname.startsWith(url);
    };

    if (variant === 'compact') {
        return (
            <HStack gap={6}>
                {visibleItems.map(item => {
                    const active = isActive(item.url);

                    return (
                        <Link
                            key={item.name}
                            as={NextLink}
                            color="white"
                            fontSize="16px"
                            fontWeight="500"
                            lineHeight="100%"
                            opacity={active ? 1 : 0.6}
                            _hover={{
                                opacity: 0.85,
                                textDecoration: 'none',
                            }}
                            _active={{
                                opacity: 1,
                            }}
                            cursor="pointer"
                            transition="opacity 0.3s"
                            href={item.url}
                        >
                            {item.name}
                        </Link>
                    );
                })}

                {/* 言語切り替えリンク（書籍ページで表示） */}
                {pathname.includes('/books/') && (
                    <Text color="white" fontSize="16px" fontWeight="500" opacity={0.6}>
                        {pathname.endsWith('_en') ? (
                            <Link
                                as={NextLink}
                                color="white"
                                opacity={0.6}
                                _hover={{ opacity: 0.85, textDecoration: 'none' }}
                                transition="opacity 0.3s"
                                href={pathname.replace('_en', '')}
                            >
                                Ja
                            </Link>
                        ) : (
                            (() => {
                                const splitted = pathname.split('/');
                                if (splitted[1] === 'books' && splitted[2]) {
                                    // すでに_enがついていれば外す
                                    if (splitted[2].endsWith('_en')) {
                                        splitted[2] = splitted[2].replace(/_en$/, '');
                                    } else {
                                        splitted[2] += '_en';
                                    }
                                    return (
                                        <Link
                                            as={NextLink}
                                            color="white"
                                            opacity={0.6}
                                            _hover={{ opacity: 0.85, textDecoration: 'none' }}
                                            transition="opacity 0.3s"
                                            href={splitted.join('/')}
                                        >
                                            En
                                        </Link>
                                    );
                                }
                                return null;
                            })()
                        )}
                    </Text>
                )}
            </HStack>
        );
    }

    return (
        <Flex as="nav" align="center">
            <HStack gap={6}>
                {visibleItems.map(item => {
                    const Icon = item.icon;
                    const active = isActive(item.url);

                    return (
                        <Link
                            key={item.name}
                            as={NextLink}
                            pos="relative"
                            px={4}
                            py={2}
                            color={active ? 'blue.600' : 'gray.700'}
                            fontSize="md"
                            fontWeight={active ? 'semibold' : 'medium'}
                            bg={active ? 'blue.50' : 'transparent'}
                            borderRadius="lg"
                            _hover={{
                                color: 'blue.600',
                                bg: 'blue.50',
                                textDecoration: 'none',
                                transform: 'translateY(-1px)',
                            }}
                            _dark={{
                                color: active ? 'blue.300' : 'gray.200',
                                bg: active ? 'blue.900' : 'transparent',
                                _hover: {
                                    color: 'blue.300',
                                    bg: 'blue.900',
                                },
                            }}
                            transition="all 0.2s"
                            href={item.url}
                        >
                            <HStack gap={2}>
                                {Icon && <Icon size={18} />}
                                <Text>{item.name}</Text>
                            </HStack>

                            {active && (
                                <Box
                                    pos="absolute"
                                    bottom={-1}
                                    left="50%"
                                    w="80%"
                                    h="2px"
                                    bg="blue.500"
                                    borderRadius="full"
                                    _dark={{ bg: 'blue.300' }}
                                    transform="translateX(-50%)"
                                />
                            )}
                        </Link>
                    );
                })}
            </HStack>
        </Flex>
    );
}

export default Navigation;
