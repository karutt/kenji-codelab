import { auth, db } from "@/utils/firebase";
import {
    addDoc,
    collection,
    deleteDoc, // 追加
    doc,
    getDocs,
    limit,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    startAfter,
} from "firebase/firestore";

/**
 * 初回静的取得
 */
export const fetchInitialMessages = async (collectionName, pageSize) => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"), limit(pageSize));
    const snap = await getDocs(q);
    const lastDoc = snap.docs[snap.docs.length - 1] || null;
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { messages: messages.reverse(), lastDoc };
};

/**
 * 過去ページネーション取得
 */
export const fetchOlderMessages = async (collectionName, pageSize, afterDoc) => {
    const q = query(
        collection(db, collectionName),
        orderBy("createdAt", "desc"),
        startAfter(afterDoc),
        limit(pageSize)
    );
    const snap = await getDocs(q);
    const lastDoc = snap.docs[snap.docs.length - 1] || null;
    const messages = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return { messages: messages.reverse(), lastDoc };
};

/**
 * リアルタイム差分購読
 */
export const listenToLatestMessages = (collectionName, pageSize, callback) => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"), limit(pageSize));
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

/**
 * メッセージ送信
 */
export const sendMessage = async (collectionName, text) => {
    const { uid, displayName } = auth.currentUser || {};
    if (!text.trim()) return;
    await addDoc(collection(db, collectionName), {
        text,
        createdAt: serverTimestamp(),
        uid,
        displayName,
    });
};

/**
 * チャット内の全てのコメントを削除
 */
export const deleteAllMessages = async (collectionName) => {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const batchDeletes = snap.docs.map((d) => {
        deleteDoc(doc(db, collectionName, d.id));
    });
    await Promise.all(batchDeletes);
};
