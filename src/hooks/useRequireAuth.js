// src/hooks/useRequireAuth.js
"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * ページにアクセスした際、未ログインなら /login にリダイレクトします。
 * 認証中（loading=true）の間は何もしません。
 */
export function useRequireAuth() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/login");
        }
    }, [user, loading, router]);
}
