// src/features/user/hooks/useAuthSync.ts
"use client";
import { auth } from "@/utils/firebase";
import { onIdTokenChanged } from "firebase/auth";
import { useEffect, useRef } from "react";

export function useAuthSync() {
    const skipInitial = useRef(true);
    const lastSync = useRef(0);
    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async (user) => {
            // 初回ダミー呼び出しは飛ばす
            if (skipInitial.current) {
                skipInitial.current = false;
                return;
            }
            // 最終同期から 5 分以内なら飛ばす
            const now = Date.now();
            if (now - lastSync.current < 5 * 60 * 1000) return;
            lastSync.current = now;

            if (user) {
                const idToken = await user.getIdToken();
                await fetch("/api/session", {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ idToken }),
                });
            } else {
                await fetch("/api/session", {
                    method: "DELETE",
                    credentials: "include",
                });
            }
        });
        return unsubscribe;
    }, []);
}
