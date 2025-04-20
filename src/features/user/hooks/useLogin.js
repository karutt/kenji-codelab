"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { login } from "../api/auth";

export function useLogin() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const doLogin = async (email, password) => {
        setError("");
        setLoading(true);
        try {
            await login({ email, password });
            await new Promise((res) => setTimeout(res, 500)); // ←⏸ ほんの少し待つ
            router.replace("/");
        } catch {
            setError("メールアドレスまたはパスワードが正しくありません。");
        } finally {
            setLoading(false);
        }
    };

    return { doLogin, error, loading };
}
