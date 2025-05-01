// src/features/user/api/auth.js
import { auth, db } from "@/utils/firebase";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const setSessionCookie = async (idToken) => {
    const res = await fetch("/api/session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
    if (!res.ok) {
        console.error("session API error:", await res.text());
    }
};

export const signup = async ({ email, password, displayName, photoURL }) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(user, { displayName, photoURL });
    // サーバー側にトークン渡して Cookie をセット
    const idToken = await user.getIdToken();
    await setSessionCookie(idToken);
    return user;
};

export const login = async ({ email, password }) => {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    // 同様に Cookie セット
    const idToken = await user.getIdToken();
    await setSessionCookie(idToken);
    return user;
};

export const logout = async () => {
    // セッション Cookie を削除
    await fetch("/api/session", { method: "DELETE", credentials: "include" });
    // Firebase のクライアントもサインアウト
    return firebaseSignOut(auth);
};

export const updateUserProfile = async ({ displayName, photoURL }) => {
    const user = auth.currentUser;
    if (!user) throw new Error("ユーザーがサインインしていません");

    // 1) Auth 側更新
    await updateProfile(user, { displayName, photoURL });

    // 2) Firestore 側更新 or 作成
    const userRef = doc(db, "users", user.uid);
    await setDoc(
        userRef,
        {
            ...(displayName && { displayName }),
            ...(photoURL && { photoURL }),
            updatedAt: serverTimestamp(),
        },
        { merge: true } // ← ドキュメントがなければ作成、あればマージ
    );

    return user;
};
