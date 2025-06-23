'use client';

import { Box, Flex, Heading, HStack, Text, VStack } from '@chakra-ui/react';
import { useState } from 'react';

import { Breadcrumb } from '@/components/common/Breadcrumb';
import { Button, ToggleBtn } from '@/components/common/Button';
import { ArticleCard } from '@/components/common/Card/ArticleCard';
import { Card } from '@/components/common/Card/Card';
import { SideMenuCard } from '@/components/common/Card/SideMenuCard';
import { SideMenuHeadCard } from '@/components/common/Card/SideMenuHeadCard';
import { HeaderBox } from '@/components/common/HeaderBox';
import { MobileNavigation } from '@/components/common/MobileNavigation';
import { Modal } from '@/components/common/Modal';
import { Navigation } from '@/components/common/Navigation';
import { NeighborLinkCard } from '@/components/common/NeighborLinkCard';
import { AdminLayout, BookLayout, ChatLayout } from '@/components/layout';

export default function ComponentsDemoPage() {
    const [showToggle, setShowToggle] = useState(false);
    const [showSideMenu, setShowSideMenu] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTopModalOpen, setIsTopModalOpen] = useState(false);
    const [isBottomModalOpen, setIsBottomModalOpen] = useState(false);
    const [isFullModalOpen, setIsFullModalOpen] = useState(false);

    // Navigation demo states
    const [demoUser, setDemoUser] = useState<{
        id: string;
        email: string;
        name: string;
        displayName: string;
    } | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Layout demo states
    const [showBookLayoutDemo, setShowBookLayoutDemo] = useState(false);
    const [showChatLayoutDemo, setShowChatLayoutDemo] = useState(false);
    const [showAdminLayoutDemo, setShowAdminLayoutDemo] = useState(false);

    // Mock user for demo
    const mockUser = {
        id: '1',
        email: 'demo@example.com',
        name: 'デモユーザー',
        displayName: 'デモユーザー',
    };

    const handleLoginToggle = () => {
        setIsLoggedIn(!isLoggedIn);
        setDemoUser(isLoggedIn ? null : mockUser);
    };

    return (
        <Box minH="100vh" p={8} bg="brand.lilac">
            <VStack align="stretch" gap={12} maxW="1200px" mx="auto">
                {/* ページヘッダー */}
                <Box textAlign="center">
                    <Heading mb={4} color="brand.shark" size="2xl">
                        コンポーネントデモ
                    </Heading>
                    <Text color="brand.abbey" fontSize="lg">
                        Phase 3-4で実装したUIコンポーネントのデモンストレーション
                    </Text>
                </Box>

                {/* Card Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Card Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本Card */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Card - 各バリアント
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <Card variant="elevated">
                                    <Heading mb={2} size="md">
                                        Elevated Card
                                    </Heading>
                                    <Text>影付きのカードスタイル</Text>
                                </Card>
                                <Card variant="outline">
                                    <Heading mb={2} size="md">
                                        Outline Card
                                    </Heading>
                                    <Text>アウトライン付きのカードスタイル（デフォルト）</Text>
                                </Card>
                                <Card variant="subtle">
                                    <Heading mb={2} size="md">
                                        Subtle Card
                                    </Heading>
                                    <Text>控えめなカードスタイル</Text>
                                </Card>
                            </HStack>
                        </Box>

                        {/* カードサイズ */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Card - 各サイズ
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <Card size="sm">
                                    <Heading mb={2} size="sm">
                                        Small Card
                                    </Heading>
                                    <Text fontSize="sm">小さなパディングのカード</Text>
                                </Card>
                                <Card size="md">
                                    <Heading mb={2} size="md">
                                        Medium Card
                                    </Heading>
                                    <Text>標準的なパディングのカード（デフォルト）</Text>
                                </Card>
                                <Card size="lg">
                                    <Heading mb={2} size="lg">
                                        Large Card
                                    </Heading>
                                    <Text>大きなパディングのカード</Text>
                                </Card>
                            </HStack>
                        </Box>

                        {/* ArticleCard */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                ArticleCard - 記事表示用
                            </Text>
                            <ArticleCard>
                                <Box p={8}>
                                    <Heading mb={4} color="brand.shark" size="xl">
                                        記事タイトルの例
                                    </Heading>
                                    <Text mb={4} color="brand.abbey">
                                        最終更新: 2024-12-19
                                    </Text>
                                    <Text lineHeight="1.7">
                                        これは記事表示用のArticleCardコンポーネントのデモです。
                                        最大幅が860pxに設定されており、記事コンテンツの表示に最適化されています。
                                    </Text>
                                </Box>
                            </ArticleCard>
                        </Box>
                    </VStack>
                </Box>

                {/* Button Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Button Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本Button */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Button - 各バリアント
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <Button variant="solid">Solid Button</Button>
                                <Button variant="outline">Outline Button</Button>
                                <Button variant="ghost">Ghost Button</Button>
                                <Button variant="subtle">Subtle Button</Button>
                            </HStack>
                        </Box>

                        {/* ボタンサイズ */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Button - 各サイズ
                            </Text>
                            <HStack align="center" flexWrap="wrap" gap={4}>
                                <Button size="xs">Extra Small</Button>
                                <Button size="sm">Small</Button>
                                <Button size="md">Medium</Button>
                                <Button size="lg">Large</Button>
                            </HStack>
                        </Box>

                        {/* ToggleBtn */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                ToggleBtn - トグルボタン
                            </Text>
                            <Box
                                pos="relative"
                                h="200px"
                                bg="white"
                                border="1px solid"
                                borderColor="brand.black12"
                                borderRadius="md"
                            >
                                <Text p={4} color="brand.abbey">
                                    ToggleBtnのデモ領域（右下に固定表示）
                                </Text>
                                <ToggleBtn
                                    toggle={showToggle}
                                    onClick={() => setShowToggle(!showToggle)}
                                    position="absolute"
                                    bottom="20px"
                                    right="20px"
                                />
                            </Box>
                            <Text mt={2} color="brand.hitGray" fontSize="sm">
                                現在の状態: {showToggle ? 'アクティブ' : '非アクティブ'}
                            </Text>
                        </Box>
                    </VStack>
                </Box>

                {/* Navigation Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Navigation Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本Navigation */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Navigation - デフォルトスタイル
                            </Text>
                            <Box
                                p={6}
                                bg="white"
                                border="1px solid"
                                borderColor="brand.black12"
                                borderRadius="md"
                            >
                                <Navigation user={demoUser} variant="default" />
                            </Box>
                        </Box>

                        {/* コンパクトNavigation */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Navigation - コンパクトスタイル（ヘッダー用）
                            </Text>
                            <Box p={6} color="white" bg="brand.blue" borderRadius="md">
                                <Navigation user={demoUser} variant="compact" />
                            </Box>
                        </Box>

                        {/* MobileNavigation */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Mobile Navigation - ハンバーガーメニュー
                            </Text>
                            <Flex
                                justify="flex-end"
                                p={6}
                                bg="white"
                                border="1px solid"
                                borderColor="brand.black12"
                                borderRadius="md"
                            >
                                <MobileNavigation user={demoUser} />
                            </Flex>
                            <Text mt={2} color="brand.hitGray" fontSize="sm">
                                ハンバーガーアイコンをクリックしてドロワーメニューを表示
                            </Text>
                        </Box>

                        {/* ログイン状態切り替え */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                ユーザー状態デモ
                            </Text>
                            <HStack gap={4} mb={4}>
                                <Button
                                    variant={isLoggedIn ? 'solid' : 'outline'}
                                    onClick={handleLoginToggle}
                                >
                                    {isLoggedIn ? 'ログアウト' : 'ログイン'}
                                </Button>
                                <Text color="brand.abbey" fontSize="sm">
                                    現在の状態: {isLoggedIn ? 'ログイン中' : '未ログイン'}
                                    {isLoggedIn && ' (チャットリンクが表示されます)'}
                                </Text>
                            </HStack>
                        </Box>

                        {/* Navigation機能説明 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Navigation Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• デフォルトとコンパクトの2つのスタイル</Text>
                                <Text>• アクティブページのハイライト表示</Text>
                                <Text>• ユーザー認証状態に応じた項目表示制御</Text>
                                <Text>• ホバーエフェクトとアニメーション</Text>
                                <Text>• Next.js Link コンポーネント統合</Text>
                                <Text>• モバイル用ドロワーメニュー</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* HeaderBox Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        HeaderBox Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本HeaderBox */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本HeaderBox - 各バリアント
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <HeaderBox variant="default">Default HeaderBox</HeaderBox>
                                <HeaderBox variant="accent">Accent HeaderBox</HeaderBox>
                                <HeaderBox variant="minimal">Minimal HeaderBox</HeaderBox>
                            </HStack>
                        </Box>

                        {/* アクティブ状態 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                HeaderBox - アクティブ状態
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <HeaderBox variant="default" active={true}>
                                    Active Default
                                </HeaderBox>
                                <HeaderBox variant="accent" active={true}>
                                    Active Accent
                                </HeaderBox>
                                <HeaderBox variant="minimal" active={true}>
                                    Active Minimal
                                </HeaderBox>
                            </HStack>
                        </Box>

                        {/* ホバーなし */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                HeaderBox - ホバーエフェクトなし
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <HeaderBox variant="default" hover={false}>
                                    No Hover Default
                                </HeaderBox>
                                <HeaderBox variant="accent" hover={false}>
                                    No Hover Accent
                                </HeaderBox>
                            </HStack>
                        </Box>

                        {/* HeaderBox機能説明 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                HeaderBox Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• 3つのバリアント（default, accent, minimal）</Text>
                                <Text>• アクティブ状態の表示</Text>
                                <Text>• ホバーエフェクトのON/OFF切り替え</Text>
                                <Text>• ダークモード対応</Text>
                                <Text>• カスタムプロップス対応</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Layout Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Layout Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* BookLayout Preview */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                BookLayout - 書籍表示用レイアウト
                            </Text>
                            <Box
                                overflow="hidden"
                                bg="white"
                                border="2px solid"
                                borderColor="brand.black12"
                                borderRadius="lg"
                            >
                                <Box
                                    p={4}
                                    bg="gray.100"
                                    borderColor="gray.200"
                                    borderBottom="1px solid"
                                >
                                    <Text fontSize="sm" fontWeight="semibold">
                                        BookLayout Preview
                                    </Text>
                                </Box>
                                <Box pos="relative" overflow="hidden" h="300px">
                                    <BookLayout
                                        bookTitle="P5.js チュートリアル"
                                        currentChapter="第1章 - 基本図形を描いてみよう"
                                        breadcrumbItems={[
                                            { label: 'Home', href: '/' },
                                            { label: 'Books', href: '/books' },
                                            { label: 'P5.js Tutorial', href: '/books/p5_tutorial' },
                                            { label: '基本図形を描いてみよう', isCurrent: true },
                                        ]}
                                        sidebarContent={
                                            <SideMenuCard>
                                                <VStack align="stretch" gap={2} p={4}>
                                                    <Text mb={2} fontWeight="semibold">
                                                        目次
                                                    </Text>
                                                    <Text color="blue.600" fontSize="sm">
                                                        • 第1章 基本図形
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        • 第2章 色と塗りつぶし
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        • 第3章 アニメーション
                                                    </Text>
                                                </VStack>
                                            </SideMenuCard>
                                        }
                                        previousArticle={{
                                            title: 'P5.jsとは？',
                                            href: '/demo',
                                        }}
                                        nextArticle={{
                                            title: '色と塗りつぶし',
                                            href: '/demo',
                                        }}
                                    >
                                        <ArticleCard>
                                            <Box p={6}>
                                                <Text>ここに記事の内容が表示されます...</Text>
                                            </Box>
                                        </ArticleCard>
                                    </BookLayout>
                                </Box>
                            </Box>
                            <HStack gap={4} mt={4}>
                                <Button
                                    size="sm"
                                    variant={showBookLayoutDemo ? 'solid' : 'outline'}
                                    onClick={() => setShowBookLayoutDemo(!showBookLayoutDemo)}
                                >
                                    {showBookLayoutDemo ? 'デモを閉じる' : 'フルサイズデモを表示'}
                                </Button>
                            </HStack>
                        </Box>

                        {/* ChatLayout Preview */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                ChatLayout - チャット画面用レイアウト
                            </Text>
                            <Box
                                overflow="hidden"
                                bg="white"
                                border="2px solid"
                                borderColor="brand.black12"
                                borderRadius="lg"
                            >
                                <Box
                                    p={4}
                                    bg="gray.100"
                                    borderColor="gray.200"
                                    borderBottom="1px solid"
                                >
                                    <Text fontSize="sm" fontWeight="semibold">
                                        ChatLayout Preview
                                    </Text>
                                </Box>
                                <Box overflow="hidden" h="300px">
                                    <ChatLayout
                                        chatTitle="プログラミング相談チャット"
                                        showUserList={true}
                                        userListContent={
                                            <VStack align="stretch" gap={2}>
                                                <Text fontSize="sm">👨‍💻 KeNJi</Text>
                                                <Text fontSize="sm">👩‍💻 ユーザー1</Text>
                                                <Text fontSize="sm">👨‍🎓 ユーザー2</Text>
                                            </VStack>
                                        }
                                    >
                                        <VStack align="stretch" gap={4}>
                                            <Box maxW="80%" p={4} bg="white" borderRadius="lg">
                                                <Text fontSize="sm">
                                                    こんにちは！何かお困りのことはありますか？
                                                </Text>
                                            </Box>
                                            <Box
                                                alignSelf="flex-end"
                                                maxW="80%"
                                                p={4}
                                                bg="blue.100"
                                                borderRadius="lg"
                                            >
                                                <Text fontSize="sm">
                                                    P5.jsで円を描く方法を教えてください
                                                </Text>
                                            </Box>
                                        </VStack>
                                    </ChatLayout>
                                </Box>
                            </Box>
                            <Button
                                size="sm"
                                variant="outline"
                                mt={4}
                                onClick={() => setShowChatLayoutDemo(!showChatLayoutDemo)}
                            >
                                {showChatLayoutDemo ? 'デモを閉じる' : 'フルサイズデモを表示'}
                            </Button>
                        </Box>

                        {/* AdminLayout Preview */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                AdminLayout - 管理画面用レイアウト
                            </Text>
                            <Box
                                overflow="hidden"
                                bg="white"
                                border="2px solid"
                                borderColor="brand.black12"
                                borderRadius="lg"
                            >
                                <Box
                                    p={4}
                                    bg="gray.100"
                                    borderColor="gray.200"
                                    borderBottom="1px solid"
                                >
                                    <Text fontSize="sm" fontWeight="semibold">
                                        AdminLayout Preview
                                    </Text>
                                </Box>
                                <Box overflow="hidden" h="300px">
                                    <AdminLayout
                                        pageTitle="ダッシュボード"
                                        pageDescription="サイトの統計情報と管理機能"
                                    >
                                        <VStack align="stretch" gap={6}>
                                            <HStack gap={4}>
                                                <Card flex="1">
                                                    <Text mb={2} fontWeight="semibold">
                                                        総記事数
                                                    </Text>
                                                    <Text color="blue.600" fontSize="2xl">
                                                        42
                                                    </Text>
                                                </Card>
                                                <Card flex="1">
                                                    <Text mb={2} fontWeight="semibold">
                                                        総ユーザー数
                                                    </Text>
                                                    <Text color="green.600" fontSize="2xl">
                                                        1,234
                                                    </Text>
                                                </Card>
                                            </HStack>
                                            <Card>
                                                <Text mb={4} fontWeight="semibold">
                                                    最近の活動
                                                </Text>
                                                <VStack align="stretch" gap={2}>
                                                    <Text fontSize="sm">
                                                        • 新しい記事が投稿されました
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        • ユーザー登録がありました
                                                    </Text>
                                                    <Text fontSize="sm">
                                                        • コメントが投稿されました
                                                    </Text>
                                                </VStack>
                                            </Card>
                                        </VStack>
                                    </AdminLayout>
                                </Box>
                            </Box>
                            <Button
                                size="sm"
                                variant="outline"
                                mt={4}
                                onClick={() => setShowAdminLayoutDemo(!showAdminLayoutDemo)}
                            >
                                {showAdminLayoutDemo ? 'デモを閉じる' : 'フルサイズデモを表示'}
                            </Button>
                        </Box>

                        {/* Layout Features */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Layout System Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• BookLayout: 書籍・記事表示に最適化されたレイアウト</Text>
                                <Text>• ChatLayout: チャット機能用のフルスクリーンレイアウト</Text>
                                <Text>• AdminLayout: 管理画面用のサイドバー付きレイアウト</Text>
                                <Text>• 完全なレスポンシブ対応</Text>
                                <Text>• Sticky サイドバー対応</Text>
                                <Text>• ナビゲーション統合</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Modal Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Modal Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本Modal */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Modal - 各ポジション
                            </Text>
                            <HStack flexWrap="wrap" gap={4}>
                                <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                                    Center Modal
                                </Button>
                                <Button variant="outline" onClick={() => setIsTopModalOpen(true)}>
                                    Top Modal
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setIsBottomModalOpen(true)}
                                >
                                    Bottom Modal
                                </Button>
                                <Button variant="outline" onClick={() => setIsFullModalOpen(true)}>
                                    Full Screen Modal
                                </Button>
                            </HStack>
                        </Box>

                        {/* Modalの実装例 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Modal Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• 複数のポジション対応（center, top, bottom）</Text>
                                <Text>• アニメーション付きで表示・非表示</Text>
                                <Text>• 背景オーバーレイ対応</Text>
                                <Text>• ESCキーとクローズボタンで閉じる</Text>
                                <Text>• クリック外しで閉じる</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Breadcrumb Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Breadcrumb Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本Breadcrumb */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本Breadcrumb - モダンスタイル
                            </Text>
                            <VStack align="stretch" gap={4}>
                                <Breadcrumb
                                    items={[
                                        { label: 'Home', href: '/' },
                                        { label: 'Books', href: '/books' },
                                        { label: 'P5 Tutorial', href: '/books/p5_tutorial' },
                                        { label: 'Chapter 1', isCurrent: true },
                                    ]}
                                />

                                <Breadcrumb
                                    size="lg"
                                    separator=">"
                                    items={[
                                        { label: 'ドキュメント', href: '#' },
                                        { label: 'コンポーネント', href: '#' },
                                        { label: 'Breadcrumb', isCurrent: true },
                                    ]}
                                />
                            </VStack>
                        </Box>

                        {/* 元のスタイル */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Styled Breadcrumb - 元のデザインスタイル
                            </Text>
                            <VStack align="stretch" gap={4}>
                                <Breadcrumb styled={true} bookName="P5 Tutorial" chapter="1-1" />

                                <Breadcrumb
                                    styled={true}
                                    bookName="Python Tutorial"
                                    chapter="2-3"
                                />
                            </VStack>
                        </Box>

                        {/* Breadcrumbの機能説明 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                Breadcrumb Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• モダンスタイルと元のデザインスタイル両対応</Text>
                                <Text>• カスタム区切り文字対応</Text>
                                <Text>• 3つのサイズ（sm, md, lg）</Text>
                                <Text>• Next.js Link コンポーネント統合</Text>
                                <Text>• 現在のページ表示機能</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* NeighborLinkCard Components */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        NeighborLinkCard Components
                    </Heading>
                    <VStack align="stretch" gap={8}>
                        {/* 基本NeighborLinkCard */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                基本NeighborLinkCard - 前後記事ナビゲーション
                            </Text>
                            <HStack justify="center" flexWrap="wrap" gap={4}>
                                <NeighborLinkCard
                                    link="/books/p5_tutorial/1-0"
                                    title="P5.jsとは？プログラミング初心者のための入門ガイド"
                                    next={false}
                                />
                                <NeighborLinkCard
                                    link="/books/p5_tutorial/2-0"
                                    title="基本図形を描いてみよう - 円、四角、三角形"
                                    next={true}
                                />
                            </HStack>
                        </Box>

                        {/* カスタマイズ例 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                カスタマイズ例
                            </Text>
                            <VStack align="stretch" gap={4}>
                                <HStack justify="center" flexWrap="wrap" gap={4}>
                                    <NeighborLinkCard
                                        link="#"
                                        title="カスタムラベル付きリンク"
                                        label="前の章"
                                        arrow="◀"
                                        next={false}
                                    />
                                    <NeighborLinkCard
                                        link="#"
                                        title="アイコンなしバージョン"
                                        showArrow={false}
                                        next={true}
                                    />
                                </HStack>

                                {/* 記事風レイアウトでの使用例 */}
                                <Box>
                                    <Text
                                        mb={4}
                                        color="brand.shark"
                                        fontSize="sm"
                                        fontWeight="semibold"
                                    >
                                        記事内での使用例：
                                    </Text>
                                    <ArticleCard>
                                        <Box p={8}>
                                            <Heading mb={4} size="md">
                                                記事のサンプル
                                            </Heading>
                                            <Text mb={8} color="brand.abbey">
                                                ここに記事の内容が表示されます。読み終わった後、
                                                下のリンクから前後の記事に移動できます。
                                            </Text>

                                            {/* 前後記事ナビゲーション */}
                                            <HStack flexWrap="wrap" gap={4} mt={8}>
                                                <NeighborLinkCard
                                                    link="/demo"
                                                    title="前の記事タイトルの例です"
                                                    next={false}
                                                />
                                                <NeighborLinkCard
                                                    link="/demo"
                                                    title="次の記事タイトルの例です"
                                                    next={true}
                                                />
                                            </HStack>
                                        </Box>
                                    </ArticleCard>
                                </Box>
                            </VStack>
                        </Box>

                        {/* NeighborLinkCardの機能説明 */}
                        <Box>
                            <Text mb={4} color="brand.shark" fontWeight="semibold">
                                NeighborLinkCard Features
                            </Text>
                            <VStack align="stretch" gap={2} color="brand.abbey" fontSize="sm">
                                <Text>• 前・次記事へのナビゲーション</Text>
                                <Text>• 方向に応じたレイアウト自動調整</Text>
                                <Text>• ホバーエフェクトとアニメーション</Text>
                                <Text>• カスタムラベルとアイコン対応</Text>
                                <Text>• レスポンシブデザイン</Text>
                                <Text>• Next.js Link コンポーネント統合</Text>
                                <Text>• TypeScript完全対応</Text>
                            </VStack>
                        </Box>
                    </VStack>
                </Box>

                {/* Layout Demo */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        レイアウトデモ
                    </Heading>
                    <HStack align="flex-start" flexWrap={['wrap', 'nowrap']} gap={6}>
                        {/* メインコンテンツエリア */}
                        <Box flex="1" minW="300px">
                            <ArticleCard>
                                <Box p={8}>
                                    <Heading mb={4} size="lg">
                                        メインコンテンツ
                                    </Heading>
                                    <Text mb={4} lineHeight="1.7">
                                        これはメインコンテンツエリアのデモです。
                                        記事や主要な情報が表示される領域として使用されます。
                                    </Text>
                                    <HStack gap={4}>
                                        <Button>アクション 1</Button>
                                        <Button variant="outline">アクション 2</Button>
                                    </HStack>
                                </Box>
                            </ArticleCard>
                        </Box>

                        {/* サイドメニューエリア（条件付き表示） */}
                        {showSideMenu && (
                            <Box flexShrink={0} w={['full', '300px']}>
                                <SideMenuHeadCard>
                                    <Box p={4}>
                                        <Heading color="brand.shark" size="md">
                                            サイドメニューヘッダー
                                        </Heading>
                                    </Box>
                                </SideMenuHeadCard>
                                <SideMenuCard sticky={false} h="300px">
                                    <Box p={4}>
                                        <Text mb={4} fontWeight="semibold">
                                            サイドメニューコンテンツ
                                        </Text>
                                        <VStack align="stretch" gap={2}>
                                            <Text fontSize="sm">• メニュー項目 1</Text>
                                            <Text fontSize="sm">• メニュー項目 2</Text>
                                            <Text fontSize="sm">• メニュー項目 3</Text>
                                            <Text fontSize="sm">• メニュー項目 4</Text>
                                        </VStack>
                                    </Box>
                                </SideMenuCard>
                            </Box>
                        )}
                    </HStack>

                    {/* サイドメニュー表示切り替え */}
                    <Box mt={4}>
                        <Button
                            variant="outline"
                            onClick={() => setShowSideMenu(!showSideMenu)}
                            size="sm"
                        >
                            {showSideMenu ? 'サイドメニューを隠す' : 'サイドメニューを表示'}
                        </Button>
                    </Box>
                </Box>

                {/* 実装状況 */}
                <Box>
                    <Heading mb={6} color="brand.shark" size="lg">
                        Phase 3-5 実装状況
                    </Heading>
                    <Card>
                        <VStack align="stretch" gap={4}>
                            <Box>
                                <Text mb={2} color="green.600" fontWeight="semibold">
                                    ✅ Phase 3 完了済み（Card Component System & UI Foundation）
                                </Text>
                                <VStack align="stretch" gap={1} fontSize="sm">
                                    <Text>• 基本Card（3バリアント、3サイズ）</Text>
                                    <Text>• ArticleCard（記事表示用）</Text>
                                    <Text>• SideMenuCard（スクロール対応）</Text>
                                    <Text>• SideMenuHeadCard</Text>
                                    <Text>• 基本Button（4バリアント、4サイズ）</Text>
                                    <Text>• ToggleBtn（トグル機能付き）</Text>
                                    <Text>• Modal（ダイアログコンポーネント）</Text>
                                    <Text>• Breadcrumb（パンくずナビゲーション）</Text>
                                    <Text>• NeighborLinkCard（前後記事ナビゲーション）</Text>
                                </VStack>
                            </Box>
                            <Box>
                                <Text mb={2} color="green.600" fontWeight="semibold">
                                    ✅ Phase 4 完了済み（Navigation System Implementation）
                                </Text>
                                <VStack align="stretch" gap={1} fontSize="sm">
                                    <Text>• Navigation（デフォルト・コンパクトスタイル）</Text>
                                    <Text>• HeaderBox（ナビゲーション項目スタイリング）</Text>
                                    <Text>• MobileNavigation（ハンバーガーメニュー）</Text>
                                    <Text>• 認証状態対応ナビゲーション</Text>
                                    <Text>• Header コンポーネント統合</Text>
                                    <Text>• レスポンシブデザイン完全対応</Text>
                                </VStack>
                            </Box>
                            <Box>
                                <Text mb={2} color="green.600" fontWeight="semibold">
                                    ✅ Phase 5 完了済み（Specialized Layouts & Content System）
                                </Text>
                                <VStack align="stretch" gap={1} fontSize="sm">
                                    <Text>• BookLayout（書籍・記事表示用レイアウト）</Text>
                                    <Text>• ChatLayout（チャット画面用レイアウト）</Text>
                                    <Text>• AdminLayout（管理画面用レイアウト）</Text>
                                    <Text>• 書籍メタデータ管理システム</Text>
                                    <Text>• ナビゲーション生成ユーティリティ</Text>
                                    <Text>• Sticky サイドバー対応</Text>
                                </VStack>
                            </Box>
                            <Box>
                                <Text mb={2} color="gray.600" fontWeight="semibold">
                                    🔧 技術仕様
                                </Text>
                                <VStack align="stretch" gap={1} fontSize="sm">
                                    <Text>• TypeScript完全対応</Text>
                                    <Text>• Chakra UI v3 対応</Text>
                                    <Text>• Next.js 15 App Router 対応</Text>
                                    <Text>• レスポンシブデザイン対応</Text>
                                    <Text>• アクセシビリティ対応</Text>
                                    <Text>• ダークモード対応</Text>
                                </VStack>
                            </Box>
                            <Box>
                                <Text mb={2} color="blue.600" fontWeight="semibold">
                                    🚧 次のステップ（Phase 6）
                                </Text>
                                <VStack align="stretch" gap={1} fontSize="sm">
                                    <Text>
                                        • メインページ実装（Home、Books listing、Individual
                                        book、Article）
                                    </Text>
                                    <Text>• マークダウン処理システム</Text>
                                    <Text>• SEO最適化</Text>
                                    <Text>• パフォーマンス最適化</Text>
                                </VStack>
                            </Box>
                        </VStack>
                    </Card>
                </Box>
            </VStack>

            {/* Modal Components */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Center Modal"
                position="center"
            >
                <VStack gap={4}>
                    <Text>これは中央表示のモーダルです。</Text>
                    <Text color="brand.abbey" fontSize="sm">
                        ESCキー、クローズボタン、または背景をクリックして閉じることができます。
                    </Text>
                    <Button onClick={() => setIsModalOpen(false)}>閉じる</Button>
                </VStack>
            </Modal>

            <Modal
                isOpen={isTopModalOpen}
                onClose={() => setIsTopModalOpen(false)}
                title="Top Modal"
                position="top"
                size="sm"
            >
                <VStack gap={4}>
                    <Text>これは上部表示のモーダルです。</Text>
                    <Text color="brand.abbey" fontSize="sm">
                        上からスライドインするアニメーション付きです。
                    </Text>
                    <Button onClick={() => setIsTopModalOpen(false)} size="sm">
                        閉じる
                    </Button>
                </VStack>
            </Modal>

            <Modal
                isOpen={isBottomModalOpen}
                onClose={() => setIsBottomModalOpen(false)}
                title="Bottom Modal"
                position="bottom"
                size="sm"
            >
                <VStack gap={4}>
                    <Text>これは下部表示のモーダルです。</Text>
                    <Text color="brand.abbey" fontSize="sm">
                        下からスライドインするアニメーション付きです。
                    </Text>
                    <Button onClick={() => setIsBottomModalOpen(false)} size="sm">
                        閉じる
                    </Button>
                </VStack>
            </Modal>

            <Modal
                isOpen={isFullModalOpen}
                onClose={() => setIsFullModalOpen(false)}
                title="Full Screen Modal"
                size="full"
                showCloseButton={true}
            >
                <VStack justify="center" gap={6} h="full">
                    <Heading color="brand.shark" size="xl">
                        フルスクリーンモーダル
                    </Heading>
                    <Text maxW="600px" color="brand.abbey" fontSize="lg" textAlign="center">
                        これは画面全体を覆うフルスクリーンモーダルです。
                        大きなコンテンツや重要な情報を表示する際に使用します。
                    </Text>
                    <HStack gap={4}>
                        <Button onClick={() => setIsFullModalOpen(false)}>閉じる</Button>
                        <Button variant="outline">別のアクション</Button>
                    </HStack>
                </VStack>
            </Modal>

            {/* Layout Demo Modals */}
            <Modal
                isOpen={showBookLayoutDemo}
                onClose={() => setShowBookLayoutDemo(false)}
                title="BookLayout フルサイズデモ"
                size="full"
                showCloseButton={true}
            >
                <BookLayout
                    bookTitle="P5.js チュートリアル"
                    currentChapter="第1章 - 基本図形を描いてみよう"
                    breadcrumbItems={[
                        { label: 'Home', href: '/' },
                        { label: 'Books', href: '/books' },
                        { label: 'P5.js Tutorial', href: '/books/p5_tutorial' },
                        { label: '基本図形を描いてみよう', isCurrent: true },
                    ]}
                    sidebarContent={
                        <VStack align="stretch" gap={4}>
                            <SideMenuHeadCard>
                                <Box p={4}>
                                    <Text fontWeight="semibold">目次</Text>
                                </Box>
                            </SideMenuHeadCard>
                            <SideMenuCard>
                                <VStack align="stretch" gap={3} p={4}>
                                    <Text color="blue.600" fontSize="sm" fontWeight="semibold">
                                        • 第1章 基本図形を描いてみよう
                                    </Text>
                                    <Text fontSize="sm">• 第2章 色と塗りつぶし</Text>
                                    <Text fontSize="sm">• 第3章 アニメーション</Text>
                                    <Text fontSize="sm">• 第4章 インタラクション</Text>
                                    <Text fontSize="sm">• 第5章 応用プロジェクト</Text>
                                </VStack>
                            </SideMenuCard>
                        </VStack>
                    }
                    previousArticle={{
                        title: 'P5.jsとは？プログラミング初心者のための入門ガイド',
                        href: '/demo',
                    }}
                    nextArticle={{
                        title: '色と塗りつぶし - 美しいビジュアルを作ろう',
                        href: '/demo',
                    }}
                >
                    <ArticleCard>
                        <Box p={8}>
                            <Heading mb={6} size="xl">
                                基本図形を描いてみよう
                            </Heading>
                            <Text mb={6} lineHeight="1.7">
                                P5.jsでは、様々な基本図形を簡単に描くことができます。
                                この章では、円、四角形、三角形などの基本的な図形の描画方法を学びます。
                            </Text>

                            <Heading mb={4} size="lg">
                                円の描画
                            </Heading>
                            <Text mb={4} lineHeight="1.7">
                                円を描くには `circle()` 関数を使用します。
                            </Text>

                            <Box mb={6} p={4} bg="gray.100" borderRadius="md">
                                <Text fontFamily="mono" fontSize="sm">
                                    circle(x, y, diameter);
                                </Text>
                            </Box>

                            <Heading mb={4} size="lg">
                                四角形の描画
                            </Heading>
                            <Text mb={4} lineHeight="1.7">
                                四角形を描くには `rect()` 関数を使用します。
                            </Text>

                            <Box mb={6} p={4} bg="gray.100" borderRadius="md">
                                <Text fontFamily="mono" fontSize="sm">
                                    rect(x, y, width, height);
                                </Text>
                            </Box>

                            <Text lineHeight="1.7">
                                これらの基本図形を組み合わせることで、
                                より複雑で美しいビジュアルを作成することができます。
                            </Text>
                        </Box>
                    </ArticleCard>
                </BookLayout>
            </Modal>

            <Modal
                isOpen={showChatLayoutDemo}
                onClose={() => setShowChatLayoutDemo(false)}
                title="ChatLayout フルサイズデモ"
                size="full"
                showCloseButton={true}
            >
                <ChatLayout
                    chatTitle="プログラミング相談チャット"
                    showUserList={true}
                    userListContent={
                        <VStack align="stretch" gap={3}>
                            <Text color="green.600" fontSize="sm" fontWeight="semibold">
                                🟢 オンライン
                            </Text>
                            <Text fontSize="sm">👨‍💻 KeNJi (管理者)</Text>
                            <Text fontSize="sm">👩‍💻 田中さん</Text>
                            <Text fontSize="sm">👨‍🎓 佐藤くん</Text>
                            <Text mt={4} color="gray.500" fontSize="sm" fontWeight="semibold">
                                💤 オフライン
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                👩‍💼 山田さん
                            </Text>
                            <Text color="gray.500" fontSize="sm">
                                👨‍🔬 鈴木さん
                            </Text>
                        </VStack>
                    }
                    headerContent={
                        <Button size="sm" variant="outline">
                            設定
                        </Button>
                    }
                >
                    <VStack align="stretch" gap={6} maxW="800px" mx="auto">
                        <Box maxW="80%" p={4} bg="white" borderRadius="lg" shadow="sm">
                            <Text mb={1} color="gray.600" fontSize="sm">
                                KeNJi - 10:30
                            </Text>
                            <Text>こんにちは！プログラミングについて何かご質問はありますか？</Text>
                        </Box>

                        <Box
                            alignSelf="flex-end"
                            maxW="80%"
                            p={4}
                            bg="blue.100"
                            borderRadius="lg"
                            shadow="sm"
                        >
                            <Text mb={1} color="gray.600" fontSize="sm">
                                田中さん - 10:32
                            </Text>
                            <Text>
                                P5.jsで円を描く方法を教えてください。どの関数を使えばよいでしょうか？
                            </Text>
                        </Box>

                        <Box maxW="80%" p={4} bg="white" borderRadius="lg" shadow="sm">
                            <Text mb={1} color="gray.600" fontSize="sm">
                                KeNJi - 10:33
                            </Text>
                            <Text mb={2}>P5.jsで円を描くには `circle()` 関数を使用します。</Text>
                            <Box
                                p={3}
                                fontFamily="mono"
                                fontSize="sm"
                                bg="gray.100"
                                borderRadius="md"
                            >
                                circle(x, y, diameter);
                            </Box>
                        </Box>

                        <Box
                            alignSelf="flex-end"
                            maxW="80%"
                            p={4}
                            bg="green.100"
                            borderRadius="lg"
                            shadow="sm"
                        >
                            <Text mb={1} color="gray.600" fontSize="sm">
                                佐藤くん - 10:35
                            </Text>
                            <Text>ありがとうございます！とても分かりやすい説明でした 👍</Text>
                        </Box>
                    </VStack>
                </ChatLayout>
            </Modal>

            <Modal
                isOpen={showAdminLayoutDemo}
                onClose={() => setShowAdminLayoutDemo(false)}
                title="AdminLayout フルサイズデモ"
                size="full"
                showCloseButton={true}
            >
                <AdminLayout
                    pageTitle="ダッシュボード"
                    pageDescription="サイトの統計情報と管理機能の概要"
                >
                    <VStack align="stretch" gap={8}>
                        {/* Stats Cards */}
                        <HStack justify="stretch" flexWrap="wrap" gap={6}>
                            <Card flex="1" minW="200px" variant="elevated">
                                <HStack align="center" justify="space-between">
                                    <Box>
                                        <Text mb={1} color="gray.600" fontSize="sm">
                                            総記事数
                                        </Text>
                                        <Text color="blue.600" fontSize="3xl" fontWeight="bold">
                                            42
                                        </Text>
                                        <Text color="green.600" fontSize="sm">
                                            ↗ +3 今月
                                        </Text>
                                    </Box>
                                    <Box fontSize="2xl">📝</Box>
                                </HStack>
                            </Card>

                            <Card flex="1" minW="200px" variant="elevated">
                                <HStack align="center" justify="space-between">
                                    <Box>
                                        <Text mb={1} color="gray.600" fontSize="sm">
                                            総ユーザー数
                                        </Text>
                                        <Text color="green.600" fontSize="3xl" fontWeight="bold">
                                            1,234
                                        </Text>
                                        <Text color="green.600" fontSize="sm">
                                            ↗ +89 今月
                                        </Text>
                                    </Box>
                                    <Box fontSize="2xl">👥</Box>
                                </HStack>
                            </Card>

                            <Card flex="1" minW="200px" variant="elevated">
                                <HStack align="center" justify="space-between">
                                    <Box>
                                        <Text mb={1} color="gray.600" fontSize="sm">
                                            月間PV
                                        </Text>
                                        <Text color="purple.600" fontSize="3xl" fontWeight="bold">
                                            15.6K
                                        </Text>
                                        <Text color="green.600" fontSize="sm">
                                            ↗ +12% 前月比
                                        </Text>
                                    </Box>
                                    <Box fontSize="2xl">📊</Box>
                                </HStack>
                            </Card>
                        </HStack>

                        {/* Recent Activity */}
                        <Card variant="elevated">
                            <Heading mb={4} size="md">
                                最近の活動
                            </Heading>
                            <VStack align="stretch" gap={3}>
                                <HStack p={3} bg="blue.50" borderRadius="md">
                                    <Box fontSize="lg">📝</Box>
                                    <Box flex="1">
                                        <Text fontSize="sm" fontWeight="semibold">
                                            新しい記事が投稿されました
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            「React Hooks の使い方」- 5分前
                                        </Text>
                                    </Box>
                                </HStack>

                                <HStack p={3} bg="green.50" borderRadius="md">
                                    <Box fontSize="lg">👤</Box>
                                    <Box flex="1">
                                        <Text fontSize="sm" fontWeight="semibold">
                                            新規ユーザー登録
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            yamada@example.com - 15分前
                                        </Text>
                                    </Box>
                                </HStack>

                                <HStack p={3} bg="purple.50" borderRadius="md">
                                    <Box fontSize="lg">💬</Box>
                                    <Box flex="1">
                                        <Text fontSize="sm" fontWeight="semibold">
                                            新しいコメント
                                        </Text>
                                        <Text color="gray.600" fontSize="xs">
                                            「とても勉強になりました」- 30分前
                                        </Text>
                                    </Box>
                                </HStack>
                            </VStack>
                        </Card>

                        {/* Quick Actions */}
                        <Card variant="elevated">
                            <Heading mb={4} size="md">
                                クイックアクション
                            </Heading>
                            <HStack flexWrap="wrap" gap={4}>
                                <Button colorScheme="blue">新しい記事を作成</Button>
                                <Button variant="outline">ユーザー管理</Button>
                                <Button variant="outline">統計を表示</Button>
                                <Button variant="outline">設定</Button>
                            </HStack>
                        </Card>
                    </VStack>
                </AdminLayout>
            </Modal>
        </Box>
    );
}
