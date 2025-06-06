"use client";

import { Box, Button, CloseButton, Dialog, Input, Portal, Field } from "@chakra-ui/react";

export default function NameModal({ isOpen, name, onChange, onSave, onCancel, error }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSave();
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={(e) => {
                if (!e.open) onCancel();
            }}
            placement='center'
            motionPreset='slide-in-bottom'>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content p={6} width='100%' maxW='480px'>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Box fontSize={24} fontWeight='bold'>
                                    名前を入力してください
                                </Box>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Box as='form' onSubmit={handleSubmit}>
                            <Dialog.Body>
                                <Box color='brand.abbey' fontSize='sm' mb={4}>
                                    Enterキーまたは「決定」を押すと、問題が開始されます。
                                </Box>

                                <Field.Root invalid={!!error}>
                                    <Input
                                        type='text'
                                        fontSize='md'
                                        transition='0.1s'
                                        _focus={{
                                            boxShadow: "0 0 8px 3px rgba(0, 123, 255, 0.07)",
                                            outline: "none",
                                        }}
                                        value={name}
                                        onChange={(e) => onChange(e.target.value)}
                                        placeholder='名前'
                                    />
                                    {error && <Field.ErrorText>{error}</Field.ErrorText>}
                                </Field.Root>
                            </Dialog.Body>

                            <Dialog.Footer display='flex' flexDirection='column' gap={3}>
                                <Button
                                    type='submit'
                                    width='100%'
                                    bg='brand.blue'
                                    disabled={!name.trim()}>
                                    決定
                                </Button>

                                <Dialog.ActionTrigger asChild>
                                    <Button
                                        width='100%'
                                        variant='outline'
                                        colorScheme='gray'
                                        onClick={onCancel}>
                                        キャンセル
                                    </Button>
                                </Dialog.ActionTrigger>
                            </Dialog.Footer>
                        </Box>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton position='absolute' top='2' right='2' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
