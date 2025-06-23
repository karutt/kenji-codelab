'use client';
import { collection, limit, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useCallback, useEffect, useRef, useState } from 'react';

import { chatAPI, Message, PaginationState } from '@/features/chat/api/chatAPI';
import { db } from '@/utils/firebase';

export const usePaginatedChat = (pageSize: number = 20, chatRoom: string) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [pagination, setPagination] = useState<PaginationState>({
        lastVisible: null,
        hasMore: false,
    });
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const unsubscribeRef = useRef<(() => void) | null>(null);

    // リアルタイムリスナーのセットアップ
    useEffect(() => {
        if (!chatRoom) return;

        const messagesRef = collection(db, 'chats', chatRoom, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'desc'), limit(pageSize));

        const unsubscribe = onSnapshot(q, snapshot => {
            const newMessages: Message[] = [];
            let newLastVisible = null;

            snapshot.forEach(doc => {
                newMessages.push({
                    id: doc.id,
                    ...doc.data(),
                } as Message);
            });

            if (snapshot.docs.length > 0) {
                newLastVisible = snapshot.docs[snapshot.docs.length - 1];
            }

            setMessages(newMessages.reverse());
            setPagination({
                lastVisible: newLastVisible,
                hasMore: snapshot.docs.length === pageSize,
            });
            setIsInitialized(true);
        });

        unsubscribeRef.current = unsubscribe;

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [chatRoom, pageSize]);

    const loadOlderMessages = useCallback(async () => {
        if (!chatRoom || loadingOlder || !pagination.hasMore || !pagination.lastVisible) return;

        setLoadingOlder(true);
        try {
            const result = await chatAPI.getMessages(chatRoom, pageSize, pagination.lastVisible);

            if (result.messages.length > 0) {
                setMessages(prev => [...result.messages, ...prev]);
                setPagination(result.pagination);
            }
        } catch (error) {
            console.error('Error loading older messages:', error);
        } finally {
            setLoadingOlder(false);
        }
    }, [chatRoom, pageSize, pagination, loadingOlder]);

    const sendMessage = useCallback(
        async (text: string) => {
            if (!chatRoom || !text.trim()) return;

            try {
                await chatAPI.sendMessage(chatRoom, text);
            } catch (error) {
                console.error('Error sending message:', error);
                throw error;
            }
        },
        [chatRoom],
    );

    return {
        messages,
        sendMessage,
        loadOlderMessages,
        loadingOlder,
        isInitialized,
        hasMore: pagination.hasMore,
    };
};
