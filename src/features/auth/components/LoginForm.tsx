'use client';

import { Box, Button, Fieldset, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/common/Input';
import { useLogin } from '@/features/auth/hooks/useLogin';

export default function LoginForm() {
    const { doLogin, error, loading } = useLogin();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // Basic validation
        if (!email.trim()) {
            setValidationError('Email is required');
            return;
        }

        if (!password.trim()) {
            setValidationError('Password is required');
            return;
        }

        // if (password.length < 8) {
        //     setValidationError('Password must be at least 8 characters long');
        //     return;
        // }

        doLogin(email.trim(), password);
    };

    return (
        <Box
            as="form"
            w="full"
            maxW="360px"
            p={8}
            bg="white"
            borderRadius="lg"
            shadow="lg"
            onSubmit={handleSubmit}
        >
            <Stack gap={6}>
                <Stack textAlign="center">
                    <Heading color="brand.shark" size="xl">
                        Welcome back
                    </Heading>
                    <Text color="brand.abbey" fontSize="sm">
                        Enter your account details below
                    </Text>
                </Stack>

                <Fieldset.Root>
                    <Fieldset.Content>
                        <Stack gap={4} color="brand.shark">
                            <Input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                                px={4}
                            />
                            <Box>
                                <Input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                    px={4}
                                />
                                <Text mt={1} ml={1} color="brand.hitGray" fontSize="xs">
                                    Must be at least 8 characters
                                </Text>
                            </Box>
                        </Stack>
                        {(error || validationError) && (
                            <Box mt={2} color="red.500" fontSize="sm">
                                {validationError || error}
                            </Box>
                        )}
                    </Fieldset.Content>
                </Fieldset.Root>

                <Button
                    w="full"
                    color="white"
                    bg="brand.blue"
                    _hover={{
                        bg: 'brand.blue75',
                    }}
                    loading={loading}
                    type="submit"
                >
                    Sign In
                </Button>

                <Text fontSize="sm" textAlign="center">
                    Don&apos;t have an account?{' '}
                    <Link href="/signup" style={{ color: 'var(--chakra-colors-brand-blue)' }}>
                        Sign Up
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
}
