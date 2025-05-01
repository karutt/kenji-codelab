// src/hooks/useSignup.js
import { auth, db } from "@/utils/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { updateUserProfile } from "../api/auth"; // 追加

export function useSignup() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const doSignup = async ({ displayName, email, password }) => {
        setError("");
        setLoading(true);

        try {
            // 1) Firebase Auth でユーザー作成
            const { user } = await createUserWithEmailAndPassword(auth, email, password);

            // 2) Auth プロフィールに displayName をセット
            await updateProfile(user, { displayName });

            // 画像がなければランダム画像をセットし、updateUserProfileでauth側も更新
            let photoURL = user.photoURL;
            if (!photoURL) {
                const randomN = Math.floor(Math.random() * 16) + 1;
                photoURL = `https://kenji-codelab.vercel.app/sample_profile/${randomN}.png`;
                await updateUserProfile({
                    displayName,
                    photoURL,
                });
            }

            // 3) Firestore の users コレクションへドキュメントを登録
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                displayName: user.displayName,
                email: user.email,
                photoURL,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                role: "user",
            });
            
            // サインアップ後にトップページへリダイレクト
            window.location.replace("/");
        } catch (err) {
            setError("登録に失敗しました。" + err.message);
        } finally {
            setLoading(false);
        }
    };

    return { doSignup, error, loading };
}
