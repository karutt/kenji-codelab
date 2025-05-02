// src/hooks/useSignup.js
import { signup } from "@/features/user/api/auth";
import { useState } from "react";

export function useSignup() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const doSignup = async ({ displayName, email, password }) => {
        setError("");
        setLoading(true);

        try {
            // 認証＋Cookie＋Firestore 登録を一発で呼び出し
            const photoURL = ""; // ここで photoURL を初期化
            await signup({ email, password, displayName, photoURL });

            // 必要ならページ遷移など
            window.location.replace("/");
        } catch (err) {
            console.error(err);
            setError("登録に失敗しました。" + err.message);
        } finally {
            setLoading(false);
        }
    };

    return { doSignup, error, loading };
}
