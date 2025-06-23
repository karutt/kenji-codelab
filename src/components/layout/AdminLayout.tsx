'use client';

import { Box, Container, Flex, HStack, Link, Text, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
import { IconType } from 'react-icons';
import {
    HiOutlineChartBarSquare,
    HiOutlineCog6Tooth,
    HiOutlineDocumentText,
    HiOutlineHome,
    HiOutlineUsers,
} from 'react-icons/hi2';

interface AdminMenuItem {
    name: string;
    href: string;
    icon: IconType;
}

export interface AdminLayoutProps {
    children: ReactNode;
    pageTitle?: string;
    pageDescription?: string;
}

const adminMenuItems: AdminMenuItem[] = [
    {
        name: 'ダッシュボード',
        href: '/admin',
        icon: HiOutlineHome,
    },
    {
        name: '記事管理',
        href: '/admin/articles',
        icon: HiOutlineDocumentText,
    },
    {
        name: 'ユーザー管理',
        href: '/admin/users',
        icon: HiOutlineUsers,
    },
    {
        name: '統計',
        href: '/admin/analytics',
        icon: HiOutlineChartBarSquare,
    },
    {
        name: '設定',
        href: '/admin/settings',
        icon: HiOutlineCog6Tooth,
    },
];

export function AdminLayout({ children, pageTitle, pageDescription }: AdminLayoutProps) {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    return (
        <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
            <Flex>
                {/* Admin Sidebar */}
                <Box
                    display={{ base: 'none', md: 'block' }}
                    w="260px"
                    minH="100vh"
                    bg="white"
                    borderColor="gray.200"
                    borderRight="1px solid"
                    _dark={{
                        bg: 'gray.800',
                        borderColor: 'gray.700',
                    }}
                >
                    {/* Admin Header */}
                    <Box
                        p={6}
                        borderColor="gray.200"
                        borderBottom="1px solid"
                        _dark={{ borderColor: 'gray.700' }}
                    >
                        <Text
                            color="brand.shark"
                            fontSize="xl"
                            fontWeight="bold"
                            _dark={{ color: 'white' }}
                        >
                            管理画面
                        </Text>
                        <Text color="gray.600" fontSize="sm" _dark={{ color: 'gray.400' }}>
                            KeNJi CodeLab Admin
                        </Text>
                    </Box>

                    {/* Admin Menu */}
                    <VStack align="stretch" gap={1} p={4}>
                        {adminMenuItems.map(item => {
                            const Icon = item.icon;
                            const active = isActive(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    as={NextLink}
                                    px={4}
                                    py={3}
                                    color={active ? 'blue.600' : 'gray.700'}
                                    fontWeight={active ? 'semibold' : 'medium'}
                                    bg={active ? 'blue.50' : 'transparent'}
                                    borderRadius="lg"
                                    _hover={{
                                        bg: 'blue.50',
                                        color: 'blue.600',
                                        textDecoration: 'none',
                                    }}
                                    _dark={{
                                        color: active ? 'blue.300' : 'gray.300',
                                        bg: active ? 'blue.900' : 'transparent',
                                        _hover: {
                                            bg: 'blue.900',
                                            color: 'blue.300',
                                        },
                                    }}
                                    transition="all 0.2s"
                                    href={item.href}
                                >
                                    <HStack gap={3}>
                                        <Icon size={20} />
                                        <Text>{item.name}</Text>
                                    </HStack>
                                </Link>
                            );
                        })}
                    </VStack>
                </Box>

                {/* Main Content Area */}
                <Box flex="1" minW="0">
                    <Container maxW="full" p={0}>
                        {/* Page Header */}
                        {(pageTitle || pageDescription) && (
                            <Box
                                px={8}
                                py={6}
                                bg="white"
                                borderColor="gray.200"
                                borderBottom="1px solid"
                                _dark={{
                                    bg: 'gray.800',
                                    borderColor: 'gray.700',
                                }}
                            >
                                {pageTitle && (
                                    <Text
                                        mb={2}
                                        color="brand.shark"
                                        fontSize="2xl"
                                        fontWeight="bold"
                                        _dark={{ color: 'white' }}
                                    >
                                        {pageTitle}
                                    </Text>
                                )}
                                {pageDescription && (
                                    <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                                        {pageDescription}
                                    </Text>
                                )}
                            </Box>
                        )}

                        {/* Page Content */}
                        <Box p={8}>{children}</Box>
                    </Container>
                </Box>
            </Flex>
        </Box>
    );
}

export default AdminLayout;
