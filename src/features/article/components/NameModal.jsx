"use client";

import { Box, Button, CloseButton, Dialog, Input, Portal } from "@chakra-ui/react";

export default function NameModal({ isOpen, name, onChange, onSave, onCancel }) {
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
                    <Dialog.Content p={6} width='100%'>
                        <Dialog.Header>
                            <Dialog.Title>
                                <Box fontSize={24} fontWeight='bold'>
                                    あなたの名前を入力
                                </Box>
                            </Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Box color='brand.abbey' fontSize={14} mb={6}>
                                「決定」を押すと名前が保存され、問題が開始されます。
                            </Box>
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
                                placeholder='名前を入力'
                            />
                        </Dialog.Body>
                        <Dialog.Footer display='flex' flexDirection='column' gap={2}>
                            <Button width='100%' bg='brand.blue' mt={4} mb={2} onClick={onSave}>
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
                        <Dialog.CloseTrigger asChild>
                            <CloseButton position='absolute' top='2' right='2' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}
