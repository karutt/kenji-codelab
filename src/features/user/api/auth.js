// src/features/user/api/auth.js
import { auth } from "@/utils/firebase";
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    signInWithEmailAndPassword,
    updateProfile,
} from "firebase/auth";

const setSessionCookie = async (idToken) => {
    await fetch("/api/session", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
    });
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

export const updateUserProfile = ({ displayName, photoURL }) =>
    updateProfile(auth.currentUser, { displayName, photoURL });
