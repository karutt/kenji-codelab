"use client";

import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessageList from "@/features/chat/components/ChatMessageList";
import { usePaginatedChat } from "@/features/chat/hooks/usePaginatedChat";
import { Box, Stack } from "@chakra-ui/react";
import { useRef } from "react";

const Chat = () => {
    const virtuosoRef = useRef(null);
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(20);

    return (
        <>
            <Stack
                h='80vh'
                w='100%'
                maxH={640}
                maxW='600px'
                spacing={0}
                bg='white'
                boxShadow='md'
                zIndex={2}
                position='relative'>
                <Box flex={1} minH={0}>
                    <ChatMessageList
                        messages={messages}
                        virtuosoRef={virtuosoRef}
                        onLoadOlder={loadOlderMessages}
                        loadingOlder={loadingOlder}
                    />
                </Box>
                <Box p={2} borderTop='1px solid #eee' bg='gray.50'>
                    <ChatInput onSend={sendMessage} virtuosoRef={virtuosoRef} />
                </Box>
            </Stack>
        </>
    );
};

export default Chat;
