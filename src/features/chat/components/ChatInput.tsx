'use client';

import { Box, IconButton, Input, Stack } from '@chakra-ui/react';
import React, { useCallback, useState } from 'react';
import { IoMdSend } from 'react-icons/io';

import { ChatMessageListSimpleRef } from './ChatMessageList';

export interface ChatInputProps {
    onSend: (text: string) => Promise<void>;
    messageListRef?: React.RefObject<ChatMessageListSimpleRef | null>;
}

function ChatInput({ onSend, messageListRef }: ChatInputProps) {
    const [message, setMessage] = useState('');

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(e.target.value);
    }, []);

    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();
            if (!message.trim()) return;
            await onSend(message);
            setMessage('');

            // メッセージ送信後に最下部にスクロール
            setTimeout(() => {
                if (messageListRef?.current) {
                    messageListRef.current.scrollToBottom();
                }
            }, 50);
        },
        [message, onSend, messageListRef],
    );

    return (
        <Box as="form" px={4} py={2} onSubmit={handleSubmit}>
            <Stack alignItems="center" direction="row">
                <Input
                    px={4}
                    py={6}
                    color="brand.shark"
                    fontSize={16}
                    borderColor="brand.e2"
                    borderRadius="full"
                    _focus={{ borderColor: 'border.emphasized', outline: 'none' }}
                    onChange={handleChange}
                    placeholder="メッセージを入力..."
                    type="text"
                    value={message}
                />

                <IconButton
                    color="gray.shark"
                    aria-label="送信"
                    size="2xl"
                    type="submit"
                    variant="ghost"
                >
                    <IoMdSend />
                </IconButton>
            </Stack>
        </Box>
    );
}

export default ChatInput;
