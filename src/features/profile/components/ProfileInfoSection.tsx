'use client';

import { Stack } from '@chakra-ui/react';
import { User } from 'firebase/auth';

import EditableField from './EditableField';
import ReadOnlyField from './ReadOnlyField';

interface ProfileInfoSectionProps {
    user: User;
    onUpdateDisplayName: (displayName: string) => void;
    isUpdating: boolean;
}

export default function ProfileInfoSection({
    user,
    onUpdateDisplayName,
    isUpdating,
}: ProfileInfoSectionProps) {
    const formatCreationDate = (creationTime: string | undefined) => {
        if (!creationTime) return 'Unknown';
        return new Date(creationTime).toLocaleDateString('ja-JP');
    };

    return (
        <Stack gap={4} w="full">
            <EditableField
                label="Display Name"
                value={user.displayName}
                placeholder="表示名を入力してください"
                emptyText="クリックして名前を設定"
                onUpdate={onUpdateDisplayName}
                isDisabled={isUpdating}
                type="text"
            />

            <ReadOnlyField label="Email" value={user.email || ''} />

            <ReadOnlyField
                label="Account Created"
                value={formatCreationDate(user.metadata.creationTime)}
            />
        </Stack>
    );
}
