'use client';

import { Box, Button, HStack, Icon, Text, VStack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiCheck, FiDownload } from 'react-icons/fi';

import { toaster } from '@/components/ui/toaster';

interface InstallProgress {
    total: number;
    completed: number;
    currentItem: string;
    isInstalling: boolean;
    isComplete: boolean;
}

// 記事と書籍の型定義
interface Article {
    slug: string;
}

interface Book {
    slug: string;
    articles?: Article[];
}

export function OfflineInstallButton() {
    const [progress, setProgress] = useState<InstallProgress>({
        total: 0,
        completed: 0,
        currentItem: '',
        isInstalling: false,
        isComplete: false,
    });
    const [isInstalled, setIsInstalled] = useState(false);

    // インストール状況を確認
    useEffect(() => {
        checkInstallStatus();
    }, []);

    const checkInstallStatus = async () => {
        try {
            const status = localStorage.getItem('offline-articles-installed');
            setIsInstalled(status === 'true');
        } catch (error) {
            console.error('Failed to check install status:', error);
        }
    };

    // 全記事のURLを取得
    const getAllArticleUrls = async (): Promise<string[]> => {
        try {
            const response = await fetch('/api/articles');
            const articles: Book[] = await response.json();

            const urls: string[] = [];

            // 記事ページのURL
            articles.forEach((book: Book) => {
                book.articles?.forEach((article: Article) => {
                    urls.push(`/books/${book.slug}/${article.slug}`);
                    // 記事のMarkdownファイル
                    urls.push(`/books/${book.slug}/md/${article.slug}.md`);
                    // 記事の画像（推定）
                    for (let i = 1; i <= 10; i++) {
                        urls.push(`/books/${book.slug}/images/${article.slug}/${i}.png`);
                        urls.push(`/books/${book.slug}/images/${article.slug}/${i}.jpg`);
                    }
                });
                // 書籍一覧ページ
                urls.push(`/books/${book.slug}`);
            });

            // 重要なページ
            urls.push('/');
            urls.push('/books');
            urls.push('/cache');
            urls.push('/offline');

            return [...new Set(urls)]; // 重複除去
        } catch (error) {
            console.error('Failed to get article URLs:', error);
            return [];
        }
    };

    // Service Workerにキャッシュリクエストを送信
    const requestCacheUrls = async (urls: string[]) => {
        if ('serviceWorker' in navigator) {
            const registration = await navigator.serviceWorker.ready;
            registration.active?.postMessage({
                type: 'CACHE_URLS',
                payload: { urlsToCache: urls },
            });
        }
    };

    // プログレスバーコンポーネント
    const ProgressBar = ({ value }: { value: number }) => (
        <Box overflow="hidden" w="100%" h="8px" bg="gray.200" borderRadius="md">
            <Box
                w={`${Math.min(100, Math.max(0, value))}%`}
                h="100%"
                bg="blue.500"
                transition="width 0.3s ease"
            />
        </Box>
    );

    // オフラインインストール実行
    const startOfflineInstall = async () => {
        setProgress(prev => ({ ...prev, isInstalling: true, completed: 0 }));

        try {
            // 1. 全記事URLを取得
            setProgress(prev => ({ ...prev, currentItem: '記事リストを取得中...' }));
            const urls = await getAllArticleUrls();

            setProgress(prev => ({
                ...prev,
                total: urls.length,
                currentItem: `${urls.length}件のリソースを発見`,
            }));

            // 2. バッチでキャッシュ処理
            const batchSize = 10;
            let completed = 0;

            for (let i = 0; i < urls.length; i += batchSize) {
                const batch = urls.slice(i, i + batchSize);

                setProgress(prev => ({
                    ...prev,
                    currentItem: `${Math.min(i + batchSize, urls.length)}/${urls.length} 処理中...`,
                }));

                // 並列でフェッチしてキャッシュ
                await Promise.allSettled(
                    batch.map(async url => {
                        try {
                            const response = await fetch(url);
                            if (response.ok) {
                                completed++;
                                setProgress(prev => ({ ...prev, completed }));
                            }
                        } catch {
                            // 404等のエラーは無視
                        }
                    }),
                );

                // UI更新のための少し待つ
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // 3. Service Workerにもキャッシュ指示
            await requestCacheUrls(urls);

            // 4. 完了
            setProgress(prev => ({
                ...prev,
                isInstalling: false,
                isComplete: true,
                currentItem: 'インストール完了！',
            }));

            localStorage.setItem('offline-articles-installed', 'true');
            setIsInstalled(true);

            toaster.create({
                title: '📚 オフライン記事インストール完了',
                description: '全ての記事がオフラインで閲覧可能になりました！',
                type: 'success',
                duration: 5000,
            });
        } catch (error) {
            console.error('Install failed:', error);
            setProgress(prev => ({
                ...prev,
                isInstalling: false,
                currentItem: 'エラーが発生しました',
            }));

            toaster.create({
                title: 'インストールエラー',
                description: 'オフラインインストールに失敗しました。',
                type: 'error',
                duration: 5000,
            });
        }
    };

    const resetInstallStatus = () => {
        localStorage.removeItem('offline-articles-installed');
        setIsInstalled(false);
        setProgress({
            total: 0,
            completed: 0,
            currentItem: '',
            isInstalling: false,
            isComplete: false,
        });
    };

    if (isInstalled && !progress.isInstalling) {
        return (
            <VStack align="stretch" gap={3}>
                <HStack>
                    <Icon>
                        <FiCheck color="green" />
                    </Icon>
                    <Text color="green.500" fontWeight="bold">
                        オフライン記事インストール済み
                    </Text>
                </HStack>
                <Text color="gray.600" fontSize="sm">
                    全ての記事がオフラインで閲覧可能です
                </Text>
                <Button onClick={resetInstallStatus} size="sm" variant="outline">
                    再インストール
                </Button>
            </VStack>
        );
    }

    return (
        <VStack align="stretch" gap={4}>
            <Button
                colorScheme="blue"
                disabled={progress.isInstalling}
                loading={progress.isInstalling}
                onClick={startOfflineInstall}
                size="lg"
            >
                <Icon mr={2}>
                    <FiDownload />
                </Icon>
                📚 オフライン記事をインストール
            </Button>

            {progress.isInstalling && (
                <VStack align="stretch" gap={2}>
                    <ProgressBar
                        value={progress.total > 0 ? (progress.completed / progress.total) * 100 : 0}
                    />
                    <Text fontSize="sm" textAlign="center">
                        {progress.currentItem}
                    </Text>
                    <Text color="gray.500" fontSize="xs" textAlign="center">
                        {progress.completed} / {progress.total} 完了
                    </Text>
                </VStack>
            )}

            {progress.isComplete && (
                <Text color="green.500" fontSize="sm" fontWeight="bold" textAlign="center">
                    ✅ 全ての記事がオフラインで利用可能になりました！
                </Text>
            )}

            <Text color="gray.500" fontSize="xs">
                このボタンを押すと、全ての記事・画像をダウンロードしてオフラインで閲覧できるようになります。
            </Text>
        </VStack>
    );
}
