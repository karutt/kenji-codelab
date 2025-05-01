// src/features/chat/components/ChatMessageList.js
"use client";
import { useChatUsers } from "@/features/user/hooks/useChatUsers";
import { auth } from "@/utils/firebase";
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
    const currentUid = auth.currentUser?.uid;

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
        <Box flex={1} w='100%' h='100%' pt={2} px={4}>
            <Virtuoso
                followOutput={true}
                data={messages}
                ref={virtuosoRef}
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={
                    messages.length > 0 ? firstItemIndex + messages.length - 1 : firstItemIndex
                }
                startReached={handleLoadOlder}
                itemContent={(_, message) => {
                    const isOwn = message.uid === currentUid;
                    return (
                        <Box
                            key={message.id}
                            w='100%'
                            px={2}
                            py={1}
                            display='flex'
                            justifyContent={isOwn ? "flex-end" : "flex-start"}>
                            <Stack direction='row' alignItems='flex-start'>
                                {/* 左側に表示する場合はアバター、右揃えならテキストのみ */}
                                {!isOwn &&
                                    (message.uid && userMap[message.uid] ? (
                                        <Avatar.Root size='sm' mt={6}>
                                            <Avatar.Fallback>
                                                {userMap[message.uid].displayName}
                                            </Avatar.Fallback>
                                            <Avatar.Image src={userMap[message.uid].photoURL} />
                                        </Avatar.Root>
                                    ) : (
                                        <Text>匿名:</Text>
                                    ))}
                                <Stack alignItems={isOwn ? "flex-end" : "flex-start"} gap={1}>
                                    <Stack alignItems='center' direction='row' spacing={1}>
                                        {!isOwn && (
                                            <Text textStyle='xs'>
                                                {(message.uid &&
                                                    userMap[message.uid]?.displayName) ||
                                                    "匿名"}
                                            </Text>
                                        )}
                                        <Text
                                            textStyle='xs'
                                            opacity={0.7}
                                            color='brand.abbey'
                                            letterSpacing={1}>
                                            {message.createdAt?.toDate().toLocaleString()}
                                        </Text>
                                    </Stack>
                                    <Text
                                        w='fit-content'
                                        px={4}
                                        py={2}
                                        fontWeight={isOwn ? "light" : "normal"}
                                        bg={isOwn ? "brand.blue" : "brand.e7"}
                                        color={isOwn ? "white" : "brand.shark"}
                                        borderRadius='xl'
                                        maxW={440}>
                                        {message.text}
                                    </Text>
                                </Stack>
                                {/* 右揃えならアバターを右側に */}
                                {isOwn && message.uid && userMap[message.uid] && (
                                    <Avatar.Root size='sm' mt={6}>
                                        <Avatar.Fallback>
                                            {userMap[message.uid].displayName}
                                        </Avatar.Fallback>
                                        <Avatar.Image src={userMap[message.uid].photoURL} />
                                    </Avatar.Root>
                                )}
                            </Stack>
                        </Box>
                    );
                }}
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
