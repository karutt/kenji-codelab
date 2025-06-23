'use client';

import {
    Box,
    DrawerActionTrigger,
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    HStack,
    IconButton,
    Link,
    Text,
    VStack,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { IconType } from 'react-icons';
import {
    HiBookOpen,
    HiChatBubbleLeftRight,
    HiHome,
    HiOutlineBars3,
    HiXMark,
} from 'react-icons/hi2';

import { User } from '@/types/auth';

interface NavigationItem {
    name: string;
    url: string;
    requireAuth?: boolean;
    icon?: IconType;
}

export interface MobileNavigationProps {
    user: User | null;
}

const navigationItems: NavigationItem[] = [
    {
        name: 'Home',
        url: '/',
        icon: HiHome,
    },
    {
        name: 'Lessons',
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

export function MobileNavigation({ user }: MobileNavigationProps) {
    const [open, setOpen] = useState(false);
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

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <DrawerRoot onOpenChange={e => setOpen(e.open)} open={open} placement="end" size="xs">
            <DrawerActionTrigger asChild>
                <IconButton
                    _hover={{
                        bg: 'gray.100',
                    }}
                    _dark={{
                        _hover: {
                            bg: 'gray.700',
                        },
                    }}
                    aria-label="Open menu"
                    size="lg"
                    variant="ghost"
                >
                    <HiOutlineBars3 />
                </IconButton>
            </DrawerActionTrigger>

            <DrawerBackdrop />
            <DrawerContent>
                <DrawerHeader
                    borderBottomWidth="1px"
                    borderBottomColor="gray.200"
                    _dark={{ borderBottomColor: 'gray.600' }}
                >
                    <HStack align="center" justify="space-between">
                        <DrawerTitle fontSize="lg" fontWeight="bold">
                            Menu
                        </DrawerTitle>
                        <DrawerCloseTrigger asChild>
                            <IconButton aria-label="Close menu" size="sm" variant="ghost">
                                <HiXMark />
                            </IconButton>
                        </DrawerCloseTrigger>
                    </HStack>
                </DrawerHeader>

                <DrawerBody p={0}>
                    <VStack align="stretch" gap={0}>
                        {visibleItems.map(item => {
                            const Icon = item.icon;
                            const active = isActive(item.url);

                            return (
                                <Link
                                    key={item.name}
                                    as={NextLink}
                                    px={6}
                                    py={4}
                                    color={active ? 'blue.600' : 'gray.700'}
                                    fontWeight={active ? 'semibold' : 'medium'}
                                    bg={active ? 'blue.50' : 'transparent'}
                                    borderLeft="4px solid"
                                    borderLeftColor={active ? 'blue.500' : 'transparent'}
                                    _hover={{
                                        bg: 'blue.50',
                                        color: 'blue.600',
                                        textDecoration: 'none',
                                        borderLeftColor: 'blue.300',
                                    }}
                                    _dark={{
                                        color: active ? 'blue.300' : 'gray.200',
                                        bg: active ? 'blue.900' : 'transparent',
                                        borderLeftColor: active ? 'blue.400' : 'transparent',
                                        _hover: {
                                            bg: 'blue.900',
                                            color: 'blue.300',
                                            borderLeftColor: 'blue.400',
                                        },
                                    }}
                                    transition="all 0.2s"
                                    href={item.url}
                                    onClick={handleClose}
                                >
                                    <HStack gap={3}>
                                        {Icon && (
                                            <Box
                                                color={active ? 'blue.500' : 'gray.500'}
                                                _dark={{
                                                    color: active ? 'blue.400' : 'gray.400',
                                                }}
                                            >
                                                <Icon size={20} />
                                            </Box>
                                        )}
                                        <Text fontSize="md">{item.name}</Text>
                                    </HStack>
                                </Link>
                            );
                        })}

                        {/* 言語切り替えリンク（書籍ページで表示） */}
                        {pathname.includes('/books/') && (
                            <Box
                                px={6}
                                py={4}
                                borderTop="1px solid"
                                borderTopColor="gray.200"
                                _dark={{ borderTopColor: 'gray.600' }}
                            >
                                <Text
                                    mb={2}
                                    color="gray.600"
                                    fontSize="sm"
                                    _dark={{ color: 'gray.400' }}
                                >
                                    Language:
                                </Text>
                                {pathname.endsWith('_en') ? (
                                    <Link
                                        as={NextLink}
                                        color="blue.600"
                                        fontSize="sm"
                                        _hover={{ textDecoration: 'underline' }}
                                        href={pathname.replace('_en', '')}
                                        onClick={handleClose}
                                    >
                                        日本語 (Japanese)
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
                                                    color="blue.600"
                                                    fontSize="sm"
                                                    _hover={{ textDecoration: 'underline' }}
                                                    href={splitted.join('/')}
                                                    onClick={handleClose}
                                                >
                                                    English
                                                </Link>
                                            );
                                        }
                                        return null;
                                    })()
                                )}
                            </Box>
                        )}
                    </VStack>

                    {/* User section */}
                    {user && (
                        <Box
                            mt={8}
                            px={6}
                            py={4}
                            borderTop="1px solid"
                            borderTopColor="gray.200"
                            _dark={{ borderTopColor: 'gray.600' }}
                        >
                            {' '}
                            <Text color="gray.600" fontSize="sm" _dark={{ color: 'gray.400' }}>
                                Logged in: {user.displayName || user.name || user.email || 'User'}
                            </Text>
                        </Box>
                    )}
                </DrawerBody>
            </DrawerContent>
        </DrawerRoot>
    );
}

export default MobileNavigation;
