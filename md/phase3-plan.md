# Phase 3 Plan: Card Component System & UI Foundation

## 🎯 Phase 3 目標

Phase 2の認証システム完了を受けて、Phase 3では**基本的なUIコンポーネント**と**Cardシステム**を実装し、記事・コンテンツ表示の基盤を構築します。

## 📋 Phase 3 実装計画

### 3.1 基本Cardコンポーネント (Priority: High)

**目標**: 元プロジェクトのCard styled-componentsをChakra UI版に移植

#### 必要なCardコンポーネント:

1. **基本Card** - 汎用的なカードコンテナ
2. **ArticleCard** - 記事表示用のカード
3. **SideMenuCard** - サイドメニュー表示用のカード
4. **SideMenuHeadCard** - サイドメニューヘッダー用のカード

#### 技術仕様:

- Chakra UI v3のCard componentを基盤とする
- TypeScript完全対応
- レスポンシブデザイン対応
- 元プロジェクトのスタイルを再現

### 3.2 共通UIコンポーネント (Priority: High)

**目標**: 他のコンポーネントで使用される基本的なUI要素

#### 実装コンポーネント:

1. **Button** - 汎用ボタンコンポーネント
2. **ToggleBtn** - カード表示切り替え用ボタン
3. **Modal** - モーダルダイアログ
4. **Toast** - 通知システム

### 3.3 ナビゲーション・レイアウト拡張 (Priority: Medium)

**目標**: 記事表示に必要なナビゲーション機能

#### 実装項目:

1. **Navigation** - ヘッダーナビゲーション拡張
2. **Breadcrumb** - パンくずナビゲーション
3. **NeighborLinkCard** - 前後記事リンクカード

### 3.4 デモページ・テスト (Priority: Medium)

**目標**: 実装したコンポーネントの動作確認

#### 実装項目:

1. **Components Demo Page** - コンポーネント一覧表示
2. **Card Demo Page** - 各種カードコンポーネントのデモ
3. **Responsive Test** - レスポンシブ対応確認

## 🗂️ ファイル構造計画

```
src/
├── components/
│   ├── common/
│   │   ├── Card/
│   │   │   ├── index.tsx           # Card exports
│   │   │   ├── Card.tsx            # 基本Card
│   │   │   ├── ArticleCard.tsx     # 記事用Card
│   │   │   ├── SideMenuCard.tsx    # サイドメニュー用Card
│   │   │   └── SideMenuHeadCard.tsx # サイドメニューヘッダー用Card
│   │   ├── Button/
│   │   │   ├── index.tsx           # Button exports
│   │   │   ├── Button.tsx          # 基本Button
│   │   │   └── ToggleBtn.tsx       # トグルButton
│   │   ├── Modal/
│   │   │   ├── index.tsx           # Modal exports
│   │   │   └── Modal.tsx           # 基本Modal
│   │   └── Navigation/
│   │       ├── index.tsx           # Navigation exports
│   │       ├── Navigation.tsx      # ヘッダーナビ
│   │       ├── Breadcrumb.tsx      # パンくず
│   │       └── NeighborLinkCard.tsx # 前後記事リンク
├── app/
│   ├── demo/
│   │   ├── page.tsx                # コンポーネントデモページ
│   │   └── cards/
│   │       └── page.tsx            # カードデモページ
└── styles/
    └── components.css              # 追加スタイル（必要時）
```

## 🔧 技術詳細

### Card Component 仕様

```typescript
interface CardProps {
    children: React.ReactNode;
    variant?: 'elevated' | 'outline' | 'subtle';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    // ... その他必要なprops
}

interface ArticleCardProps extends CardProps {
    maxWidth?: string | number;
    // 記事特有のprops
}

interface SideMenuCardProps extends CardProps {
    sticky?: boolean;
    scrollBehavior?: 'auto' | 'hidden';
    // サイドメニュー特有のprops
}
```

### Button Component 仕様

```typescript
interface ButtonProps {
    children: React.ReactNode;
    variant?: 'solid' | 'outline' | 'ghost';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    colorScheme?: string;
    loading?: boolean;
    disabled?: boolean;
    onClick?: () => void;
    // ... その他必要なprops
}

interface ToggleBtnProps {
    toggle: boolean;
    onClick: () => void;
    activeIcon?: React.ReactNode;
    inactiveIcon?: React.ReactNode;
}
```

## 🎨 デザイン方針

### カラーパレット活用

- 既存のbrand色（shark, abbey, blue等）を活用
- Chakra UI v3のセマンティック色を組み合わせ
- レスポンシブデザイン優先

### アニメーション・インタラクション

- Chakra UIの標準アニメーションを活用
- motion package（既にインストール済み）を必要に応じて使用
- UXを向上させるマイクロインタラクション

## 📊 Phase 3 完了基準

- [ ] **基本Card**: すべてのCardコンポーネントが実装され動作
- [ ] **Button System**: Button、ToggleBtnが実装され動作
- [ ] **Modal**: 基本的なモーダル機能が実装
- [ ] **Demo Pages**: すべてのコンポーネントがデモページで確認可能
- [ ] **TypeScript**: 100% TypeScript対応
- [ ] **Responsive**: モバイル・タブレット・デスクトップ対応確認
- [ ] **Documentation**: 各コンポーネントの使用方法が明確

## 🔄 Phase 4 準備

Phase 3完了後は：

1. **記事・コンテンツ表示システム** - ArticleContent, Markdown解析
2. **書籍・チャプター管理** - BookList, SectionList
3. **サイドメニューシステム** - 記事ナビゲーション
4. **問題・カードセット機能** - インタラクティブコンテンツ

## 🚀 開始

まず基本Cardコンポーネントから実装を開始し、段階的にUIシステムを構築していきます。
