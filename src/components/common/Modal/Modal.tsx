'use client';

import { CloseButton, Dialog } from '@chakra-ui/react';
import { ReactNode } from 'react';

export interface ModalProps {
    /**
     * Whether the modal is open
     */
    isOpen: boolean;
    /**
     * Function to call when the modal should be closed
     */
    onClose: () => void;
    /**
     * The content to display in the modal
     */
    children: ReactNode;
    /**
     * The position of the modal
     * @default "center"
     */
    position?: 'center' | 'top' | 'bottom';
    /**
     * Whether to show background overlay
     * @default true
     */
    hasBackground?: boolean;
    /**
     * The size of the modal
     * @default "md"
     */
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'cover';
    /**
     * Animation preset for the modal
     * @default "scale"
     */
    motionPreset?:
        | 'scale'
        | 'slide-in-bottom'
        | 'slide-in-top'
        | 'slide-in-left'
        | 'slide-in-right'
        | 'none';
    /**
     * Whether to show close button
     * @default true
     */
    showCloseButton?: boolean;
    /**
     * Title for the modal
     */
    title?: string;
    /**
     * Custom close button element
     */
    closeButton?: ReactNode;
}

/**
 * Modal component based on Chakra UI v3 Dialog
 *
 * Provides a modal dialog with customizable positioning, animations, and styling
 * that maintains the original project's design aesthetic.
 */
export function Modal({
    isOpen,
    onClose,
    children,
    position = 'center',
    hasBackground = true,
    size = 'md',
    motionPreset = 'scale',
    showCloseButton = true,
    title,
    closeButton,
}: ModalProps) {
    // Since Chakra UI Dialog doesn't support left/right positioning directly,
    // we'll use placement and custom styling for left/right positions
    const getPlacement = (): 'center' | 'top' | 'bottom' => {
        switch (position) {
            case 'top':
                return 'top';
            case 'bottom':
                return 'bottom';
            case 'center':
            default:
                return 'center';
        }
    };

    // Get motion preset based on position if not overridden
    const getMotionPreset = ():
        | 'scale'
        | 'slide-in-bottom'
        | 'slide-in-top'
        | 'slide-in-left'
        | 'slide-in-right'
        | 'none' => {
        // If motionPreset is explicitly set (not default), use it
        if (motionPreset !== 'scale') return motionPreset;

        // Auto-determine based on position
        switch (position) {
            case 'top':
                return 'slide-in-top';
            case 'bottom':
                return 'slide-in-bottom';
            case 'center':
            default:
                return 'scale';
        }
    };

    return (
        <Dialog.Root
            open={isOpen}
            onOpenChange={details => {
                if (!details.open) onClose();
            }}
            placement={getPlacement()}
            size={size}
            motionPreset={getMotionPreset()}
        >
            {hasBackground && <Dialog.Backdrop />}
            <Dialog.Positioner>
                <Dialog.Content
                    bg="white"
                    borderRadius="10px"
                    p={8}
                    textAlign="center"
                    boxShadow="0 20px 40px rgba(0, 0, 0, 0.1)"
                    border="1px solid"
                    borderColor="brand.black12"
                    // Prevent clicks inside modal from closing it
                    onClick={e => e.stopPropagation()}
                >
                    {/* Title Header */}
                    {title && (
                        <Dialog.Header p={0} mb={6}>
                            <Dialog.Title fontSize="2xl" fontWeight="semibold" color="brand.shark">
                                {title}
                            </Dialog.Title>
                        </Dialog.Header>
                    )}

                    {/* Main Content */}
                    <Dialog.Body p={0}>{children}</Dialog.Body>

                    {/* Close Button */}
                    {showCloseButton && (
                        <Dialog.CloseTrigger asChild>
                            {closeButton || (
                                <CloseButton
                                    pos="absolute"
                                    top="16px"
                                    right="16px"
                                    color="brand.hitGray"
                                    _hover={{
                                        color: 'brand.shark',
                                        bg: 'brand.black04',
                                    }}
                                    size="sm"
                                />
                            )}
                        </Dialog.CloseTrigger>
                    )}
                </Dialog.Content>
            </Dialog.Positioner>
        </Dialog.Root>
    );
}

export default Modal;
