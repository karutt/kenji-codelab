import SignupForm from "@/features/user/components/SignupForm";
import { Box, Center } from "@chakra-ui/react";
import Image from "next/image";

export default function SignupPage() {
    return (
        <>
            <Center zIndex={2} position='relative' minH='100vh' bg='white'>
                <Box w='full' maxW='360px' bg='white'>
                    <SignupForm />
                </Box>
            </Center>
            {/* <Bg /> */}
        </>
    );
}
