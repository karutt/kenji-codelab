# Phase 6 Plan - Main Pages & Content Implementation

## 概要

Phase 5で専用レイアウトとコンテンツ管理システムが完成したので、Phase 6では実際のメインページとマークダウン処理システムを実装します。

## 実装予定

### 🎯 メインページ実装

#### 1. Home Page (Redesign)

- **ファイル**: `/src/app/page.tsx`
- **機能**:
    - ランディングページとしてのデザイン刷新
    - 書籍カタログ表示
    - 最新記事セクション
    - フィーチャー書籍の紹介
    - CTA（Call to Action）エリア
    - レスポンシブ対応

#### 2. Books Index Page

- **ファイル**: `/src/app/books/page.tsx`
- **機能**:
    - 全書籍の一覧表示
    - カテゴリ別フィルタリング
    - 書籍カード形式での表示
    - 進捗表示（将来的に）
    - 検索機能（基本版）

#### 3. Individual Book Page

- **ファイル**: `/src/app/books/[bookId]/page.tsx`
- **機能**:
    - 書籍詳細情報表示
    - 章一覧表示
    - BookLayoutの活用
    - 書籍メタデータ表示
    - 目次サイドバー

#### 4. Chapter/Article Page

- **ファイル**: `/src/app/books/[bookId]/[chapterId]/page.tsx`
- **機能**:
    - マークダウン記事の表示
    - BookLayoutの完全活用
    - Breadcrumbナビゲーション
    - 前後記事ナビゲーション
    - 動的コンテンツ読み込み

### 🎯 マークダウン処理システム

#### 1. Markdown Processor

- **ファイル**: `/src/utils/markdown.ts`
- **機能**:
    - マークダウンファイルの読み込み
    - HTMLへの変換
    - フロントマター解析
    - コードハイライト対応
    - 数式表示対応（将来的に）

#### 2. Content Loader

- **ファイル**: `/src/utils/contentLoader.ts`
- **機能**:
    - 動的コンテンツ読み込み
    - ファイルシステムからの読み込み
    - キャッシュ機能
    - エラーハンドリング

#### 3. Navigation Generator

- **ファイル**: `/src/utils/navigationGenerator.ts`
- **機能**:
    - Breadcrumb自動生成
    - 前後記事リンク生成
    - 目次自動生成
    - サイトマップ生成

### 🎯 コンテンツディレクトリ構造

#### Content Directory Setup

```
public/
└── content/
    └── books/
        ├── p5-tutorial/
        │   ├── meta.json
        │   ├── 1-1.md
        │   ├── 1-2.md
        │   └── ...
        ├── python-tutorial/
        │   ├── meta.json
        │   ├── 1-1.md
        │   └── ...
        └── slide-design/
            ├── meta.json
            ├── 1-1.md
            └── ...
```

### 🎯 データ構造拡張

#### Enhanced Book Data

- **ファイル**: `/src/data/books.ts`
- **拡張機能**:
    - 実際のマークダウンファイルとの連携
    - 動的章数の取得
    - 読了時間の自動計算
    - 最終更新日の管理

## 実装ステップ

### Week 1: マークダウンシステム基盤

1. ✅ マークダウン処理ライブラリの選定・設定
2. ✅ コンテンツローダーの実装
3. ✅ 基本的なマークダウン→HTML変換

### Week 2: ページ実装

1. ✅ Home Pageの刷新
2. ✅ Books Index Pageの実装
3. ✅ Individual Book Pageの実装

### Week 3: 記事ページとナビゲーション

1. ✅ Chapter/Article Pageの実装
2. ✅ ナビゲーション生成システム
3. ✅ Breadcrumb・前後記事リンクの完全実装

### Week 4: 最適化・テスト

1. ✅ パフォーマンス最適化
2. ✅ SEO対応
3. ✅ アクセシビリティ改善
4. ✅ モバイル対応の最終調整

## 使用技術

### マークダウン処理

- **next-mdx-remote** または **unified/remark**
- **rehype-highlight** (コードハイライト)
- **remark-gfm** (GitHub Flavored Markdown)
- **gray-matter** (フロントマター解析)

### コンテンツ管理

- **Node.js fs** (ファイルシステム操作)
- **path** (パス操作)
- **dynamic imports** (動的読み込み)

### スタイリング

- **Chakra UI v3** (継続使用)
- **prism.js** または **highlight.js** (シンタックスハイライト)

## 期待される成果

Phase 6完了後：

✅ **完全に機能するブログ/学習システム**  
✅ **実際のマークダウンコンテンツ表示**  
✅ **動的ナビゲーションシステム**  
✅ **SEO最適化されたページ**  
✅ **高品質なユーザーエクスペリエンス**  
✅ **スケーラブルなコンテンツ管理**

Phase 6により、kenji-codelab-2は完全に機能する学習プラットフォームとして完成します。

## サンプルコンテンツ

### デモ記事

Phase 6では以下のサンプル記事を作成：

1. **P5.js Tutorial**

    - §1.1 プログラミングとは
    - §1.2 HTML, CSS, JavaScript, p5.js
    - §1.3 プロジェクトファイル構造

2. **Python Programming**

    - §1.1 Pythonの基本
    - §1.2 変数とデータ型
    - §1.3 制御構造

3. **Slide Design**
    - §1.1 スライドの基本
    - §1.2 レイアウトの原則
    - §1.3 デザインテクニック

これらのコンテンツにより、システム全体の動作確認とユーザーエクスペリエンスの検証を行います。
