import { Box, Center } from '@chakra-ui/react';

import LoginForm from '@/features/auth/components/LoginForm';

export default function LoginPage() {
    return (
        <>
            <Center pos="relative" zIndex={2} minH="100vh" bg="white">
                <Box w="full" maxW="360px" bg="white">
                    <LoginForm />
                </Box>
            </Center>
        </>
    );
}
