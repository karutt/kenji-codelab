'use client';

import { Stack, Text } from '@chakra-ui/react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRef } from 'react';

import ChatInput from '@/features/chat/components/ChatInput';
import ChatMessageListSimple, {
    ChatMessageListSimpleRef,
} from '@/features/chat/components/ChatMessageList';
import { usePaginatedChat } from '@/features/chat/hooks/usePaginatedChat';

const VALID_SLUGS = ['global', 'programming'];

const Chat = () => {
    const { slug } = useParams();
    const messageListRef = useRef<ChatMessageListSimpleRef>(null);

    // スラッグが有効かどうか
    const isValid = VALID_SLUGS.includes(slug as string);

    // Hooks は常に呼び出す（無効な slug の場合は空文字を渡して fetch を止める）
    const { messages, sendMessage, loadOlderMessages, loadingOlder } = usePaginatedChat(
        12,
        isValid ? (slug as string) : '',
    );

    // 有効でない場合はホーム画面表示
    if (!isValid) {
        return (
            <Stack
                pos="relative"
                zIndex={2}
                align="center"
                justify="center"
                gap={0}
                w="100%"
                maxW="600px"
                h="80vh"
                maxH={640}
                bg="white"
                borderRightRadius={8}
                shadow="md"
            >
                <Text color="gray.500" fontSize="md">
                    チャットルームを選択してください。
                </Text>
                <Image src="/homecat.png" alt="empty chat" width={200} height={200} priority />
            </Stack>
        );
    }

    // 有効な slug の場合はチャット表示
    return (
        <Stack
            pos="relative"
            zIndex={2}
            gap={0}
            w="100%"
            maxW="600px"
            h="80vh"
            maxH={640}
            bg="white"
            borderRightRadius={8}
            shadow="md"
        >
            <ChatMessageListSimple
                ref={messageListRef}
                messages={messages}
                onLoadOlder={loadOlderMessages}
                loadingOlder={loadingOlder}
            />
            <ChatInput onSend={sendMessage} messageListRef={messageListRef} />
        </Stack>
    );
};

export default Chat;
