export interface BookChapter {
    id: string;
    title: string;
    description?: string;
    order: number;
    published: boolean;
    estimatedReadTime?: number; // in minutes
}

export interface Book {
    id: string;
    title: string;
    description: string;
    category: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    language: 'ja' | 'en';
    coverImage?: string;
    published: boolean;
    createdAt: Date;
    updatedAt: Date;
    chapters: BookChapter[];
    tags: string[];
    estimatedTotalTime?: number; // in minutes
}

export interface BookCategory {
    id: string;
    name: string;
    description: string;
    icon?: string;
    order: number;
}

// Sample book data
export const bookCategories: BookCategory[] = [
    {
        id: 'programming',
        name: 'プログラミング',
        description: 'プログラミング言語とフレームワークの学習',
        order: 1,
    },
    {
        id: 'web-development',
        name: 'Web開発',
        description: 'フロントエンドとバックエンドの開発技術',
        order: 2,
    },
    {
        id: 'design',
        name: 'デザイン',
        description: 'UI/UXデザインとビジュアルデザイン',
        order: 3,
    },
    {
        id: 'data-science',
        name: 'データサイエンス',
        description: 'データ分析と機械学習',
        order: 4,
    },
];

// Sample books data
export const books: Book[] = [
    {
        id: 'p5_tutorial',
        title: 'P5.js チュートリアル',
        description: 'P5.jsを使ったクリエイティブプログラミングの基礎を学びます',
        category: 'programming',
        level: 'beginner',
        language: 'ja',
        published: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-12-19'),
        tags: ['p5.js', 'JavaScript', 'クリエイティブプログラミング', '初心者向け'],
        estimatedTotalTime: 300,
        chapters: [
            {
                id: '1-0',
                title: 'P5.jsとは？プログラミング初心者のための入門ガイド',
                description: 'P5.jsの概要と基本的な概念を学びます',
                order: 1,
                published: true,
                estimatedReadTime: 15,
            },
            {
                id: '1-1',
                title: '開発環境の準備',
                description: 'P5.js開発環境のセットアップ方法',
                order: 2,
                published: true,
                estimatedReadTime: 20,
            },
            {
                id: '2-0',
                title: '基本図形を描いてみよう',
                description: '円、四角、三角形の描画方法',
                order: 3,
                published: true,
                estimatedReadTime: 25,
            },
            {
                id: '2-1',
                title: '色と塗りつぶし',
                description: '色の指定方法と塗りつぶしテクニック',
                order: 4,
                published: true,
                estimatedReadTime: 20,
            },
        ],
    },
    {
        id: 'python_tutorial',
        title: 'Python プログラミング入門',
        description: 'Pythonプログラミングの基礎から応用まで',
        category: 'programming',
        level: 'beginner',
        language: 'ja',
        published: true,
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-12-15'),
        tags: ['Python', 'プログラミング基礎', '初心者向け'],
        estimatedTotalTime: 480,
        chapters: [
            {
                id: '1-0',
                title: 'Pythonとは',
                description: 'Pythonの特徴と用途',
                order: 1,
                published: true,
                estimatedReadTime: 10,
            },
            {
                id: '1-1',
                title: 'Python環境の構築',
                description: 'Pythonのインストールと環境設定',
                order: 2,
                published: true,
                estimatedReadTime: 25,
            },
            {
                id: '2-0',
                title: '変数とデータ型',
                description: 'Pythonの基本的なデータ型',
                order: 3,
                published: true,
                estimatedReadTime: 30,
            },
        ],
    },
    {
        id: 'slide_design',
        title: 'スライドデザイン講座',
        description: '効果的なプレゼンテーションスライドの作成方法',
        category: 'design',
        level: 'intermediate',
        language: 'ja',
        published: true,
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-12-10'),
        tags: ['デザイン', 'プレゼンテーション', 'スライド'],
        estimatedTotalTime: 240,
        chapters: [
            {
                id: '1-0',
                title: '良いスライドデザインの原則',
                description: 'デザインの基礎理論とスライドへの応用',
                order: 1,
                published: true,
                estimatedReadTime: 20,
            },
            {
                id: '2-0',
                title: 'レイアウトとタイポグラフィ',
                description: '読みやすく美しいスライドの作り方',
                order: 2,
                published: true,
                estimatedReadTime: 25,
            },
        ],
    },
];

// Utility functions
export function getBookById(id: string): Book | undefined {
    return books.find(book => book.id === id);
}

export function getBooksByCategory(categoryId: string): Book[] {
    return books.filter(book => book.category === categoryId && book.published);
}

export function getPublishedBooks(): Book[] {
    return books.filter(book => book.published);
}

export function getChapterById(bookId: string, chapterId: string): BookChapter | undefined {
    const book = getBookById(bookId);
    return book?.chapters.find(chapter => chapter.id === chapterId);
}

export function getNextChapter(bookId: string, currentChapterId: string): BookChapter | undefined {
    const book = getBookById(bookId);
    if (!book) return undefined;

    const currentChapter = book.chapters.find(c => c.id === currentChapterId);
    if (!currentChapter) return undefined;

    const publishedChapters = book.chapters
        .filter(c => c.published)
        .sort((a, b) => a.order - b.order);
    const currentIndex = publishedChapters.findIndex(c => c.id === currentChapterId);

    return currentIndex >= 0 && currentIndex < publishedChapters.length - 1
        ? publishedChapters[currentIndex + 1]
        : undefined;
}

export function getPreviousChapter(
    bookId: string,
    currentChapterId: string,
): BookChapter | undefined {
    const book = getBookById(bookId);
    if (!book) return undefined;

    const currentChapter = book.chapters.find(c => c.id === currentChapterId);
    if (!currentChapter) return undefined;

    const publishedChapters = book.chapters
        .filter(c => c.published)
        .sort((a, b) => a.order - b.order);
    const currentIndex = publishedChapters.findIndex(c => c.id === currentChapterId);

    return currentIndex > 0 ? publishedChapters[currentIndex - 1] : undefined;
}
