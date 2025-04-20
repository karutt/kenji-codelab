// src/features/user/components/AuthSync.jsx
"use client";
import { useAuthSync } from "@/features/user/hooks/useAuthSync";

export default function AuthSync() {
    useAuthSync();
    return null;
}
