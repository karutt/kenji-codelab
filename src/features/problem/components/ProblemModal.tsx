'use client';

import { Box, Button, Center } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Modal } from '@/components/common/Modal';
import { useAuth } from '@/contexts/AuthContext';

import NameInputForm from './NameInputForm';

interface ProblemModalProps {
    isOpen: boolean;
    onClose: () => void;
    articleSlug: string;
    bookSlug: string;
}

export default function ProblemModal({
    isOpen,
    onClose,
    articleSlug,
    bookSlug,
}: ProblemModalProps) {
    const { user } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleNameSubmit = async (name: string) => {
        setIsLoading(true);
        try {
            // Store name in localStorage for submission
            localStorage.setItem('kenji_name', name);

            // Close modal and navigate to problem page
            onClose();

            // Navigate to the problem page
            router.push(`/books/${bookSlug}/${articleSlug}/problems`);
        } catch (error) {
            console.error('Error navigating to problem page:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoggedInUserStart = () => {
        // If user is logged in, go directly to problem page
        onClose();
        router.push(`/books/${bookSlug}/${articleSlug}/problems`);
    };

    const handleModalClose = () => {
        setIsLoading(false);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={handleModalClose} size="md" position="center">
            <Center minH={300} px={4} py={2}>
                {user ? (
                    // Logged in user - show start button
                    <Box textAlign="center">
                        <Box mb={4} color="brand.hitGray" fontSize="sm">
                            ログイン済みです。問題を開始しますか？
                        </Box>
                        <Button
                            w="100%"
                            color="white"
                            bg="brand.blue"
                            _hover={{
                                bg: 'brand.blue',
                                opacity: 0.9,
                            }}
                            onClick={handleLoggedInUserStart}
                            size="md"
                        >
                            問題を開始する
                        </Button>
                    </Box>
                ) : (
                    // Not logged in - show name input form
                    <NameInputForm
                        onSubmit={handleNameSubmit}
                        isLoading={isLoading}
                        handleModalClose={handleModalClose}
                    />
                )}
            </Center>
        </Modal>
    );
}
