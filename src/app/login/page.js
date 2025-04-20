import LoginForm from "@/features/user/components/LoginForm";
import { Box, Center } from "@chakra-ui/react";
export default function LoginPage() {
    return (
        <>
            <Center zIndex={2} position='relative' minH='100vh' bg='white'>
                <Box w='full' maxW='360px' bg='white'>
                    <LoginForm />
                </Box>
            </Center>
        </>
    );
}
