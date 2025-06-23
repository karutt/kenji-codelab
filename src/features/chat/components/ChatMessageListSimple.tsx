'use client';
import { Avatar, Box, Flex, Spinner, Stack, Text } from '@chakra-ui/react';
import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

import { Message } from '@/features/chat/api/chatAPI';
import { useChatUsers } from '@/features/user/hooks/useChatUsers';
import { auth } from '@/utils/firebase';

interface ChatMessageListSimpleProps {
    messages: Message[];
    onLoadOlder: () => void;
    loadingOlder: boolean;
}

export interface ChatMessageListSimpleRef {
    scrollToBottom: () => void;
}

const ChatMessageListSimple = forwardRef<ChatMessageListSimpleRef, ChatMessageListSimpleProps>(
    ({ messages, onLoadOlder, loadingOlder }, ref) => {
        const scrollRef = useRef<HTMLDivElement>(null);
        const prevMessagesLength = useRef(messages.length);
        const isUserScrolling = useRef(false);
        const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
        const prevScrollHeight = useRef(0);
        const isAtBottom = useRef(true);

        const uniqueUids = React.useMemo(() => {
            return [...new Set(messages.map(message => message.uid))];
        }, [messages]);

        const chatUsersResult = useChatUsers(uniqueUids);
        const { users } = chatUsersResult;
        const currentUid = auth.currentUser?.uid;

        // 外部からスクロールを制御するためのref
        useImperativeHandle(
            ref,
            () => ({
                scrollToBottom: () => {
                    if (scrollRef.current) {
                        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        isAtBottom.current = true;
                    }
                },
            }),
            [],
        );

        // メッセージが変更されたときの処理
        useEffect(() => {
            const addedMessagesCount = messages.length - prevMessagesLength.current;

            if (addedMessagesCount > 0 && scrollRef.current) {
                const currentScrollHeight = scrollRef.current.scrollHeight;

                // 新しいメッセージが1つだけ追加された場合（通常の送信）
                if (addedMessagesCount === 1 && isAtBottom.current) {
                    setTimeout(() => {
                        if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                        }
                    }, 50);
                }
                // 複数のメッセージが追加された場合（古いメッセージ読み込み）
                else if (addedMessagesCount > 1) {
                    // 古いメッセージ読み込み時のスクロール位置維持
                    const scrollHeightDiff = currentScrollHeight - prevScrollHeight.current;
                    if (scrollHeightDiff > 0) {
                        scrollRef.current.scrollTop += scrollHeightDiff;
                    }
                }

                prevScrollHeight.current = currentScrollHeight;
            }

            prevMessagesLength.current = messages.length;
        }, [messages]);

        // 初期表示時に下にスクロール
        useEffect(() => {
            if (scrollRef.current && messages.length > 0) {
                const isInitialLoad = prevMessagesLength.current === 0;
                if (isInitialLoad) {
                    setTimeout(() => {
                        if (scrollRef.current) {
                            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
                            isAtBottom.current = true;
                            prevScrollHeight.current = scrollRef.current.scrollHeight;
                        }
                    }, 100);
                }
            }
        }, [messages.length]);

        const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

            // 下部にいるかどうかを判定（少し余裕をもたせて100px以内）
            isAtBottom.current = scrollHeight - scrollTop - clientHeight < 100;

            // ユーザーがスクロールしていることを記録
            isUserScrolling.current = true;

            // スクロール停止を検知
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
            scrollTimeout.current = setTimeout(() => {
                isUserScrolling.current = false;
            }, 150);

            // 上部に近づいたら古いメッセージを読み込む
            if (scrollTop < 100 && !loadingOlder) {
                onLoadOlder();
            }
        };

        if (messages.length === 0) {
            return (
                <Flex align="center" justify="center" flex="1" h="100%">
                    <Text color="gray.500">メッセージがありません</Text>
                </Flex>
            );
        }

        return (
            <Box
                ref={scrollRef}
                flex="1"
                overflowY="auto"
                h="100%"
                px={4}
                pt={2}
                onScroll={handleScroll}
            >
                {/* ローディングヘッダー */}
                {loadingOlder && (
                    <Box p={2} textAlign="center">
                        <Spinner size="sm" />
                    </Box>
                )}

                {/* メッセージリスト */}
                {messages.map(message => {
                    const user = users[message.uid];
                    const isOwn = message.uid === currentUid;

                    return (
                        <Flex
                            key={message.id}
                            justify={isOwn ? 'flex-end' : 'flex-start'}
                            w="100%"
                            px={2}
                            py={1}
                        >
                            <Stack alignItems="flex-start" direction="row">
                                {/* 左側に表示する場合はアバター、右揃えならテキストのみ */}
                                {!isOwn &&
                                    (message.uid && user ? (
                                        <Avatar.Root size="sm" mt={6}>
                                            <Avatar.Fallback name={user.displayName} />
                                            {user.photoURL && user.photoURL.trim() && (
                                                <Avatar.Image src={user.photoURL} />
                                            )}
                                        </Avatar.Root>
                                    ) : (
                                        <Text>匿名:</Text>
                                    ))}
                                <Stack alignItems={isOwn ? 'flex-end' : 'flex-start'} gap={1}>
                                    <Stack alignItems="center" direction="row" gap={1}>
                                        {!isOwn && (
                                            <Text fontSize="xs">
                                                {(message.uid && user?.displayName) || '匿名'}
                                            </Text>
                                        )}
                                        <Text
                                            color="brand.abbey"
                                            fontSize="xs"
                                            letterSpacing={1}
                                            opacity={0.7}
                                        >
                                            {(() => {
                                                const date = message.createdAt;
                                                if (!date) return '';
                                                if (date instanceof Date) {
                                                    return date.toLocaleString();
                                                }
                                                if (typeof date.toDate === 'function') {
                                                    return date.toDate().toLocaleString();
                                                }
                                                return '';
                                            })()}
                                        </Text>
                                    </Stack>
                                    <Text
                                        w="fit-content"
                                        maxW={440}
                                        px={4}
                                        py={2}
                                        color={isOwn ? 'white' : 'brand.shark'}
                                        fontWeight={isOwn ? 'light' : 'normal'}
                                        bg={isOwn ? 'brand.blue' : 'brand.e7'}
                                        borderRadius="xl"
                                    >
                                        {message.text}
                                    </Text>
                                </Stack>
                                {/* 右揃えならアバターを右側に */}
                                {isOwn && message.uid && user && (
                                    <Avatar.Root size="sm" mt={6}>
                                        <Avatar.Fallback name={user.displayName} />
                                        {user.photoURL && user.photoURL.trim() && (
                                            <Avatar.Image src={user.photoURL} />
                                        )}
                                    </Avatar.Root>
                                )}
                            </Stack>
                        </Flex>
                    );
                })}
            </Box>
        );
    },
);

ChatMessageListSimple.displayName = 'ChatMessageListSimple';

export default ChatMessageListSimple;
