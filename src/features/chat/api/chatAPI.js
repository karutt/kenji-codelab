// src/features/chat/api/chatAPI.js
import { auth, db } from "@/utils/firebase";
import {
    addDoc,
    collection,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
} from "firebase/firestore";

export const listenToLatestMessages = (pageSize, callback) => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(pageSize));
    const unsubscribe = onSnapshot(q, (snapshot) => {
        const changes = snapshot.docChanges().map((change) => ({
            type: change.type,
            doc: change.doc,
        }));
        const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
        callback(changes, lastDoc);
    });
    return unsubscribe;
};

export const sendMessage = async (text) => {
    const { uid, displayName } = auth.currentUser || {};
    if (!text.trim()) return;
    await addDoc(collection(db, "messages"), {
        text,
        createdAt: serverTimestamp(),
        uid,
        displayName,
    });
};

export const fetchInitialMessages = async (pageSize) => {
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"), limit(pageSize));
    const snapshot = await getDocs(q);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return { messages: messages.reverse(), lastDoc };
};

export const fetchOlderMessages = async (pageSize, afterDoc) => {
    const q = query(
        collection(db, "messages"),
        orderBy("createdAt", "desc"),
        startAfter(afterDoc),
        limit(pageSize)
    );
    const snapshot = await getDocs(q);
    const lastDoc = snapshot.docs[snapshot.docs.length - 1] || null;
    const messages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
    return { messages: messages.reverse(), lastDoc };
};
