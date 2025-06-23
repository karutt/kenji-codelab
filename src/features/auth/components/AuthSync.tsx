'use client';

import { useAuthSync } from '../hooks/useAuthSync';
/**
 * AuthSync component manages Firebase ID token synchronization with server-side session cookies.
 * This component should be included in the root layout to ensure tokens are kept in sync.
 */
export default function AuthSync() {
    useAuthSync();
    return null;
}
