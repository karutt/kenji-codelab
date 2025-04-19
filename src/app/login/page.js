"use client";
import { auth } from "@/utils/firebase";
import { Box, Button, Field, Fieldset, Heading, Input, Stack } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.replace("/");
        } catch (err) {
            setError("メールアドレスまたはパスワードが正しくありません。");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Box minH='100vh' display='flex' alignItems='center' justifyContent='center' bg='gray.50'>
            <Box w='full' maxW='md' p={8} borderRadius='xl' boxShadow='lg' bg='white'>
                <form onSubmit={handleSubmit}>
                    <Stack gap='8'>
                        <Heading size='lg' mb={4}>
                            ログイン
                        </Heading>
                        <Fieldset.Root size='lg'>
                            <Fieldset.Content>
                                <Field.Root>
                                    <Field.Label>メールアドレス</Field.Label>
                                    <Input
                                        name='email'
                                        type='email'
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        autoComplete='email'
                                        required
                                    />
                                </Field.Root>
                                <Field.Root>
                                    <Field.Label>パスワード</Field.Label>
                                    <Input
                                        name='password'
                                        type='password'
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete='current-password'
                                        required
                                    />
                                </Field.Root>
                                {error && (
                                    <Box color='red.500' fontSize='sm' mt={2}>
                                        {error}
                                    </Box>
                                )}
                            </Fieldset.Content>
                        </Fieldset.Root>
                        <Button type='submit' colorScheme='blue' w='full' isLoading={isSubmitting}>
                            ログイン
                        </Button>
                    </Stack>
                </form>
            </Box>
        </Box>
    );
}
