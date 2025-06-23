'use client';

import { Box, Flex, HStack, Text } from '@chakra-ui/react';
import { ReactNode } from 'react';
import { HiOutlineChatBubbleLeft, HiOutlineUser } from 'react-icons/hi2';

export interface ChatLayoutProps {
    children: ReactNode;
    chatTitle?: string;
    showUserList?: boolean;
    userListContent?: ReactNode;
    headerContent?: ReactNode;
}

export function ChatLayout({
    children,
    chatTitle = 'チャット',
    showUserList = false,
    userListContent,
    headerContent,
}: ChatLayoutProps) {
    return (
        <Box h="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
            <Flex h="full">
                {/* User List Sidebar (optional) */}
                {showUserList && (
                    <Box
                        display={{ base: 'none', md: 'block' }}
                        w="250px"
                        bg="white"
                        borderColor="gray.200"
                        borderRight="1px solid"
                        _dark={{
                            bg: 'gray.800',
                            borderColor: 'gray.700',
                        }}
                    >
                        <Box
                            p={4}
                            borderColor="gray.200"
                            borderBottom="1px solid"
                            _dark={{ borderColor: 'gray.700' }}
                        >
                            <HStack>
                                <HiOutlineUser />
                                <Text fontWeight="semibold">参加者</Text>
                            </HStack>
                        </Box>
                        <Box overflowY="auto" maxH="calc(100vh - 80px)" p={4}>
                            {userListContent}
                        </Box>
                    </Box>
                )}

                {/* Main Chat Area */}
                <Flex direction="column" flex="1" minW="0">
                    {/* Chat Header */}
                    <Box
                        p={4}
                        bg="white"
                        borderColor="gray.200"
                        borderBottom="1px solid"
                        _dark={{
                            bg: 'gray.800',
                            borderColor: 'gray.700',
                        }}
                    >
                        <HStack justify="space-between">
                            <HStack>
                                <HiOutlineChatBubbleLeft />
                                <Text fontSize="lg" fontWeight="semibold">
                                    {chatTitle}
                                </Text>
                            </HStack>
                            {headerContent}
                        </HStack>
                    </Box>

                    {/* Chat Messages Area */}
                    <Box flex="1" overflowY="auto" p={4} bg="gray.50" _dark={{ bg: 'gray.900' }}>
                        {children}
                    </Box>
                </Flex>
            </Flex>
        </Box>
    );
}

export default ChatLayout;
