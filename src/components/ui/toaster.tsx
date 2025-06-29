'use client';

import {
    Toaster as ChakraToaster,
    createToaster,
    Portal,
    Spinner,
    Stack,
    Toast,
} from '@chakra-ui/react';

export const toaster = createToaster({
    placement: 'bottom-end',
    pauseOnPageIdle: true,
    max: 3, // Limit number of visible toasts
});

export const Toaster = () => {
    return (
        <Portal>
            <ChakraToaster insetInline={{ mdDown: '4' }} toaster={toaster}>
                {toast => (
                    <Toast.Root width={{ md: 'sm' }} padding="4">
                        {toast.type === 'loading' ? (
                            <Spinner color="blue.solid" size="sm" />
                        ) : (
                            <Toast.Indicator />
                        )}
                        <Stack flex="1" gap="1" maxW="100%">
                            {toast.title && <Toast.Title>{toast.title}</Toast.Title>}
                            {toast.description && (
                                <Toast.Description>{toast.description}</Toast.Description>
                            )}
                        </Stack>
                        {toast.action && (
                            <Toast.ActionTrigger>{toast.action.label}</Toast.ActionTrigger>
                        )}
                        {toast.closable && <Toast.CloseTrigger />}
                    </Toast.Root>
                )}
            </ChakraToaster>
        </Portal>
    );
};
