import { Box, Center } from '@chakra-ui/react';

import SignupForm from '@/features/auth/components/SignupForm';

export default function SignupPage() {
    return (
        <>
            <Center pos="relative" zIndex={2} minH="100vh" bg="white">
                <Box w="full" maxW="360px" bg="white">
                    <SignupForm />
                </Box>
            </Center>
        </>
    );
}
