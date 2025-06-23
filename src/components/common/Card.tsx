import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface CardProps extends BoxProps {
    children: ReactNode;
}

export const Card = ({ children, ...props }: CardProps) => {
    return (
        <Box
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            transition="all 0.2s ease-in-out"
            {...props}
        >
            {children}
        </Box>
    );
};
