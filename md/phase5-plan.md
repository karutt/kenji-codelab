# Phase 5 Plan - Specialized Layouts & Main Pages

## 概要

Phase 4でナビゲーションシステムが完成したので、Phase 5では専用レイアウトとメインページの実装を行います。

## 実装予定

### 🎯 専用レイアウト実装

#### 1. Chat Layout

- **ファイル**: `/src/components/layout/ChatLayout.tsx`
- **機能**:
    - チャット用の全画面レイアウト
    - サイドバーとメインチャットエリア
    - メッセージ履歴表示
    - 入力フィールドエリア
    - レスポンシブ対応

#### 2. Book Layout

- **ファイル**: `/src/components/layout/BookLayout.tsx`
- **機能**:
    - 書籍閲覧用のレイアウト
    - 左サイドバー（目次）
    - メインコンテンツエリア
    - 右サイドバー（進捗、関連リンク）
    - Breadcrumbナビゲーション
    - 前後記事ナビゲーション

#### 3. Admin Layout

- **ファイル**: `/src/components/layout/AdminLayout.tsx`
- **機能**:
    - 管理画面用レイアウト
    - 管理用ナビゲーション
    - ダッシュボードエリア
    - データ管理用コンポーネント

### 🎯 メインページ実装

#### 1. Home Page

- **ファイル**: `/src/app/page.tsx`
- **機能**:
    - ランディングページ
    - 書籍紹介セクション
    - 最新記事表示
    - CTA（Call to Action）エリア
    - プロフィール情報

#### 2. Books Listing Page

- **ファイル**: `/src/app/books/page.tsx`
- **機能**:
    - 書籍一覧表示
    - フィルタリングとソート
    - カード形式での書籍表示
    - 検索機能
    - カテゴリ別表示

#### 3. Individual Book Page

- **ファイル**: `/src/app/books/[bookId]/page.tsx`
- **機能**:
    - 書籍詳細表示
    - 章一覧表示
    - 進捗表示
    - 書籍メタデータ表示
    - 関連書籍推薦

#### 4. Article Pages

- **ファイル**: `/src/app/books/[bookId]/[chapterId]/page.tsx`
- **機能**:
    - マークダウン記事表示
    - 動的コンテンツ読み込み
    - Breadcrumbナビゲーション
    - 前後記事ナビゲーション
    - コメント機能（将来的に）

### 🎯 コンテンツ管理システム

#### 1. マークダウン処理

- **ファイル**: `/src/utils/markdown.ts`
- **機能**:
    - マークダウンファイルの読み込み
    - HTMLへの変換
    - メタデータ抽出
    - コードハイライト

#### 2. 書籍メタデータ管理

- **ファイル**: `/src/data/books.ts`
- **機能**:
    - 書籍情報の定義
    - 章構造の管理
    - 進捗追跡
    - カテゴリ管理

#### 3. ナビゲーション構造生成

- **ファイル**: `/src/utils/navigation.ts`
- **機能**:
    - 動的ナビゲーション生成
    - パンくずリスト生成
    - サイドバーメニュー生成

## 実装優先順位

### Week 1: 基本レイアウト

1. Book Layout の実装
2. Home Page の実装
3. Books Listing Page の基本機能

### Week 2: コンテンツシステム

1. マークダウン処理システム
2. Individual Book Page
3. Article Pages の基本機能

### Week 3: 高度な機能

1. Chat Layout（基本版）
2. Admin Layout（基本版）
3. 検索・フィルタリング機能

### Week 4: 最適化・テスト

1. パフォーマンス最適化
2. SEO対応
3. アクセシビリティ改善
4. テスト実装

## 使用コンポーネント

Phase 3-4で実装したコンポーネントを活用：

### レイアウト用

- `Card` - コンテンツエリア
- `ArticleCard` - 記事表示
- `SideMenuCard` - サイドバー
- `Navigation` - ナビゲーション
- `Breadcrumb` - パンくずナビゲーション

### インタラクション用

- `Button` - アクション要素
- `Modal` - ダイアログ表示
- `NeighborLinkCard` - 記事間ナビゲーション
- `HeaderBox` - ヘッダー要素

## 技術仕様

### フレームワーク・ライブラリ

- Next.js 15 (App Router)
- TypeScript
- Chakra UI v3
- MDX (マークダウン処理)

### ディレクトリ構造

```
src/
├── app/
│   ├── page.tsx                    # Home
│   ├── books/
│   │   ├── page.tsx               # Books Listing
│   │   └── [bookId]/
│   │       ├── page.tsx           # Individual Book
│   │       └── [chapterId]/
│   │           └── page.tsx       # Article
│   ├── chat/
│   │   └── page.tsx               # Chat
│   └── admin/
│       └── page.tsx               # Admin
├── components/
│   └── layout/
│       ├── BookLayout.tsx
│       ├── ChatLayout.tsx
│       └── AdminLayout.tsx
├── data/
│   └── books.ts                   # 書籍メタデータ
└── utils/
    ├── markdown.ts                # マークダウン処理
    └── navigation.ts              # ナビゲーション生成
```

## 期待される成果

Phase 5完了後：

✅ **完全なコンテンツ表示システム**  
✅ **動的マークダウン記事表示**  
✅ **書籍管理システム**  
✅ **専用レイアウトシステム**  
✅ **SEO最適化対応**  
✅ **完全なレスポンシブ対応**

これにより、kenji-codelab-2プロジェクトは基本的な学習プラットフォームとして機能する完成形に近づきます。
