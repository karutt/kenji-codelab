"use client";
import ProfileForm from "@/features/user/components/ProfileForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Box, Center } from "@chakra-ui/react";

export default function ProfilePage() {
    useRequireAuth();

    return (
        <>
            <Center minH='100vh' py={12} zIndex='2' position='relative'>
                <Box w='full' maxW='md' py={8} px={12} bg='white' borderRadius='xl'>
                    <ProfileForm />
                </Box>
            </Center>
        </>
    );
}
