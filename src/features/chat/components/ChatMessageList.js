// src/features/chat/components/ChatMessageList.js
"use client";
import { useChatUsers } from "@/features/user/hooks/useChatUsers";
import { Avatar, Box, Spinner, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { Virtuoso } from "react-virtuoso";

const INITIAL_GLOBAL_INDEX = 10000;

const ChatMessageList = ({ messages, virtuosoRef, onLoadOlder, loadingOlder }) => {
    const uniqueUids = React.useMemo(() => {
        const uids = messages.filter((m) => m.uid).map((m) => m.uid);
        return Array.from(new Set(uids));
    }, [messages]);

    const userMap = useChatUsers(uniqueUids);
    const [firstItemIndex, setFirstItemIndex] = React.useState(INITIAL_GLOBAL_INDEX);
    const prevMessagesRef = React.useRef(messages);

    React.useEffect(() => {
        const prevMessages = prevMessagesRef.current;
        const addedCount = messages.length - prevMessages.length;
        setFirstItemIndex((prev) => prev - addedCount);
        prevMessagesRef.current = messages;
    }, [messages]);

    const handleLoadOlder = React.useCallback(() => {
        onLoadOlder();
    }, [onLoadOlder]);

    return (
        <Box flex={1} w='100%'>
            <Virtuoso
                followOutput={true}
                data={messages}
                ref={virtuosoRef}
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={
                    messages.length > 0 ? firstItemIndex + messages.length - 1 : firstItemIndex
                }
                startReached={handleLoadOlder}
                itemContent={(_, message) => (
                    <Stack key={message.id} direction='row' p={2}>
                        {message.uid && userMap[message.uid] ? (
                            <Avatar.Root size='xs' mt={4}>
                                <Avatar.Fallback>
                                    {userMap[message.uid].displayName}
                                </Avatar.Fallback>
                                <Avatar.Image src={userMap[message.uid].photoURL} />
                            </Avatar.Root>
                        ) : (
                            <Text>匿名:</Text>
                        )}
                        <Stack gap={0}>
                            <Stack alignItems='center' direction='row'>
                                <Text textStyle='xs' fontWeight='bold' opacity={1}>
                                    {(message.uid && userMap[message.uid]?.displayName) || "匿名"}
                                </Text>
                                <Text textStyle='xs' opacity={0.7}>
                                    {message.createdAt?.toDate().toLocaleString()}
                                </Text>
                            </Stack>
                            <Text w='fit-content' px={2} py={1} bg='gray.muted' borderRadius='xl'>
                                {message.text}
                            </Text>
                        </Stack>
                    </Stack>
                )}
                components={{
                    Header: () =>
                        loadingOlder ? (
                            <Box p={2} textAlign='center'>
                                <Spinner size='sm' />
                            </Box>
                        ) : null,
                }}
            />
        </Box>
    );
};

ChatMessageList.displayName = "ChatMessageList";

export default React.memo(ChatMessageList);
