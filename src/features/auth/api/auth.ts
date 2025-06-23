import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
} from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

import { auth, db } from '@/utils/firebase';

interface SignupParams {
    email: string;
    password: string;
    displayName: string;
    photoURL?: string;
}

interface LoginParams {
    email: string;
    password: string;
}

interface UpdateProfileParams {
    displayName?: string;
    photoURL?: string;
}

const setSessionCookie = async (idToken: string): Promise<void> => {
    try {
        const response = await fetch('/api/session', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ idToken }),
        });

        if (!response.ok) {
            console.error('Session API error:', await response.text());
        }
    } catch (error) {
        console.error('Failed to set session cookie:', error);
    }
};

export const signup = async ({
    email,
    password,
    displayName,
    photoURL = '',
}: SignupParams): Promise<User> => {
    // 1) Firebase Auth でユーザー作成
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    // 2) Auth プロフィール更新
    await updateProfile(user, { displayName, photoURL });

    // 3) セッション Cookie 用トークン取得＆セット
    const idToken = await user.getIdToken();
    await setSessionCookie(idToken);

    // 4) Firestore にユーザードキュメント登録
    await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        displayName,
        email,
        photoURL,
        role: 'user',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });

    return user;
};

export const login = async ({ email, password }: LoginParams): Promise<User> => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);

    // セッション Cookie セット
    const idToken = await user.getIdToken();
    await setSessionCookie(idToken);

    return user;
};

export const logout = async (): Promise<void> => {
    // セッション Cookie を削除
    try {
        await fetch('/api/session', {
            method: 'DELETE',
            credentials: 'include',
        });
    } catch (error) {
        console.error('Failed to delete session cookie:', error);
    }

    // Firebase のクライアントもサインアウト
    return signOut(auth);
};

export const updateUserProfile = async ({
    displayName,
    photoURL,
}: UpdateProfileParams): Promise<User> => {
    const user = auth.currentUser;
    if (!user) {
        throw new Error('ユーザーがサインインしていません');
    }

    // 1) Auth 側更新
    await updateProfile(user, { displayName, photoURL });

    // 2) Firestore 側更新 or 作成
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
        userRef,
        {
            ...(displayName && { displayName }),
            ...(photoURL && { photoURL }),
            updatedAt: serverTimestamp(),
        },
        { merge: true }, // ドキュメントがなければ作成、あればマージ
    );

    return user;
};
