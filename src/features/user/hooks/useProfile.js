/* src/features/user/hooks/useProfile.js */
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { logout, updateUserProfile } from "../api/auth";

export function useProfile() {
    const { user } = useAuth();
    const router = useRouter();

    const [displayName, setDisplayName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [status, setStatus] = useState("idle");
    const [logoutLoading, setLogoutLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setDisplayName(user.displayName || "");
            setAvatarUrl(user.photoURL || "");
        } else {
            setDisplayName("");
            setAvatarUrl("");
        }
    }, [user]);

    const handleUpdate = useCallback(async () => {
        setStatus("loading");
        try {
            await updateUserProfile({
                displayName,
                photoURL: avatarUrl.trim() || undefined,
            });
            setStatus("success");
        } catch (e) {
            console.error(e);
            setStatus("error");
        }
    }, [displayName, avatarUrl]);

    const handleLogout = useCallback(async () => {
        setLogoutLoading(true);
        try {
            await logout();
            router.replace("/login");
        } finally {
            // ページ遷移後はアンマウントされるため setState を省略
        }
    }, [router]);

    return useMemo(
        () => ({
            displayName,
            setDisplayName,
            avatarUrl,
            setAvatarUrl,
            status,
            loading: status === "loading",
            logoutLoading,
            handleUpdate,
            handleLogout,
        }),
        [displayName, avatarUrl, status, logoutLoading, handleUpdate, handleLogout]
    );
}
