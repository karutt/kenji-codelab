'use client';

import { Box, Button, HStack, Portal, Text } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isIOS, setIsIOS] = useState(false);
    const [isStandalone, setIsStandalone] = useState(false);

    useEffect(() => {
        // iOS判定
        setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window));

        // スタンドアロン判定
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches);

        // beforeinstallprompt イベントリスナー
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (deferredPrompt) {
            await deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            setDeferredPrompt(null);
            setIsInstallable(false);
        }
    };

    if (isStandalone) {
        return null; // 既にインストール済み
    }

    return (
        <Portal>
            <Box pos="fixed" zIndex={999} right={0} bottom={0} w="40%" p={4}>
                {isInstallable && (
                    <HStack
                        align="center"
                        justify="space-between"
                        mb={4}
                        p={4}
                        bg="blue.50"
                        border="1px"
                        borderColor="blue.200"
                        borderRadius="md"
                    >
                        <Text fontWeight="bold">📱 アプリをホーム画面に追加できます</Text>
                        <Button px={4} colorScheme="blue" onClick={handleInstallClick} size="sm">
                            インストール
                        </Button>
                    </HStack>
                )}

                {isIOS && (
                    <Box p={4} bg="blue.50" border="1px" borderColor="blue.200" borderRadius="md">
                        <Text color="blue.800" fontSize="sm">
                            📱 iOSでこのアプリをインストールするには、Safari で
                            <Text as="span" fontWeight="bold">
                                {' '}
                                共有ボタン ⎋{' '}
                            </Text>
                            をタップして
                            <Text as="span" fontWeight="bold">
                                {' '}
                                「ホーム画面に追加」➕{' '}
                            </Text>
                            を選択してください。
                        </Text>
                    </Box>
                )}
            </Box>
        </Portal>
    );
}
