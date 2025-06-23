import {
    addDoc,
    collection,
    doc,
    DocumentSnapshot,
    getDoc,
    getDocs,
    limit,
    orderBy,
    query,
    startAfter,
    Timestamp,
    where,
} from 'firebase/firestore';

import { auth, db } from '@/utils/firebase';

export interface UserData {
    displayName?: string;
    photoURL?: string;
    email?: string;
}

export interface Message {
    id: string;
    text: string;
    uid: string;
    createdAt: Timestamp | Date;
}

export interface PaginationState {
    lastVisible: DocumentSnapshot | null;
    hasMore: boolean;
}

export const chatAPI = {
    async sendMessage(chatRoom: string, text: string): Promise<void> {
        if (!auth.currentUser) {
            throw new Error('User not authenticated');
        }

        const messagesRef = collection(db, 'chats', chatRoom, 'messages');
        await addDoc(messagesRef, {
            text: text.trim(),
            uid: auth.currentUser.uid,
            createdAt: new Date(),
        });
    },

    async getMessages(
        chatRoom: string,
        pageSize: number = 20,
        lastVisible?: DocumentSnapshot,
    ): Promise<{ messages: Message[]; pagination: PaginationState }> {
        try {
            const messagesRef = collection(db, 'chats', chatRoom, 'messages');
            let q = query(messagesRef, orderBy('createdAt', 'desc'), limit(pageSize));

            if (lastVisible) {
                q = query(
                    messagesRef,
                    orderBy('createdAt', 'desc'),
                    startAfter(lastVisible),
                    limit(pageSize),
                );
            }

            const snapshot = await getDocs(q);
            const messages: Message[] = [];

            snapshot.forEach(doc => {
                messages.push({
                    id: doc.id,
                    ...doc.data(),
                } as Message);
            });

            const newLastVisible = snapshot.docs[snapshot.docs.length - 1];
            const hasMore = snapshot.docs.length === pageSize;

            return {
                messages: messages.reverse(),
                pagination: {
                    lastVisible: newLastVisible,
                    hasMore,
                },
            };
        } catch (error) {
            console.error('Error fetching messages:', error);
            return {
                messages: [],
                pagination: {
                    lastVisible: null,
                    hasMore: false,
                },
            };
        }
    },

    async getUserData(uid: string): Promise<UserData | null> {
        try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
                return userDoc.data() as UserData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    async getMultipleUsers(uids: string[]): Promise<Record<string, UserData>> {
        if (uids.length === 0) return {};

        try {
            const usersRef = collection(db, 'users');
            const q = query(usersRef, where('__name__', 'in', uids));
            const snapshot = await getDocs(q);

            const users: Record<string, UserData> = {};
            snapshot.forEach(doc => {
                users[doc.id] = doc.data() as UserData;
            });

            return users;
        } catch (error) {
            console.error('Error fetching multiple users:', error);
            return {};
        }
    },
};
