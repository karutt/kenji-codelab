"use client";
import { auth } from "@/utils/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect } from "react";

export function AuthSync() {
    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            if (user) {
                // ログイン or IDトークン更新時に Cookie を再発行
                const idToken = await user.getIdToken();
                await fetch("/api/session", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });
            } else {
                // ログアウト時に Cookie を削除
                await fetch("/api/session", { method: "DELETE" });
            }
        });
        return unsubscribe;
    }, []);

    return null;
}
