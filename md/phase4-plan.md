# Phase 4: ナビゲーション・レイアウト・ページ移植

## 📋 Phase 4 概要

**目標**: ナビゲーションシステムの強化とページ構造の整備

### 4.1 ナビゲーションシステムの実装

#### ✅ 完了済み

- 基本的な Header コンポーネント
- ログイン/ログアウト機能
- スクロール対応ヘッダー

#### 🚀 今回の実装項目

1. **Navigation コンポーネント**

    - ホーム、レッスン、チャット（ログイン時）
    - アクティブ状態の表示
    - レスポンシブ対応

2. **HeaderBox コンポーネント**

    - ナビゲーションアイテムのスタイリング
    - アクティブ/非アクティブ状態

3. **パンくずリスト機能**

    - 記事ページでの「一覧に戻る」ボタン
    - 動的ルーティング対応

4. **モバイルナビゲーション**
    - ハンバーガーメニュー
    - ドロワーサイドバー
    - タッチ対応

### 4.2 レイアウトシステム

1. **ルートレイアウト強化**

    - Header/Footer統合
    - AuthProvider統合
    - Toast統合

2. **専用レイアウト**
    - チャットページレイアウト
    - 書籍ページレイアウト
    - 管理ページレイアウト

### 4.3 ページ構造

1. **ホームページ**

    - ヒーローセクション
    - 特徴紹介
    - レッスン一覧プレビュー

2. **書籍一覧ページ**

    - `/books/` ページ
    - フィルタリング機能
    - 検索機能

3. **個別書籍ページ**

    - `/books/[bookSlug]/` ページ
    - チャプター一覧
    - 進捗表示

4. **記事ページ**
    - `/books/[bookSlug]/[articleSlug]/` ページ
    - Markdown レンダリング
    - サイドナビゲーション

## 📊 実装予定コンポーネント

### ナビゲーション系

- `Navigation.tsx` - メインナビゲーション
- `HeaderBox.tsx` - ナビゲーションアイテム
- `MobileNav.tsx` - モバイルナビゲーション
- `BackButton.tsx` - 戻るボタン

### レイアウト系

- `ChatLayout.tsx` - チャット専用レイアウト
- `BookLayout.tsx` - 書籍閲覧レイアウト
- `AdminLayout.tsx` - 管理ページレイアウト

### ページ系

- `HomePage.tsx` - ホームページ
- `BooksPage.tsx` - 書籍一覧
- `BookDetailPage.tsx` - 個別書籍
- `ArticlePage.tsx` - 記事表示

## 🎯 技術仕様

### ナビゲーション仕様

```typescript
interface NavigationItem {
    name: string;
    url: string;
    requireAuth?: boolean;
    icon?: IconType;
}

interface NavigationProps {
    pathname: string;
    user: User | null;
    loading: boolean;
}
```

### レスポンシブ対応

- Desktop: 1140px max-width
- Tablet: 768px-1140px
- Mobile: ~767px

### アニメーション

- Header scroll hide/show
- Navigation active states
- Mobile menu transitions

## 📝 実装順序

1. Navigation コンポーネント作成
2. HeaderBox コンポーネント作成
3. Header に Navigation 統合
4. モバイルナビゲーション実装
5. 専用レイアウト作成
6. ページコンポーネント作成
7. 動的ルーティング確認
8. レスポンシブ調整

## ✅ 完了条件

- [x] 基本 Header/Footer
- [ ] Navigation システム完成
- [ ] モバイル対応完了
- [ ] 専用レイアウト作成
- [ ] 主要ページ作成
- [ ] レスポンシブ調整完了
- [ ] Phase 4 デモページ更新

## 🔄 Phase 5 連携

Phase 4 完了後は以下に進む予定：

- 記事表示システム (Markdown パース)
- サイドメニューシステム
- 書籍管理システム
- 検索・フィルタリング機能
