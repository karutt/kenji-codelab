"use client";
import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessageList from "@/features/chat/components/ChatMessageList";
import { usePaginatedChat } from "@/features/chat/hooks/usePaginatedChat";
import { Box, Center, Stack } from "@chakra-ui/react";
import { useRef } from "react";

const Chat = () => {
    const virtuosoRef = useRef(null);
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(20);

    return (
        <Center h='100vh' width='100vw'>
            <Stack
                h='70vh'
                maxW='600px'
                w='100%'
                mx='auto'
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
        </Center>
    );
};

export default Chat;
