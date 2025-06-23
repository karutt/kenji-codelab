'use client';

import { Box, Editable, HStack, IconButton, Text } from '@chakra-ui/react';
import { LuCheck, LuPencil, LuX } from 'react-icons/lu';

interface EditableFieldProps {
    label: string;
    value: string | null | undefined;
    placeholder: string;
    emptyText: string;
    onUpdate: (value: string) => void;
    isDisabled?: boolean;
    type?: 'text' | 'url';
}

export default function EditableField({
    label,
    value,
    placeholder,
    emptyText,
    onUpdate,
    isDisabled = false,
    type = 'text',
}: EditableFieldProps) {
    const handleValueCommit = (details: { value: string }) => {
        const trimmedValue = details.value.trim();
        const currentValue = value || '';

        // 値が変更されていない場合は何もしない
        if (trimmedValue === currentValue) {
            return;
        }

        onUpdate(trimmedValue);
    };

    const displayValue = value || emptyText;
    const textColor = value ? 'brand.shark' : 'gray.400';

    return (
        <Box>
            <Text mb={2} color="brand.hitGray" fontSize="sm">
                {label}
            </Text>
            <Editable.Root
                defaultValue={displayValue}
                onValueCommit={handleValueCommit}
                placeholder={placeholder}
                disabled={isDisabled}
            >
                <Editable.Preview
                    py={2}
                    px={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.200"
                    color={textColor}
                    fontSize="sm"
                    cursor="pointer"
                    _hover={{ borderColor: 'gray.300' }}
                    minH="40px"
                    display="flex"
                    alignItems="center"
                    maxW="md"
                    w="full"
                    whiteSpace={type === 'url' ? 'nowrap' : 'normal'}
                    overflow={type === 'url' ? 'hidden' : 'visible'}
                    textOverflow={type === 'url' ? 'ellipsis' : 'clip'}
                />
                <Editable.Input
                    py="9px"
                    px={3}
                    borderRadius="md"
                    border="1px solid"
                    borderColor="gray.300"
                    fontSize="sm"
                    maxW="md"
                    w="full"
                    fontWeight={type === 'text' ? 'medium' : 'normal'}
                    _focus={{
                        border: '1px solid',
                        borderColor: 'gray.300',
                        outline: 'none',
                    }}
                />
                <Editable.Control>
                    <HStack gap={2}>
                        <Editable.SubmitTrigger asChild>
                            <IconButton
                                w="36px"
                                bg="blackAlpha.800"
                                _hover={{ bg: 'blackAlpha.700' }}
                                size="sm"
                                variant="surface"
                            >
                                <LuCheck style={{ stroke: 'white' }} />
                            </IconButton>
                        </Editable.SubmitTrigger>
                        <Editable.CancelTrigger asChild>
                            <IconButton h="36px" size="sm" variant="outline">
                                <LuX />
                            </IconButton>
                        </Editable.CancelTrigger>
                    </HStack>
                </Editable.Control>
                <Editable.EditTrigger asChild>
                    <IconButton w="36px" h="36px" size="sm" variant="outline">
                        <LuPencil />
                    </IconButton>
                </Editable.EditTrigger>
            </Editable.Root>
        </Box>
    );
}
