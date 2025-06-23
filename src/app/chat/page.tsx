'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ChatPage() {
    const router = useRouter();

    useEffect(() => {
        // チャットページにアクセスされた場合、デフォルトでglobalチャットにリダイレクト
        router.replace('/chat/global');
    }, [router]);

    return null; // リダイレクト中なので何も表示しない
}
