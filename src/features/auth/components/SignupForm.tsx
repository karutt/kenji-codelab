'use client';

import { Box, Button, Fieldset, Heading, Stack, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

import { Input } from '@/components/common/Input';
import { useSignup } from '@/features/auth/hooks/useSignup';

export default function SignupForm() {
    const { doSignup, error, loading } = useSignup();
    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPwd, setConfirmPwd] = useState('');
    const [validationError, setValidationError] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setValidationError('');

        // Basic validation
        if (password.length < 8) {
            setValidationError('Password must be at least 8 characters long');
            return;
        }

        if (password !== confirmPwd) {
            setValidationError('Passwords do not match');
            return;
        }

        if (!displayName.trim()) {
            setValidationError('Display name is required');
            return;
        }

        doSignup({ displayName: displayName.trim(), email, password });
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
                        Create your account
                    </Heading>
                    <Text color="brand.abbey" fontSize="sm">
                        Enter your details below
                    </Text>
                </Stack>

                <Fieldset.Root>
                    <Fieldset.Content>
                        <Stack gap={4}>
                            <Input
                                px={4}
                                value={displayName}
                                onChange={e => setDisplayName(e.target.value)}
                                placeholder="Your Name"
                                required
                            />
                            <Input
                                px={4}
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Email Address"
                                required
                            />
                            <Box>
                                <Input
                                    px={4}
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Password"
                                    required
                                />
                                <Text mt={1} ml={1} color="brand.hitGray" fontSize="xs">
                                    Must be at least 8 characters
                                </Text>
                            </Box>
                            <Input
                                px={4}
                                type="password"
                                value={confirmPwd}
                                onChange={e => setConfirmPwd(e.target.value)}
                                placeholder="Confirm Password"
                                required
                            />
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
                    Sign Up
                </Button>

                <Text fontSize="sm" textAlign="center">
                    Already have an account?{' '}
                    <Link href="/login" style={{ color: 'var(--chakra-colors-brand-blue)' }}>
                        Sign In
                    </Link>
                </Text>
            </Stack>
        </Box>
    );
}
