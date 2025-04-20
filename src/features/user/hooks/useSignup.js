import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "../api/auth";

export function useSignup() {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const doSignup = async ({ displayName, email, password }) => {
        setError("");
        setLoading(true);
        try {
            await signup({
                displayName,
                email,
                password,
                photoURL: "",
            });
            router.replace("/");
        } catch {
            setError("登録に失敗しました。");
        } finally {
            setLoading(false);
        }
    };

    return { doSignup, error, loading };
}
