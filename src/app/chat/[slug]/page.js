"use client";

import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessageList from "@/features/chat/components/ChatMessageList";
import { usePaginatedChat } from "@/features/chat/hooks/usePaginatedChat";
import { Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";

// ここに許可するチャットルームの slug を並べる
const VALID_SLUGS = ["global", "programming"];

const Chat = () => {
    const { slug } = useParams();
    const virtuosoRef = useRef(null);

    // slug が無効なら 404 表示
    if (!VALID_SLUGS.includes(slug)) {
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
                borderRightRadius={8}
                align='center'
                justify='center'>
                <Text fontSize='md' color='gray.500'>
                    チャットルームを選択してください。
                </Text>

                <Image src='/homecat.png' alt='empty chat' width={200} height={200} priority />
            </Stack>
        );
    }

    // 有効な slug の場合だけチャット機能を起動
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(20, slug);

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
