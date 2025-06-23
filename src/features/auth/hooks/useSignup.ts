'use client';

import { useState } from 'react';

import { signup } from '../api/auth';

interface SignupParams {
    displayName: string;
    email: string;
    password: string;
}

interface UseSignupReturn {
    doSignup: (params: SignupParams) => Promise<void>;
    error: string;
    loading: boolean;
}

export function useSignup(): UseSignupReturn {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const doSignup = async ({ displayName, email, password }: SignupParams): Promise<void> => {
        setError('');
        setLoading(true);

        try {
            // 認証＋Cookie＋Firestore 登録を一発で呼び出し
            const photoURL = ''; // photoURL を初期化
            await signup({ email, password, displayName, photoURL });

            // ページ遷移
            window.location.replace('/');
        } catch (err) {
            console.error('Signup error:', err);
            const errorMessage = err instanceof Error ? err.message : '登録に失敗しました。';
            setError(`登録に失敗しました。${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    return { doSignup, error, loading };
}
