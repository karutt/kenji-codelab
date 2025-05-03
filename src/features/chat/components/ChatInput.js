"use client";
import { Box, IconButton, Input, Stack } from "@chakra-ui/react";
import { useParams } from "next/navigation";
import React, { useCallback, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { deleteAllMessages } from "../api/chatAPI";

const ChatInput = React.memo(({ onSend, virtuosoRef }) => {
    const [message, setMessage] = useState("");

    const handleChange = useCallback((e) => {
        setMessage(e.target.value);
    }, []);

    const handleSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            if (!message.trim()) return;
            await onSend(message);
            setMessage("");
            if (virtuosoRef.current) {
                virtuosoRef.current.scrollToIndex({
                    index: "LAST",
                    align: "start",
                    behavior: "auto",
                });
            }
        },
        [message, onSend, virtuosoRef]
    );

    // const { slug } = useParams();
    // const handleDeleteAll = useCallback(async () => {
    //     await deleteAllMessages(slug);
    // }, [slug]);

    return (
        <Box as='form' onSubmit={handleSubmit} px={4} py={2}>
            <Stack alignItems='center' direction='row'>
                <Input
                    px={4}
                    py={6}
                    fontSize={16}
                    borderColor='brand.e2'
                    borderRadius='full'
                    _focus={{ borderColor: "border.emphasized", outline: "none" }}
                    onChange={handleChange}
                    placeholder='メッセージを入力...'
                    color='brand.shark'
                    type='text'
                    value={message}
                />

                <IconButton
                    color='gray.shark'
                    aria-label='送信'
                    size='2xl'
                    type='submit'
                    variant='ghost'>
                    <IoMdSend />
                </IconButton>
                {/* 
                <IconButton
                    color='red.400'
                    aria-label='全て削除'
                    size='2xl'
                    type='button'
                    variant='ghost'
                    ml={2}
                    onClick={handleDeleteAll}>
                    <span style={{ fontWeight: "bold" }}>全削除</span>
                </IconButton> */}
            </Stack>
        </Box>
    );
});

export default ChatInput;
