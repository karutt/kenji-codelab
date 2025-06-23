'use client';
import { useEffect, useState } from 'react';

import { chatAPI, UserData } from '@/features/chat/api/chatAPI';

export const useChatUsers = (
    uids: string[],
): { users: Record<string, UserData>; loading: boolean } => {
    const [users, setUsers] = useState<Record<string, UserData>>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (uids.length === 0) {
            setUsers({});
            return;
        }

        const fetchUsers = async () => {
            setLoading(true);
            try {
                const usersData = await chatAPI.getMultipleUsers(uids);
                setUsers(usersData);
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [uids]);

    return { users, loading };
};
