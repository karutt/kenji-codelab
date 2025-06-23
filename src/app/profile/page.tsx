'use client';

import { Box, Button, Center, Heading, Text, VStack } from '@chakra-ui/react';

import { useAuth } from '@/contexts/AuthContext';
import { logout } from '@/features/auth/api/auth';
import ProfileAvatarSection from '@/features/profile/components/ProfileAvatarSection';
import ProfileInfoSection from '@/features/profile/components/ProfileInfoSection';
import { useProfileUpdate } from '@/features/profile/hooks/useProfileUpdate';
import { useRequireAuth } from '@/hooks/useRequireAuth';

export default function ProfilePage() {
    useRequireAuth();
    const { user } = useAuth();
    const { isUpdating, updateDisplayName, updatePhotoURL } = useProfileUpdate(user);

    const handleLogout = async () => {
        try {
            await logout();
            window.location.replace('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!user) {
        return (
            <Center minH="50vh">
                <Text>Loading...</Text>
            </Center>
        );
    }

    return (
        <Center pos="relative" zIndex="2" minH="100vh" py={12}>
            <Box w="full" maxW="sm" py={8} bg="white" borderRadius="xl">
                <VStack gap={4} maxW="md">
                    {/* Profile Header */}
                    <VStack gap={4} w="full" maxW="md">
                        <Heading color="brand.shark" size="3xl">
                            Profile
                        </Heading>

                        {/* Avatar Section */}
                        <ProfileAvatarSection
                            user={user}
                            onUpdatePhoto={updatePhotoURL}
                            isUpdating={isUpdating}
                        />
                    </VStack>

                    {/* Profile Information */}
                    <ProfileInfoSection
                        user={user}
                        onUpdateDisplayName={updateDisplayName}
                        isUpdating={isUpdating}
                    />

                    {/* Logout Button */}
                    <Button
                        w="full"
                        loading={isUpdating}
                        loadingText="更新中..."
                        onClick={handleLogout}
                        variant="solid"
                    >
                        Sign Out
                    </Button>
                </VStack>
            </Box>
        </Center>
    );
}
