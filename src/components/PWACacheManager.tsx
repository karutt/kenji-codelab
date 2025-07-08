'use client';

import { Box, Button, Heading, HStack, SimpleGrid, Stack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';
import { FiDownload, FiRefreshCw, FiTrash2, FiWifi, FiWifiOff } from 'react-icons/fi';

import { usePWAPreload } from '@/hooks/usePWAPreload';
import { clearCache } from '@/utils/cache/articleCache';

export const PWACacheManager = () => {
    const {
        progress,
        cacheStats,
        preloadAllBooks,
        preloadPages,
        preloadStaticAssets,
        cleanup,
        updateCacheStats,
        isOnline,
    } = usePWAPreload();

    const [isClearing, setIsClearing] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
        // シンプルなアラート表示（後でtoast実装に置き換え可能）
        alert(`${type.toUpperCase()}: ${message}`);
    };

    const handleClearCache = async () => {
        setIsClearing(true);
        try {
            await clearCache();
            await updateCacheStats();
            showToast('キャッシュをクリアしました', 'success');
        } catch (error) {
            showToast(
                `キャッシュのクリアに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'error',
            );
        } finally {
            setIsClearing(false);
        }
    };

    const handlePreloadAll = async () => {
        if (!isOnline) {
            showToast('オフライン状態です。オンライン時に再度お試しください', 'warning');
            return;
        }

        try {
            // すべてを順次プリロード
            showToast('全データのプリロードを開始します...', 'success');

            // 1. ページをプリロード（HTMLとチャンク）
            await preloadPages();

            // 2. 記事コンテンツをプリロード
            await preloadAllBooks();

            // 3. 静的アセットをプリロード
            await preloadStaticAssets();

            showToast(
                `全プリロードが完了しました: ${progress.completedArticles}/${progress.totalArticles} 記事がキャッシュされました`,
                'success',
            );
        } catch (error) {
            showToast(
                `プリロードに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'error',
            );
        }
    };

    const handlePreloadBooksOnly = async () => {
        if (!isOnline) {
            showToast('オフライン状態です。オンライン時に再度お試しください', 'warning');
            return;
        }

        try {
            await preloadAllBooks();
            showToast(
                `記事プリロードが完了しました: ${progress.completedArticles}/${progress.totalArticles} 記事がキャッシュされました`,
                'success',
            );
        } catch (error) {
            showToast(
                `記事プリロードに失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'error',
            );
        }
    };

    const handlePreloadPages = async () => {
        if (!isOnline) {
            showToast('オフライン状態です。オンライン時に再度お試しください', 'warning');
            return;
        }

        try {
            await preloadPages();
            showToast('ページのプリロードが完了しました', 'success');
        } catch (error) {
            showToast(
                `ページのプリロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
                'error',
            );
        }
    };

    const handlePreloadStatic = async () => {
        if (!isOnline) {
            showToast('オフライン状態です。オンライン時に再度お試しください', 'warning');
            return;
        }

        try {
            await preloadStaticAssets();
            showToast('静的アセットのプリロードが完了しました', 'success');
        } catch (error) {
            showToast(
                `静的アセットのプリロードに失敗しました: ${error instanceof Error ? error.message : '不明なエラー'}`,
                'error',
            );
        }
    };

    const handleCleanup = async () => {
        try {
            await cleanup();
            showToast('キャッシュの最適化が完了しました', 'success');
        } catch (error) {
            showToast(
                `キャッシュの最適化に失敗しました: ${error instanceof Error ? error.message : 'Unknown error'}`,
                'error',
            );
        }
    };

    const ProgressBar = ({ value, colorScheme }: { value: number; colorScheme: string }) => (
        <Box overflow="hidden" w="100%" h="8px" bg="gray.200" borderRadius="md">
            <Box
                w={`${Math.min(100, Math.max(0, value))}%`}
                h="100%"
                bg={colorScheme === 'blue' ? 'blue.500' : 'green.500'}
                transition="width 0.3s ease"
            />
        </Box>
    );

    return (
        <Box maxW="4xl" mx="auto" p={6}>
            <VStack align="stretch" gap={6}>
                {/* ヘッダー */}
                <Box>
                    <HStack align="center" justify="space-between">
                        <Heading size="lg">PWA キャッシュ管理</Heading>
                        <HStack>
                            <Box
                                px={3}
                                py={1}
                                color={isOnline ? 'green.800' : 'red.800'}
                                fontSize="sm"
                                bg={isOnline ? 'green.100' : 'red.100'}
                                borderRadius="md"
                            >
                                {isOnline ? <FiWifi /> : <FiWifiOff />}
                                <Text as="span" ml={1}>
                                    {isOnline ? 'オンライン' : 'オフライン'}
                                </Text>
                            </Box>
                            <Button onClick={updateCacheStats} size="sm" variant="outline">
                                <FiRefreshCw />
                                <Text ml={1}>更新</Text>
                            </Button>
                        </HStack>
                    </HStack>
                </Box>

                {/* 統計情報 */}
                <Box p={6} bg="white" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Heading mb={4} size="md">
                        キャッシュ統計
                    </Heading>
                    <SimpleGrid gap={4} columns={3}>
                        <Box textAlign="center">
                            <Text color="gray.600" fontSize="sm">
                                記事
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold">
                                {cacheStats.articles}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                キャッシュ済み
                            </Text>
                        </Box>
                        <Box textAlign="center">
                            <Text color="gray.600" fontSize="sm">
                                画像
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold">
                                {cacheStats.images}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                キャッシュ済み
                            </Text>
                        </Box>
                        <Box textAlign="center">
                            <Text color="gray.600" fontSize="sm">
                                書籍
                            </Text>
                            <Text fontSize="2xl" fontWeight="bold">
                                {cacheStats.books}
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                キャッシュ済み
                            </Text>
                        </Box>
                    </SimpleGrid>
                </Box>

                {/* プリロード進捗 */}
                {progress.isLoading && (
                    <Box p={6} bg="white" border="1px" borderColor="gray.200" borderRadius="lg">
                        <Heading mb={4} size="md">
                            プリロード進行中
                        </Heading>
                        <VStack align="stretch" gap={4}>
                            {progress.currentBook && (
                                <Text>
                                    現在の書籍: <strong>{progress.currentBook}</strong>
                                </Text>
                            )}

                            {progress.totalArticles > 0 && (
                                <Box>
                                    <Text mb={2}>
                                        進捗: {progress.completedArticles}/{progress.totalArticles}{' '}
                                        記事
                                    </Text>
                                    <ProgressBar
                                        value={
                                            (progress.completedArticles / progress.totalArticles) *
                                            100
                                        }
                                        colorScheme="blue"
                                    />
                                </Box>
                            )}

                            {progress.totalBooks > 0 && (
                                <Box>
                                    <Text mb={2}>
                                        書籍: {progress.completedBooks.length}/{progress.totalBooks}{' '}
                                        完了
                                    </Text>
                                    <ProgressBar
                                        value={
                                            (progress.completedBooks.length / progress.totalBooks) *
                                            100
                                        }
                                        colorScheme="green"
                                    />
                                </Box>
                            )}
                        </VStack>
                    </Box>
                )}

                {/* エラー表示 */}
                {progress.errors.length > 0 && (
                    <Box
                        p={4}
                        bg="orange.50"
                        border="1px"
                        borderColor="orange.200"
                        borderRadius="lg"
                    >
                        <Text mb={2} color="orange.800" fontWeight="bold">
                            プリロード中にエラーが発生しました
                        </Text>
                        <VStack align="start" gap={1}>
                            {progress.errors.map((error, index) => (
                                <Text key={index} color="orange.700" fontSize="sm">
                                    {error}
                                </Text>
                            ))}
                        </VStack>
                    </Box>
                )}

                {/* アクション */}
                <Box p={6} bg="white" border="1px" borderColor="gray.200" borderRadius="lg">
                    <Heading mb={4} size="md">
                        アクション
                    </Heading>
                    <Stack gap={4}>
                        <Button
                            w="full"
                            colorScheme="green"
                            size="lg"
                            disabled={!isOnline}
                            loading={progress.isLoading}
                            onClick={handlePreloadAll}
                        >
                            <FiDownload />
                            <Text ml={2}>
                                {progress.isLoading ? 'プリロード中...' : '全てをプリロード (推奨)'}
                            </Text>
                        </Button>

                        <Box h="1px" bg="gray.300" />

                        <Button
                            w="full"
                            colorScheme="blue"
                            disabled={!isOnline}
                            loading={progress.isLoading}
                            onClick={handlePreloadBooksOnly}
                        >
                            <FiDownload />
                            <Text ml={2}>
                                {progress.isLoading ? 'プリロード中...' : '記事コンテンツのみ'}
                            </Text>
                        </Button>

                        <Button
                            w="full"
                            colorScheme="purple"
                            disabled={!isOnline}
                            loading={progress.isLoading}
                            onClick={handlePreloadPages}
                        >
                            <FiDownload />
                            <Text ml={2}>
                                {progress.isLoading ? 'プリロード中...' : 'ページをプリロード'}
                            </Text>
                        </Button>

                        <Button
                            w="full"
                            colorScheme="blue"
                            disabled={!isOnline}
                            loading={progress.isLoading}
                            onClick={handlePreloadStatic}
                        >
                            <FiDownload />
                            <Text ml={2}>
                                {progress.isLoading
                                    ? 'プリロード中...'
                                    : '静的アセットをプリロード'}
                            </Text>
                        </Button>

                        <Box h="1px" bg="gray.200" />

                        <HStack gap={4}>
                            <Button flex={1} onClick={handleCleanup} size="sm" variant="outline">
                                <FiRefreshCw />
                                <Text ml={2}>キャッシュを最適化</Text>
                            </Button>

                            <Button
                                flex={1}
                                colorScheme="red"
                                loading={isClearing}
                                onClick={handleClearCache}
                                size="sm"
                                variant="outline"
                            >
                                <FiTrash2 />
                                <Text ml={2}>
                                    {isClearing ? '削除中...' : 'キャッシュをクリア'}
                                </Text>
                            </Button>
                        </HStack>
                    </Stack>
                </Box>

                {/* オフライン時の案内 */}
                {!isOnline && (
                    <Box p={4} bg="blue.50" border="1px" borderColor="blue.200" borderRadius="lg">
                        <Text mb={2} color="blue.800" fontWeight="bold">
                            オフライン状態です
                        </Text>
                        <Text color="blue.700">
                            プリロード機能はオンライン時のみ利用可能です。
                            キャッシュされた記事は引き続き閲覧できます。
                        </Text>
                    </Box>
                )}
            </VStack>
        </Box>
    );
};
