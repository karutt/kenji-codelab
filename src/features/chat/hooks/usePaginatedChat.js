// src/features/chat/hooks/usePaginatedChat.js
import { useCallback, useEffect, useRef, useState } from "react";
import {
    fetchOlderMessages,
    listenToLatestMessages,
    sendMessage as sendMessageAPI,
} from "../api/chatAPI";

export const usePaginatedChat = (pageSize = 20) => {
    const [recentMessages, setRecentMessages] = useState([]);
    const [olderMessages, setOlderMessages] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const isInitialLoadRef = useRef(true);

    useEffect(() => {
        const unsubscribe = listenToLatestMessages(pageSize, (changes, newLastDoc) => {
            setRecentMessages((prev) => {
                let updated = [...prev];
                changes.forEach((change) => {
                    const docData = { id: change.doc.id, ...change.doc.data() };
                    if (change.type === "added") {
                        if (!updated.find((msg) => msg.id === docData.id)) {
                            updated.push(docData);
                        }
                    } else if (change.type === "modified") {
                        updated = updated.map((msg) => (msg.id === docData.id ? docData : msg));
                    } else if (change.type === "removed") {
                        updated = updated.filter((msg) => msg.id !== docData.id);
                    }
                });
                const sortedMessages = updated.sort(
                    (a, b) => Number(a.createdAt) - Number(b.createdAt)
                );
                return sortedMessages;
            });
            if (isInitialLoadRef.current) {
                setLastDoc(newLastDoc);
                isInitialLoadRef.current = false;
            }
        });
        return () => unsubscribe();
    }, [pageSize]);

    const loadOlderMessages = useCallback(async () => {
        if (!lastDoc) return;
        setLoadingOlder(true);
        const { messages: older, lastDoc: newLastDoc } = await fetchOlderMessages(
            pageSize,
            lastDoc
        );
        setOlderMessages((prev) => [...older, ...prev]);
        setLastDoc(newLastDoc);
        setLoadingOlder(false);
    }, [pageSize, lastDoc]);

    const sendMessage = useCallback(async (text) => {
        await sendMessageAPI(text);
    }, []);

    const messages = [...olderMessages, ...recentMessages];

    return { messages, sendMessage, loadOlderMessages, loadingOlder };
};
