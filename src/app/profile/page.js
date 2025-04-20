"use client";
import Bg from "@/components/common/bg";
import ProfileForm from "@/features/user/components/ProfileForm";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Box, Center } from "@chakra-ui/react";

export default function ProfilePage() {
    // 認証必須（ログインしてないと /login に飛ぶ）
    useRequireAuth();

    return (
        <>
            <Center minH='100vh' py={12} zIndex='2' position='relative'>
                <Box w='full' maxW='md' p={8} bg='white' borderRadius='xl' boxShadow='lg'>
                    <ProfileForm />
                </Box>
            </Center>
            <Bg />
        </>
    );
}
