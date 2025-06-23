# kenji-codelab-2 移植計画書

## 📋 プロジェクト概要

### 目的

- 古い `kenji-codelab` プロジェクトを新環境 `kenji-codelab-2` へ移植
- Chakra UI のみでクリーンな実装へリファクタリング
- styled-components + styled-system の混在状態を解消
- ファイル構造の整理とモダンな開発環境への移行

### 技術スタック比較

| 項目           | 旧環境 (kenji-codelab)           | 新環境 (kenji-codelab-2) |
| -------------- | -------------------------------- | ------------------------ |
| Next.js        | 14.2.6                           | 15.3.3                   |
| React          | 18                               | 19                       |
| Chakra UI      | 3.16.0                           | 3.21.0                   |
| TypeScript     | ❌                               | ✅                       |
| 古いライブラリ | styled-components, styled-system | ❌ (削除)                |
| 開発環境       | JavaScript                       | TypeScript               |

---

## 🚀 移植フェーズ計画

### Phase 1: 基盤セットアップ (1-2日)

**目標**: 開発環境とコア設定の移植

#### 1.1 パッケージとライブラリの移植

- [ ] 必要な依存関係の追加
    - `firebase`, `@tanstack/react-query`
    - `zenn-content-css`, `zenn-markdown-html`
    - `react-virtuoso`, `gray-matter`
    - `react-icons`, `framer-motion`
- [ ] TypeScript対応パッケージの追加
    - `@types/node`, `@types/react`, `@types/react-dom`

#### 1.2 基本設定ファイルの移植

- [ ] `next.config.ts` の設定移植
- [ ] `tsconfig.json` の調整
- [ ] ESLint設定の移植・改善
- [ ] CSS/スタイル設定の移植

#### 1.3 Chakra UI テーマシステムの移植

- [ ] `src/utils/chakura_theme.js` → TypeScript化
- [ ] カラーパレット・トークンの移植
- [ ] プロバイダー設定の移植

---

### Phase 2: コアコンポーネント移植 (3-4日)

**目標**: UI基盤とレイアウトコンポーネントの移植

#### 2.1 レイアウトコンポーネント

- [ ] `src/app/layout.tsx` の移植
- [ ] Header コンポーネントの移植
    - styled-components → Chakra UI Box
    - Navigation の移植
- [ ] Footer コンポーネントの移植
- [ ] Background (Bg) コンポーネントの移植

#### 2.2 共通UIコンポーネント

- [ ] カードコンポーネントの移植
    - `Card`, `ArticleCard`, `SideMenuCard` など
    - styled-components → Chakra UI 化
- [ ] アイコンシステムの移植
- [ ] モーダル・トースター等のUI移植

#### 2.3 styled-components → Chakra UI 変換

- [ ] `src/styles/Box.js` の削除・Chakra UI Box 移行
- [ ] `src/components/common/Input.js` → Chakra UI Input
- [ ] その他 styled-components の段階的削除

---

### Phase 3: 機能別コンポーネント移植 (5-7日)

**目標**: 主要機能の移植とTypeScript化

#### 3.1 認証系 (Auth)

- [ ] `src/features/user/` の移植
- [ ] `src/contexts/AuthContext` の TypeScript化
- [ ] ログイン・サインアップフォームの移植
- [ ] プロフィールページの移植

#### 3.2 記事・ブック機能

- [ ] `src/features/article/` の移植
- [ ] `src/components/books/` の移植
- [ ] Markdown パースシステムの移植
- [ ] サイドメニューシステムの移植

#### 3.3 チャット機能

- [ ] `src/features/chat/` の移植
- [ ] リアルタイム通信機能の移植
- [ ] Virtuoso を使った最適化機能の移植

#### 3.4 問題・カードセット機能

- [ ] `src/features/problem/` の移植
- [ ] `src/components/CardSet/` の移植
- [ ] インタラクティブ要素の移植

---

### Phase 4: ページ・ルーティング移植 (2-3日)

**目標**: 全ページの移植とルーティング設定

#### 4.1 主要ページ

- [ ] ホームページ (`src/app/page.tsx`)
- [ ] 書籍一覧ページ (`src/app/books/`)
- [ ] 記事ページ (`src/app/books/[bookSlug]/[articleSlug]/`)
- [ ] チャットページ (`src/app/chat/`)

#### 4.2 認証関連ページ

- [ ] ログインページ (`src/app/login/`)
- [ ] サインアップページ (`src/app/signup/`)
- [ ] プロフィールページ (`src/app/profile/`)

