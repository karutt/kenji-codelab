"use client";
import {
    Box,
    Button,
    Field,
    Fieldset,
    Heading,
    Highlight,
    Input,
    Link,
    Separator,
    Stack,
    Text,
} from "@chakra-ui/react";
import { useState } from "react";

import { useSignup } from "../hooks/useSignup";

export default function SignupForm() {
    const { doSignup, error, loading } = useSignup();
    const [displayName, setDisplayName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password !== confirmPwd) {
            return; // フォーム上ではバリデーション済みとしてもOK
        }
        doSignup({ displayName, email, password });
    };

    return (
        <Box as='form' onSubmit={handleSubmit}>
            <Stack gap={6}>
                <Stack>
                    <Heading size='4xl' textAlign='center'>
                        Create your account
                    </Heading>
                    <Text textAlign='center' color='gray.500'>
                        Enter your details below
                    </Text>
                </Stack>
                <Fieldset.Root size='lg'>
                    <Fieldset.Content>
                        <Field.Root>
                            <Input
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder='Your Name'
                                required
                            />
                        </Field.Root>
                        <Field.Root>
                            <Input
                                type='email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder='Email Address'
                                required
                            />
                        </Field.Root>
                        <Field.Root>
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
                        <Field.Root>
                            <Input
                                type='password'
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                placeholder='Confirm Password'
                                required
                            />
                        </Field.Root>
                        {error && (
                            <Box color='red.500' fontSize='sm'>
                                {error}
                            </Box>
                        )}
                    </Fieldset.Content>
                </Fieldset.Root>
                <Button
                    type='submit'
                    colorScheme='blue'
                    isLoading={loading}
                    w='full'
                    bg='brand.blue'>
                    Sign Up
                </Button>
                <Separator />
                <Text textAlign='center'>
                    Already have an account?{" "}
                    <Link href='/login'>
                        <Highlight styles={{ color: "brand.blue" }} query='Sign In'>
                            Sign In
                        </Highlight>
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
}
