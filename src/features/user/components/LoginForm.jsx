"use client";
import { useLogin } from "@/features/user/hooks/useLogin";
import {
    Box,
    Button,
    Field,
    Fieldset,
    Heading,
    Highlight,
    Input,
    Separator,
    Stack,
    Text,
} from "@chakra-ui/react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
    const { doLogin, error, loading } = useLogin();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <Box
            as='form'
            onSubmit={(e) => {
                e.preventDefault();
                doLogin(email, password);
            }}>
            <Stack gap={6}>
                <Stack>
                    <Heading size='4xl' textAlign='center'>
                        Welcome back
                    </Heading>
                    <Text textAlign='center' color='gray.500'>
                        Enter your account details below
                    </Text>
                </Stack>
                <Fieldset.Root size='lg'>
                    <Fieldset.Content>
                        <Field.Root>
                            {/* <Field.Label>メールアドレス</Field.Label> */}
                            <Input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email Address'
                                required
                            />
                        </Field.Root>
                        <Field.Root>
                            {/* <Field.Label>パスワード</Field.Label> */}
                            <Input
                                type='password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder='Password'
                                required
                            />
                            <Text fontSize='xs' color='gray.400' mt={1} ml={1}>
                                Must be at least 8 characters
                            </Text>
                        </Field.Root>
                        {error && <Box color='red.500'>{error}</Box>}
                    </Fieldset.Content>
                </Fieldset.Root>
                <Button type='submit' colorScheme='blue' isLoading={loading} bg='brand.blue'>
                    Sign In
                </Button>
                <Separator />
                <Text textAlign='center'>
                    Don't have an account?{" "}
                    <Link href='/signup'>
                        <Highlight styles={{ color: "brand.blue" }} query='Sign Up'>
                            Sign Up
                        </Highlight>
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
}
