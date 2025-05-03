// app/chat/[slug]/page.js
"use client";

import ChatInput from "@/features/chat/components/ChatInput";
import ChatMessageList from "@/features/chat/components/ChatMessageList";
import { usePaginatedChat } from "@/features/chat/hooks/usePaginatedChat";
import { Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRef } from "react";

const VALID_SLUGS = ["global", "programming"];

const Chat = () => {
    const { slug } = useParams();
    const virtuosoRef = useRef(null);

    // スラッグが有効かどうか
    const isValid = VALID_SLUGS.includes(slug);

    // Hooks は常に呼び出す（無効な slug の場合は空文字を渡して fetch を止める）
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(
        12,
        isValid ? slug : ""
    );

    // 有効でない場合はホーム画面表示
    if (!isValid) {
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

    // 有効な slug の場合はチャット表示
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
