'use client';

import { Box, Flex, Text } from '@chakra-ui/react';

interface ReadOnlyFieldProps {
    label: string;
    value: string;
}

export default function ReadOnlyField({ label, value }: ReadOnlyFieldProps) {
    return (
        <Box>
            <Text color="brand.hitGray" fontSize="sm">
                {label}
            </Text>
            <Flex
                align="center"
                minH="40px"
                color="brand.shark"
                fontWeight="medium"
                borderColor="gray.200"
                borderRadius="md"
            >
                {value}
            </Flex>
        </Box>
    );
}
