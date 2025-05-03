import { Timestamp } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import {
    fetchInitialMessages,
    fetchOlderMessages,
    listenToLatestMessages,
    sendMessage as sendMessageAPI,
} from "../api/chatAPI";

export const usePaginatedChat = (pageSize = 20, collectionName) => {
    const [recentMessages, setRecentMessages] = useState([]);
    const [olderMessages, setOlderMessages] = useState([]);
    const [lastDoc, setLastDoc] = useState(null);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const isFirstLoadRef = useRef(true);
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        if (!collectionName) return;

        (async () => {
            // 1) 初回は静的にまとめて取得
            const { messages: initMsgs, lastDoc: initLast } = await fetchInitialMessages(
                collectionName,
                pageSize
            );
            setRecentMessages(initMsgs);
            setLastDoc(initLast);

            // 2) 以降はリアルタイム差分だけ購読
            unsubscribeRef.current = listenToLatestMessages(
                collectionName,
                pageSize,
                (changes, newLast) => {
                    setRecentMessages((prev) => {
                        let updated = [...prev];
                        changes.forEach((chg) => {
                            const docData = { id: chg.doc.id, ...chg.doc.data() };
                            if (chg.type === "added") {
                                if (!updated.find((m) => m.id === docData.id)) {
                                    if (!docData.createdAt) {
                                        // +2秒してセット
                                        const now = new Date();
                                        now.setSeconds(now.getSeconds() + 1);
                                        docData.createdAt = Timestamp.fromDate(now);
                                    }
                                    updated.push(docData);
                                }
                            } else if (chg.type === "modified") {
                                updated = updated.map((m) => (m.id === docData.id ? docData : m));
                            } else if (chg.type === "removed") {
                                updated = updated.filter((m) => m.id !== docData.id);
                            }
                        });
                        return updated.sort((a, b) => Number(a.createdAt) - Number(b.createdAt));
                    });
                    if (isFirstLoadRef.current) {
                        setLastDoc(newLast);
                        isFirstLoadRef.current = false;
                    }
                }
            );
        })();

        return () => {
            if (unsubscribeRef.current) unsubscribeRef.current();
        };
    }, [collectionName, pageSize]);

    const loadOlderMessages = useCallback(async () => {
        if (!lastDoc || !collectionName) return;
        setLoadingOlder(true);
        const { messages: older, lastDoc: newLast } = await fetchOlderMessages(
            collectionName,
            pageSize,
            lastDoc
        );
        setOlderMessages((prev) => [...older, ...prev]);
        setLastDoc(newLast);
        setLoadingOlder(false);
    }, [collectionName, pageSize, lastDoc]);

    const sendMessage = useCallback(
        async (text) => {
            await sendMessageAPI(collectionName, text);
        },
        [collectionName]
    );

    const messages = [...olderMessages, ...recentMessages];
    return { messages, sendMessage, loadOlderMessages, loadingOlder };
};
