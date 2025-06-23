'use client';

import { onIdTokenChanged } from 'firebase/auth';
import { useEffect, useRef } from 'react';

import { auth } from '@/utils/firebase';

/**
 * Hook to synchronize Firebase ID tokens with server-side session cookies.
 * This ensures that the server can validate authentication state.
 */
export function useAuthSync(): void {
    const skipInitial = useRef(true);
    const lastSync = useRef(0);

    useEffect(() => {
        const unsubscribe = onIdTokenChanged(auth, async user => {
            // Skip the initial dummy call
            if (skipInitial.current) {
                skipInitial.current = false;
                return;
            }

            // Skip if last sync was within 5 minutes
            const now = Date.now();
            if (now - lastSync.current < 5 * 60 * 1000) {
                return;
            }
            lastSync.current = now;

            if (user) {
                // User is signed in, set session cookie
                try {
                    const idToken = await user.getIdToken();
                    await fetch('/api/session', {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ idToken }),
                    });
                } catch (error) {
                    console.error('Failed to sync auth token:', error);
                }
            } else {
                // User is signed out, clear session cookie
                try {
                    await fetch('/api/session', {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                } catch (error) {
                    console.error('Failed to clear session cookie:', error);
                }
            }
        });

        return unsubscribe;
    }, []);
}
