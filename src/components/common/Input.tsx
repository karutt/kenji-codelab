import { Input as ChakraInput, InputProps } from '@chakra-ui/react';
import { forwardRef } from 'react';

export type CustomInputProps = InputProps;

export const Input = forwardRef<HTMLInputElement, CustomInputProps>((props, ref) => {
    return (
        <ChakraInput
            ref={ref}
            borderColor="brand.geyser"
            _hover={{
                borderColor: 'brand.blue',
            }}
            _focus={{
                borderColor: 'brand.blue',
                boxShadow: '0 0 0 1px var(--chakra-colors-brand-blue)',
            }}
            {...props}
        />
    );
});

Input.displayName = 'Input';
