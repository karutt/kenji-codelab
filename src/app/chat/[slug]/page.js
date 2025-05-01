"use client";

import { useParams } from "next/navigation";
import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessageList from "@/features/chat/components/ChatMessageList";
import { usePaginatedChat } from "@/features/chat/hooks/usePaginatedChat";
import { Stack } from "@chakra-ui/react";
import { useRef } from "react";

const Chat = () => {
    const { slug } = useParams(); // ← スラッグ取得
    const virtuosoRef = useRef(null);
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(20, slug); // ← slug を渡す

    return (
        <Stack
            h='80vh'
            w='100%'
            maxH={640}
            maxW='600px'
            spacing={0}
            bg='white'
            boxShadow='md'
            zIndex={2}
            position='relative'
            borderRightRadius={8}>
            <ChatMessageList
                messages={messages}
                virtuosoRef={virtuosoRef}
                onLoadOlder={loadOlderMessages}
                loadingOlder={loadingOlder}
            />
            <ChatInput onSend={sendMessage} virtuosoRef={virtuosoRef} />
        </Stack>
    );
};

export default Chat;
