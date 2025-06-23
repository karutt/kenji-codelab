'use client';

import { Button, Input, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface NameInputFormProps {
    onSubmit: (name: string) => void;
    isLoading?: boolean;
    handleModalClose: () => void;
}

export default function NameInputForm({
    onSubmit,
    isLoading = false,
    handleModalClose,
}: NameInputFormProps) {
    const [name, setName] = useState('');

    // コンポーネントマウント時にlocalStorageから既存の名前を取得
    useEffect(() => {
        const savedName = localStorage.getItem('kenji_name');
        if (savedName) {
            setName(savedName);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim()) {
            onSubmit(name.trim());
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <VStack align="flex-start" gap={4} w="100%">
                <Text fontSize="2xl" fontWeight="bold">
                    問題にチャレンジ
                </Text>
                <Text color="gray.800" fontSize="sm">
                    Enterキーまたは「決定」を押すと、問題が開始されます。
                </Text>
                <Input
                    mb={2}
                    px={4}
                    fontSize="md"
                    bg="white"
                    border="1px solid"
                    borderColor="brand.black12"
                    _focus={{
                        borderColor: 'brand.blue',
                        boxShadow: '0 0 0 1px var(--chakra-colors-brand-blue)',
                    }}
                    onChange={e => setName(e.target.value)}
                    placeholder="お名前を入力"
                    required
                    size="md"
                    value={name}
                />
                <VStack gap={2} w="100%">
                    <Button
                        w="100%"
                        color="white"
                        bg="brand.blue"
                        _hover={{
                            bg: 'brand.blue',
                            opacity: 0.9,
                        }}
                        _disabled={{
                            opacity: 0.6,
                            cursor: 'not-allowed',
                        }}
                        disabled={!name.trim() || isLoading}
                        size="md"
                        type="submit"
                    >
                        {isLoading ? '開始中...' : '問題を開始する'}
                    </Button>
                    <Button
                        w="100%"
                        colorScheme="gray"
                        onClick={handleModalClose}
                        size="md"
                        variant="outline"
                    >
                        キャンセル
                    </Button>
                </VStack>
            </VStack>
        </form>
    );
}
