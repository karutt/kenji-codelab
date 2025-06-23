'use client';

import { useState } from 'react';

import { login } from '../api/auth';

interface UseLoginReturn {
    doLogin: (email: string, password: string) => Promise<void>;
    error: string;
    loading: boolean;
}

export function useLogin(): UseLoginReturn {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const doLogin = async (email: string, password: string): Promise<void> => {
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            // 少し待ってからリダイレクト
            await new Promise(resolve => setTimeout(resolve, 50));
            window.location.replace('/');
        } catch (err) {
            console.error('Login error:', err);
            setError('メールアドレスまたはパスワードが正しくありません。');
        } finally {
            setLoading(false);
        }
    };

    return { doLogin, error, loading };
}
