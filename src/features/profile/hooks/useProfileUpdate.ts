'use client';

import { User } from 'firebase/auth';
import { useState } from 'react';

import { toaster } from '@/components/ui/toaster';
import { updateUserProfile } from '@/features/auth/api/auth';

export function useProfileUpdate(user: User | null) {
    const [isUpdating, setIsUpdating] = useState(false);

    const updateProfile = async (field: 'displayName' | 'photoURL', value: string) => {
        if (!user) return;

        const trimmedValue = value.trim();
        const currentValue = field === 'displayName' ? user.displayName : user.photoURL;

        // 値が変更されていない場合は何もしない
        if (trimmedValue === (currentValue || '')) {
            return;
        }

        try {
            setIsUpdating(true);
            await updateUserProfile({
                [field]: trimmedValue || undefined,
            });

            toaster.create({
                title: 'プロフィールを更新しました',
                type: 'success',
                duration: 3000,
            });
        } catch (error) {
            console.error('Profile update error:', error);
            toaster.create({
                title: 'プロフィールの更新に失敗しました',
                type: 'error',
                duration: 3000,
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const updateDisplayName = (displayName: string) => updateProfile('displayName', displayName);
    const updatePhotoURL = (photoURL: string) => updateProfile('photoURL', photoURL);

    return {
        isUpdating,
        updateDisplayName,
        updatePhotoURL,
    };
}