#### 4.3 レイアウトとミドルウェア

- [ ] 動的レイアウトの移植
- [ ] `src/middleware.js` の TypeScript化

---

### Phase 5: 静的アセット・コンテンツ移植 (1-2日)

**目標**: 静的ファイルとコンテンツの移植

#### 5.1 public フォルダ

- [ ] 画像ファイルの移植
- [ ] SVGアイコンの移植
- [ ] ファビコン等の移植

#### 5.2 書籍コンテンツ

- [ ] `public/books/` フォルダの移植
- [ ] Markdown ファイルの移植
- [ ] 設定ファイル（config.json等）の移植

---

### Phase 6: 最適化・テスト・仕上げ (2-3日)

**目標**: パフォーマンス最適化と品質向上

#### 6.1 TypeScript対応完了

- [ ] 全ファイルの TypeScript化
- [ ] 型定義の追加・改善
- [ ] エラーの修正

#### 6.2 パフォーマンス最適化

- [ ] 不要なライブラリの削除確認
- [ ] Bundle サイズの最適化
- [ ] コード分割の最適化

#### 6.3 品質保証

- [ ] ESLint エラーの修正
- [ ] 動作テスト
- [ ] レスポンシブ対応確認
- [ ] ブラウザ互換性確認

---

## 📁 ファイル構造計画

```
kenji-codelab-2/
├── src/
│   ├── app/                  # App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── books/
│   │   ├── chat/
│   │   ├── login/
│   │   └── signup/
│   ├── components/           # 共通コンポーネント
│   │   ├── ui/              # Chakra UI 拡張
│   │   ├── layout/          # レイアウト関連
│   │   └── common/          # 汎用コンポーネント
│   ├── features/            # 機能別コンポーネント
│   │   ├── auth/
│   │   ├── article/
│   │   ├── chat/
│   │   └── problem/
│   ├── hooks/               # カスタムフック
│   ├── contexts/            # React Context
│   ├── utils/               # ユーティリティ
│   ├── types/               # TypeScript型定義
│   └── styles/              # スタイル関連
├── public/                  # 静的アセット
└── docs/                    # ドキュメント
```

---

## ⚠️ 注意事項・リスク

### 技術的な課題

1. **styled-components からの移行**

    - 複雑なスタイルロジックの Chakra UI への変換
    - `styled-system` プロパティの Chakra UI 対応への変更

2. **TypeScript化**

    - 既存 JavaScript コードの型付け
    - Firebase/外部ライブラリの型定義

3. **依存関係の整理**
    - 不要なライブラリの特定と削除
    - バージョン互換性の確認

### データ・設定の移行

1. **Firebase設定**

    - 環境変数の移植
    - 認証設定の確認

2. **コンテンツファイル**
    - Markdown ファイルの整合性確認
    - 画像パスの調整

---

## 📊 進捗管理

| フェーズ | 予定日数 | 担当 | ステータス |
| -------- | -------- | ---- | ---------- |
| Phase 1  | 1-2日    | -    | 📋 計画中  |
| Phase 2  | 3-4日    | -    | ⏸️ 待機中  |
| Phase 3  | 5-7日    | -    | ⏸️ 待機中  |
| Phase 4  | 2-3日    | -    | ⏸️ 待機中  |
| Phase 5  | 1-2日    | -    | ⏸️ 待機中  |
| Phase 6  | 2-3日    | -    | ⏸️ 待機中  |

**総予定期間**: 14-21日

---

## 🎯 成功指標

1. **機能面**

    - [ ] 全ての既存機能が正常動作
    - [ ] 認証フローの完全動作
    - [ ] チャット機能の正常動作
    - [ ] 記事閲覧・ナビゲーションの正常動作

2. **技術面**

    - [ ] styled-components の完全除去
    - [ ] TypeScript化 100%完了
    - [ ] ESLint エラー 0件
    - [ ] Build エラー 0件

3. **パフォーマンス面**
    - [ ] First Contentful Paint の改善
    - [ ] Bundle サイズの削減
    - [ ] ランタイムエラーの削減

---

## 📝 メモ・補足

- Chakra UI v3 の新機能を活用した UI/UX 向上も検討
- レスポンシブデザインの見直し・改善
- アクセシビリティの向上
- コードの可読性・保守性の向上

---

**最終更新**: 2025-06-18  
**作成者**: GitHub Copilot
