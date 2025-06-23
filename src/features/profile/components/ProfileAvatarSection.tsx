'use client';

import { Avatar, Box, VStack } from '@chakra-ui/react';
import { User } from 'firebase/auth';

import EditableField from './EditableField';

interface ProfileAvatarSectionProps {
    user: User;
    onUpdatePhoto: (photoURL: string) => void;
    isUpdating: boolean;
}

export default function ProfileAvatarSection({
    user,
    onUpdatePhoto,
    isUpdating,
}: ProfileAvatarSectionProps) {
    return (
        <VStack gap={3} w="full" maxW="md">
            <Box pos="relative" w="180px" h="180px">
                <Avatar.Root size="full" maxW="md">
                    <Avatar.Fallback name={user.displayName || user.email || 'User'} />
                    <Avatar.Image src={user.photoURL || undefined} />
                </Avatar.Root>
            </Box>

            <Box w="full" maxW="md">
                <EditableField
                    label="Avatar URL"
                    value={user.photoURL}
                    placeholder="画像URLを入力してください"
                    emptyText="クリックして画像URLを設定"
                    onUpdate={onUpdatePhoto}
                    isDisabled={isUpdating}
                    type="url"
                />
            </Box>
        </VStack>
    );
}
